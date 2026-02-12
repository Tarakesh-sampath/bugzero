import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <button 
            style={{
                backgroundColor: 'var(--vscode-button-background)',
                color: 'var(--vscode-button-foreground)',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                width: '100%'
            }}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
