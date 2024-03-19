import React from 'react';
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';

const Header = () => {
    const { user, onClose } = useTelegram();

    return (
        <div className={'header'}>
            <h1>Замовлення їжі:</h1>
        </div>
    );
};

export default Header;
