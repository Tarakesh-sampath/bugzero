import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';

interface FileEntry {
    name: string;
    type: 'file' | 'directory';
}

const Home = () => {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState('');
    const [error, setError] = useState('');
    const [submittedFiles, setSubmittedFiles] = useState<Set<string>>(new Set());

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
                    break;
                case 'submissionResponse':
                    if (message.success) {
                        const problemId = message.fileName.split('.')[0];
                        setSubmittedFiles(prev => new Set([...prev, problemId]));
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
                        return (
                            <tr key={file.name} style={{ borderBottom: '1px solid var(--vscode-panel-border)' }}>
                                <td style={{ padding: '5px', fontSize: '1.2em' }}>
                                    {isPython ? '🐍' : 'C'}
                                </td>
                                <td style={{ padding: '5px' }}>
                                    <span 
                                        onClick={() => handleOpenFile(file.name)}
                                        style={{ cursor: 'pointer', color: 'var(--vscode-textLink-foreground)' }}
                                        title="Click to open file"
                                    >
                                        {displayName}
                                    </span>
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
            {problems.length === 0 && <p style={{ marginTop: '10px', opacity: 0.7 }}>No .c or .py files found.</p>}
            <div style={{ marginTop: '20px' }}>
                <Button label="Refresh Files" onClick={() => vscode.postMessage({ command: 'getFiles' })} />
            </div>
        </div>
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
