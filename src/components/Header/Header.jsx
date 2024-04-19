import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';

const Header = () => {
    const { user, onClose } = useTelegram();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    if (!isHomePage) {
        return null; 
    }

    return (
        <div className={'header'}>
            <h1>Замовлення їжі:</h1>
        </div>
    );
};

export default Header;
