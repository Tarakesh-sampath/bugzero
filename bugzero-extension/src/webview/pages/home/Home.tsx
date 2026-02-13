import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';

interface FileEntry {
    name: string;
    type: 'file' | 'directory';
}

interface Problem {
    id: string;
    lang: string;
    code: string;
    level: string;
    testcases: { input: string; output: string }[];
}

const Home = () => {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState('');
    const [error, setError] = useState('');
    const [submittedFiles, setSubmittedFiles] = useState<Set<string>>(new Set());
    const [problemsData, setProblemsData] = useState<Problem[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [runResults, setRunResults] = useState<Record<string, any>>({});

    // @ts-ignore
    const vscode = React.useMemo(() => acquireVsCodeApi(), []);

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.command) {
                case 'files':
                    setFiles(message.value);
                    break;
                case 'loginResponse':
                    if (message.success) {
                        setIsLoggedIn(true);
                        setAuth(message.auth);
                        setUsername(message.username);
                        if (message.user && message.user.submissions) {
                            const submitted = new Set<string>(
                                message.user.submissions.map((s: any) => s.problemId)
                            );
                            setSubmittedFiles(submitted);
                        }
                        if (message.problems) {
                            setProblemsData(message.problems);
                        }
                        vscode.postMessage({ command: 'getFiles' });
                    } else {
                        setError(message.error);
                    }
                    break;
                case 'logoutSuccess':
                    setIsLoggedIn(false);
                    setAuth('');
                    setUsername('');
                    setPassword('');
                    setSubmittedFiles(new Set());
                    setProblemsData([]);
                    break;
                case 'submissionResponse':
                    if (message.success) {
                        const problemId = message.fileName.split('.')[0];
                        setSubmittedFiles(prev => new Set([...prev, problemId]));
                    }
                    break;
                case 'activeFile':
                    setActiveFile(message.fileName);
                    break;
                case 'runResult':
                    setRunResults(prev => ({
                        ...prev,
                        [message.expectedOutput]: message // Using expectedOutput as key is a bit hacky but works for simple cases
                    }));
                    break;
                case 'pullSuccess':
                    if (message.problems) {
                        setProblemsData(message.problems);
                    }
                    break;
            }
        };

        window.addEventListener('message', handler);
        
        // Check for persisted login state on mount
        vscode.postMessage({ command: 'checkLogin' });

        return () => window.removeEventListener('message', handler);
    }, [vscode]);

    const handleLogin = () => {
        console.log("Attempting login in webview for:", username);
        setError('');
        vscode.postMessage({ command: 'login', value: { username, password } });
    };

    const handleLogout = () => {
        vscode.postMessage({ command: 'logout' });
    };

    const handleSubmit = (fileName: string) => {
        console.log("Submitting file in webview:", fileName);
        vscode.postMessage({ command: 'submit', value: { fileName, auth } });
    };

    const handleOpenFile = (fileName: string) => {
        vscode.postMessage({ command: 'openFile', value: { fileName } });
    };

    const handleRun = (fileName: string, input: string, output: string) => {
        setRunResults(prev => ({ ...prev, [output]: { loading: true } }));
        vscode.postMessage({ 
            command: 'run', 
            value: { fileName, input, expectedOutput: output } 
        });
    };

    const handleRunAll = (problem: Problem) => {
        const fileName = `${problem.id}.${problem.lang}`;
        problem.testcases.forEach(tc => {
            handleRun(fileName, tc.input, tc.output);
        });
    };

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Login to BugZero</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{ padding: '5px', background: 'var(--vscode-input-background)', color: 'var(--vscode-input-foreground)', border: '1px solid var(--vscode-input-border)' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{ padding: '5px', background: 'var(--vscode-input-background)', color: 'var(--vscode-input-foreground)', border: '1px solid var(--vscode-input-border)' }}
                    />
                    <Button label="Login" onClick={handleLogin} />
                    {error && <p style={{ color: 'var(--vscode-errorForeground)' }}>{error}</p>}
                </div>
            </div>
        );
    }

    const problems = files.filter(f => f.type === 'file' && (f.name.endsWith('.c') || f.name.endsWith('.py')));
    const activeProblem = problemsData.find(p => activeFile === `${p.id}.${p.lang}`);

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--vscode-panel-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Problems</h2>
                    <span style={{ fontSize: '0.8em', opacity: 0.8 }}>Hi, {username}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{ 
                        background: 'transparent', 
                        color: 'var(--vscode-errorForeground)',
                        border: '1px solid var(--vscode-errorForeground)',
                        padding: '2px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8em'
                    }}
                >
                    Logout
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--vscode-panel-border)' }}>
                        <th style={{ padding: '5px' }}>Type</th>
                        <th style={{ padding: '5px' }}>Name</th>
                        <th style={{ padding: '5px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map(file => {
                        const isPython = file.name.endsWith('.py');
                        const displayName = file.name.split('.')[0];
                        const problemId = file.name.split('.')[0];
                        const isSubmitted = submittedFiles.has(problemId);
                        const isActive = activeFile === file.name;
                        const problemInfo = problemsData.find(p => p.id === problemId);
                        
                        return (
                            <tr key={file.name} style={{ borderBottom: '1px solid var(--vscode-panel-border)', background: isActive ? 'var(--vscode-list-activeSelectionBackground)' : 'transparent' }}>
                                <td style={{ padding: '5px', fontSize: '1.2em' }}>
                                    {isPython ? '🐍' : 'C'}
                                </td>
                                <td style={{ padding: '5px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span 
                                            onClick={() => handleOpenFile(file.name)}
                                            style={{ cursor: 'pointer', color: isActive ? 'var(--vscode-list-activeSelectionForeground)' : 'var(--vscode-textLink-foreground)' }}
                                            title="Click to open file"
                                        >
                                            {displayName}
                                        </span>
                                        {problemInfo && <LevelChip level={problemInfo.level} />}
                                    </div>
                                </td>
                                <td style={{ padding: '5px' }}>
                                    <ActionButton 
                                        isSubmitted={isSubmitted} 
                                        onClick={() => handleSubmit(file.name)} 
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {activeProblem && (
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--vscode-panel-border)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ margin: 0 }}>Test Cases: {activeProblem.id}</h3>
                            <LevelChip level={activeProblem.level} />
                        </div>
                        <button 
                            onClick={() => handleRunAll(activeProblem)}
                            style={{ 
                                background: 'var(--vscode-button-background)',
                                color: 'var(--vscode-button-foreground)',
                                border: 'none',
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: '0.85em'
                            }}
                        >
                            Run All
                        </button>
                    </div>
                    {activeProblem.testcases.map((tc, index) => {
                        const result = runResults[tc.output];
                        return (
                            <div key={index} style={{ marginBottom: '15px', padding: '10px', background: 'var(--vscode-sideBar-background)', border: '1px solid var(--vscode-panel-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <strong>Case {index + 1}</strong>
                                    <button 
                                        onClick={() => handleRun(`${activeProblem.id}.${activeProblem.lang}`, tc.input, tc.output)}
                                        disabled={result?.loading}
                                        style={{ 
                                            background: 'var(--vscode-button-background)',
                                            color: 'var(--vscode-button-foreground)',
                                            border: 'none',
                                            padding: '2px 8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {result?.loading ? 'Running...' : 'Run'}
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                                    <div>Input: <code style={{ background: 'var(--vscode-textCodeBlock-background)' }}>{tc.input}</code></div>
                                    <div>Expected: <code style={{ background: 'var(--vscode-textCodeBlock-background)' }}>{tc.output}</code></div>
                                </div>
                                {result && !result.loading && (
                                    <div style={{ marginTop: '10px', paddingTop: '5px', borderTop: '1px dashed var(--vscode-panel-border)' }}>
                                        <div style={{ color: result.success ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-errorForeground)', fontWeight: 'bold' }}>
                                            {result.success ? 'PASS ✓' : 'FAIL ✗'}
                                        </div>
                                        {!result.success && (
                                            <div style={{ fontSize: '0.85em', marginTop: '5px' }}>
                                                {result.stderr ? (
                                                    <pre style={{ color: 'var(--vscode-errorForeground)', whiteSpace: 'pre-wrap' }}>{result.stderr}</pre>
                                                ) : (
                                                    <>
                                                        <div>Actual: <code>{result.actualOutput}</code></div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {problems.length === 0 && <p style={{ marginTop: '10px', opacity: 0.7 }}>No .c or .py files found.</p>}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button label="Refresh Files" onClick={() => vscode.postMessage({ command: 'getFiles' })} />
                <Button label="Pull Missing" onClick={() => vscode.postMessage({ command: 'pull' })} />
            </div>
        </div>
    );
};

const LevelChip = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
        easy: '#4caf50',
        medium: '#ff9800',
        hard: '#f44336'
    };

    return (
        <span style={{
            fontSize: '0.7em',
            padding: '1px 6px',
            borderRadius: '10px',
            backgroundColor: colors[level.toLowerCase()] || 'gray',
            color: 'white',
            width: 'fit-content',
            textTransform: 'capitalize'
        }}>
            {level}
        </span>
    );
};

const ActionButton = ({ isSubmitted, onClick }: { isSubmitted: boolean, onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (isSubmitted && !isHovered) {
        return (
            <div 
                onMouseEnter={() => setIsHovered(true)}
                style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: '2px 8px',
                    color: 'var(--vscode-testing-iconPassed)',
                    fontSize: '1.2em'
                }}
            >
                ✓
            </div>
        );
    }

    return (
        <button 
            onClick={onClick}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                background: 'var(--vscode-button-secondaryBackground)', 
                color: 'var(--vscode-button-secondaryForeground)',
                border: 'none',
                padding: '2px 8px',
                cursor: 'pointer',
                width: '100%'
            }}
        >
            Submit
        </button>
    );
};

export default Home;
