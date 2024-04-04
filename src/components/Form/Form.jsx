import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const centerCoords = [48.281255389712804, 25.97772702722112]; // Центральна точка для розрахунків

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Приблизний розрахунок відстані між двома точками
  const R = 6371; // Радіус Землі в км
  const dLat = L.LatLng.degreesToRadians(lat2 - lat1);
  const dLon = L.LatLng.degreesToRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(L.LatLng.degreesToRadians(lat1)) * Math.cos(L.LatLng.degreesToRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('courier');
    const [deliveryPrice, setDeliveryPrice] = useState('');
    const { tg } = useTelegram();

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, []);

    useEffect(() => {
        tg.MainButton.setParams({ text: 'Відправити дані' });
        if (!street || !city || !name || numberphone.length !== 13) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [city, street, name, numberphone]);

    const onSendData = useCallback(() => {
        const data = { name, numberphone, city, street, deliveryMethod };
        tg.sendData(JSON.stringify(data));
    }, [name, numberphone, city, street, deliveryMethod]);

    useEffect(() => {
        if (deliveryMethod === 'courier') {
            setDeliveryPrice(`Розрахунок...`);
        } else {
            setDeliveryPrice('Безкоштовно');
        }
    }, [deliveryMethod]);

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

            const distance = calculateDistance(latlng.lat, latlng.lng, centerCoords[0], centerCoords[1]);
            if (deliveryMethod === 'courier') {
                setDeliveryPrice(`${(distance * 1).toFixed(2)} грн`); // 1 км = 1 грн
            }

            setShowMap(false);
        } catch (error) {
            console.error('Помилка при отриманні адреси: ', error);
        }
    };

    return (
        <div className="form">
            <h3>Введіть ваші дані:</h3>
            <input className="input" type="text" placeholder="ПІБ" value={name} onChange={e => setName(e.target.value)} />
            <input
                className="input"
                type="tel"
                placeholder="Номер телефону"
                value={numberphone}
                onChange={e => {
                    let value = e.target.value.replace(/[^\d+]/g, '');
                    if (value && !value.startsWith('+380')) {
                        value = '+380' + value.replace(/\+/g, '');
                    }
                    if (value.length > 13) {
                        value = value.slice(0, 13);
                    }
                    setNumberPhone(value);
                }}
                pattern="^\+380\d{3}\d{2}\d{2}\d{2}$"
                title="+380XXXXXXXX (де X - цифра від 0 до 9)"
            />
            <input className="input" type="text" placeholder="Місто" value={city} onChange={e => setCity(e.target.value)} />
            <input className="input" type="text" placeholder="Вулиця" value={street} onChange={e => setStreet(e.target.value)} />
            <button type="button" className="button-select-location" onClick={() => setShowMap(true)}>
                Вибрати місцезнаходження на карті
            </button>
            <label className="delivery-label">Доставка:</label>
            <select
                className="select select-delivery"
                value={deliveryMethod}
                onChange={e => {
                    setDeliveryMethod(e.target.value);
                    if (e.target.value === 'pickup') {
                        setDeliveryPrice('Безкоштовно');
                    }
                }}
            >
                <option value="courier">Кур'єр</option>
                <option value="pickup">Самовивіз</option>
            </select>
            {deliveryMethod === 'courier' && <div>Ціна доставки: {deliveryPrice}</div>}
            {deliveryMethod === 'pickup' && (
                <div>
                    Ціна доставки: Безкоштовно
                    <br />
                    Адреса для самовивозу: вулиця Руська, 209-Б, Чернівці, Чернівецька область, Україна
                </div>
            )}
            {showMap && (
                <div className="map-modal">
                    <MapContainer center={centerCoords} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                    <button type="button" onClick={() => setShowMap(false)}>Закрити карту</button>
                </div>
            )}
        </div>
    );
};

export default Form;
