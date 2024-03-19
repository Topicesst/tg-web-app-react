import React from 'react';
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';

const Header = ({ title }) => { // Додаємо параметр title
    const { user, onClose } = useTelegram();

    return (
        <div className={'header'}>
            <h1 className="title">{title}</h1> {"Замовлення їжі:"}
            <Button onClick={onClose}></Button>
        </div>
    );
};

export default Header;
