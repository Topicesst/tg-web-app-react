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
  const [name, setName] = useState('');
  const [numberphone, setNumberPhone] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [showMap, setShowMap] = useState(false);
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

  const handleLocationSelect = async (latlng) => {
    try {
      const addressData = await fetchAddress(latlng);
      const streetName = addressData.address.road || addressData.address.pedestrian || '';
      const houseNumber = addressData.address.house_number || '';
      const cityOrTown = addressData.address.city || addressData.address.town || addressData.address.village || '';
      
      setStreet(`${streetName} ${houseNumber}`.trim());
      setCity(cityOrTown);
      
      setShowMap(false); // Закриваємо модальне вікно після вибору місцезнаходження
    } catch (error) {
      console.error('Помилка при отриманні адреси: ', error);
    }
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

  return (
    <div className="form">
      <h3>Введіть ваші дані:</h3>
      <input
        className="input"
        type="text"
        placeholder="ПІБ"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        className="input"
        type="text"
        placeholder="Вулиця"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <h4>Доставка:</h4>
      <select
        className="select"
        value={deliveryMethod}
        onChange={(e) => setDeliveryMethod(e.target.value)}
      >
        <option value="courier">Кур'єр</option>
        <option value="pickup">Самовивіз</option>
      </select>
      <button type="button" className="button-select-location" onClick={() => setShowMap(true)}>
        Вибрати місцезнаходження на карті
      </button>
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