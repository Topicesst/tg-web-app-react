import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const fetchAddress = async (latlng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
  );
  if (!response.ok) {
    throw new Error('Не вдалося отримати адресу');
  }
  const data = await response.json();
  return data;
};

const Form = () => {
    const [name, setName] = useState(''); // Оголошення змінної для імені
    const [numberphone, setNumberPhone] = useState(''); // Оголошення змінної для номеру телефону
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();

    useEffect(() => {
      tg.onEvent('mainButtonClicked', onSendData)
      return () => {
          tg.offEvent('mainButtonClicked', onSendData)
      }
  }, [onSendData])

  useEffect(() => {
      tg.MainButton.setParams({
          text: 'Відправити дані'
      })
  }, [])

    const onSendData = useCallback(() => {
        const data = {
            name,
            numberphone,
            city,
            street,
            deliveryMethod
        }
        tg.sendData(JSON.stringify(data));
    }, [name, numberphone, city, street, deliveryMethod]);

  
    useEffect(() => {
        if (!street || !country || !name || !numberphone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [country, street, name, numberphone])

    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeNumberPhone = (e) => {
        setNumberPhone(e.target.value)
    }

    const onChangeCountry = (e) => {
        setCountry(e.target.value)
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
    }

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