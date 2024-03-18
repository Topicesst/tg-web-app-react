import React from "react";
import "./Button.css";

// Компонент кнопки, який приймає тип, заголовок, стан відключення та обробник кліків
function Button({ type, title, disable, onClick }) {
    return (
        <button
            className={`btn ${
                type === "add" ? "add" : type === "remove" ? "remove" : type === "checkout" ? "checkout" : ""
            }`}
            disabled={disable} // Встановлює стан відключення кнопки
            onClick={onClick} // Встановлює обробник кліків на кнопці
        >
            {title} {/* Відображає заголовок кнопки */}
        </button>
    );
}

export default Button; // Експортує компонент Button
