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
        if (!street || !country || !name || !numberphone || !/^\+380\d{9}$/.test(numberphone)) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [country, street, name, numberphone]);

    const onChangeName = (e) => {
        setName(e.target.value);
    };

    const onChangeNumberPhone = (e) => {
        const newValue = e.target.value;
        // Перевірка на відповідність регулярному виразу перед оновленням стану
        if (/^\+380\d*$/.test(newValue) || newValue === '') {
            setNumberPhone(newValue);
        }
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
                type="text"
                placeholder={'Номер телефону'}
                value={numberphone}
                onChange={onChangeNumberPhone}
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
