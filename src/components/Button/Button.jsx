import React from 'react';
import './Button.css';

// Компонент кнопки, який приймає тип, стан відключення та обробник кліків
function Button({ type, disable, onClick, className }) {
    let symbol; // Символ для кнопки
    if (type === 'add') {
        symbol = '+';
    } else if (type === 'remove') {
        symbol = '-';
    }

    return (
        <button
            className={`button ${className}`} // Додає клас "button" та переданий клас з props
            disabled={disable} // Встановлює стан відключення кнопки
            onClick={onClick} // Встановлює обробник кліків на кнопці
        >
            {symbol} {/* Відображає символ "+" або "-" */}
        </button>
    );
}

export default Button; // Експортує компонент Button
