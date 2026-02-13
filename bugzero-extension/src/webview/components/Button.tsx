import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
    return (
        <button 
            style={{
                backgroundColor: disabled ? 'var(--vscode-button-secondaryBackground)' : 'var(--vscode-button-background)',
                color: disabled ? 'var(--vscode-button-secondaryForeground)' : 'var(--vscode-button-foreground)',
                border: 'none',
                padding: '5px 10px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                opacity: disabled ? 0.6 : 1
            }}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;
