import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Потрібно додати імпорт для LocationPicker

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('courier');
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            name,
            numberphone,
            city,
            street,
            deliveryMethod
        };
        tg.sendData(JSON.stringify(data));
    }, [name, numberphone, city, street, deliveryMethod]);

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
        if (!street || !city || !name || numberphone.length !== 13) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [city, street, name, numberphone]);

    const onChangeName = (e) => {
        setName(e.target.value);
    };

    const onChangeNumberPhone = (e) => {
        let value = e.target.value.replace(/[^\d+]/g, '');
        if (value && !value.startsWith('+380')) {
            value = '+380' + value.replace(/\+/g, '');
        }
        if (value.length > 13) {
            value = value.slice(0, 13);
        }
        setNumberPhone(value);
    };

    const onChangeCity = (e) => {
        setCity(e.target.value);
    };

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    };

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

    const handleLocationSelect = async (latlng) => {
        try {
            const addressData = await fetchAddress(latlng);
            const streetName = addressData.address.road || addressData.address.pedestrian || '';
            const houseNumber = addressData.address.house_number || '';
            const cityOrTown = addressData.address.city || addressData.address.town || addressData.address.village || '';

            setStreet(`${streetName} ${houseNumber}`.trim());
            setCity(cityOrTown);

            setShowMap(false);
        } catch (error) {
            console.error('Помилка при отриманні адреси: ', error);
        }
    };

    return (
        <div className="form">
            <h3>Введіть ваші дані:</h3>
            <input
                className="input"
                type="text"
                placeholder="ПІБ"
                value={name}
                onChange={onChangeName}
            />
            <input
                className="input"
                type="tel"
                placeholder="Номер телефону"
                value={numberphone}
                onChange={onChangeNumberPhone}
                pattern="^\+380\d{3}\d{2}\d{2}\d{2}$"
                title="+380XXXXXXXX (де X - цифра від 0 до 9)"
            />
            <input
                className="input"
                type="text"
                placeholder="Місто"
                value={city}
                onChange={onChangeCity}
            />
            <input
                className="input"
                type="text"
                placeholder="Вулиця"
                value={street}
                onChange={onChangeStreet}
            />
            <button type="button" className="button-select-location" onClick={() => setShowMap(true)}>
                Вибрати місцезнаходження на карті
            </button>
            <label className="delivery-label">Доставка:</label>
            <select
                className="select select-delivery"
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
            >
                <option value="courier">Кур'єр</option>
                <option value="pickup">Самовивіз</option>
            </select>
            {showMap && (
                <div className="map-modal">
                    <MapContainer center={[50.4501, 30.5234]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* Припускаємо, що LocationPicker - це ваш кастомний компонент */}
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                    <button type="button" onClick={() => setShowMap(false)}>Закрити карту</button>
                </div>
            )}
        </div>
    );
};

export default Form;
