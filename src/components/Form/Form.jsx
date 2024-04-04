import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

// Підготовка стилів для карти (припускаємо, що ви маєте власні стилі)
// Забезпечте, щоб .map-modal мав адекватні стилі для відображення модального вікна

// Компонент для вибору місцезнаходження на карті
function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
      // Тут можна додати закриття модального вікна після вибору, якщо потрібно
    },
  });
  return null;
}

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const [showMap, setShowMap] = useState(false); // Для керування відображенням модального вікна з картою
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

    const handleLocationSelect = (latlng) => {
        console.log(latlng); // Виведення координат для перевірки
        // Тут вам потрібно додати інтеграцію з API для перетворення координат в адресу
        setShowMap(false); // Закриваємо модальне вікно після вибору місцезнаходження
    };

    return (
        <div className="form">
            <h3>Введіть ваші дані:</h3>
            <input
                className="input"
                type="tel"
                placeholder="Номер телефону"
                value={numberphone}
                onChange={(e) => setNumberPhone(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="ПІБ"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="Місто"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="Вулиця"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
            <select
                className="select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            >
                <option value="physical">Фіз. особа</option>
                <option value="legal">Юр. особа</option>
            </select>
            <button type="button" onClick={() => setShowMap(true)}>Вибрати місцезнаходження на карті</button>
            {showMap && (
                <div className="map-modal">
                    <MapContainer center={[50.4501, 30.5234]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                    <button type="button" onClick={() => setShowMap(false)}>Закрити карту</button>
                </div>
            )}
        </div>
    );
};

export default Form;