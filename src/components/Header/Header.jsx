import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';

const Header = () => {
    const { user, onClose } = useTelegram();
    const location = useLocation();

    // Перевірка, чи ми на головній сторінці
    const isHomePage = location.pathname === '/';

    // Відображення заголовка тільки на головній сторінці
    if (!isHomePage) {
        return null; // Якщо не на головній сторінці, повертаємо null, щоб не відображати Header
    }

    return (
        <div className={'header'}>
            <h1>Замовлення їжі:</h1>
        </div>
    );
};

export default Header;
