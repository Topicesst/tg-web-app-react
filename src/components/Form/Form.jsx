import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            name,
            numberphone,
            country,
            street,
            subject
        };
        tg.sendData(JSON.stringify(data));
    }, [name, numberphone, country, street, subject]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Відправити дані'
        });
    }, []);

    useEffect(() => {
        if (!street || !country || !name || !numberphone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [country, street, name, numberphone]);

    const onChangeName = (e) => {
        setName(e.target.value);
    };

    const onChangeNumberPhone = (e) => {
        let value = e.target.value.replace(/[^\d+]/g, ''); // Видаляємо все, крім цифр і знака плюс
        if (value && !value.startsWith('+380')) {
            value = '+380' + value.replace(/\+/g, ''); // Видаляємо зайві знаки плюс
        }
        if (value.length > 13) {
            value = value.slice(0, 13); // Обмежуємо довжину введення
        }
        setNumberPhone(value);
    };

    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    };

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    };

    const onChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    return (
        <div className={"form"}>
            <h3>Введіть ваші дані:</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'ПІБ'}
                value={name}
                onChange={onChangeName}
            />
             <input
                className={'input'}
                type="tel"
                placeholder={'Номер телефону'}
                value={numberphone}
                onChange={onChangeNumberPhone}
                pattern="^\+380\d{3}\d{2}\d{2}\d{2}$"
                title="+380XXXXXXXX (де X - цифра від 0 до 9)"
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Місто'}
                value={country}
                onChange={onChangeCountry}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Вулиця'}
                value={street}
                onChange={onChangeStreet}
            />
            <select value={subject} onChange={onChangeSubject} className={'select'}>
                <option value={'physical'}>Фіз. особа</option>
                <option value={'legal'}>Юр. особа</option>
            </select>
        </div>
    );
};

export default Form;
