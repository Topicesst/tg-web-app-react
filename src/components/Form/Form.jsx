import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('courier');
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
      const deliveryPrice = calculateDeliveryPrice();
      const data = {
          name,
          numberphone,
          city,
          street,
          deliveryMethod,
          deliveryPrice,
          deliveryTime
      };
      tg.sendData(JSON.stringify(data));
    }, [name, numberphone, city, street, deliveryMethod, selectedLocation]);
    

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

    const handleLocationSelect = async (latlng) => {
        setSelectedLocation(latlng);
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

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        // Ваша реалізація обчислення відстані
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Прикладна формула
    };

    const calculateDeliveryPrice = () => {
      if (deliveryMethod === 'pickup') {
          return 'Безкоштовно';
      } else if (selectedLocation && deliveryMethod === 'courier') {
          const distance = calculateDistance(48.281255389712804, 25.97772702722112, selectedLocation.lat, selectedLocation.lng);
          const deliveryPrice = 20 + distance.toFixed(2) * 1;
          return `${deliveryPrice.toFixed(2)} грн`;
      }
      return 'Не вибрано місцезнаходження';
  };

  const calculateDeliveryTime = () => {
    if (selectedLocation && deliveryMethod === 'courier') {
        const distance = calculateDistance(48.281255389712804, 25.97772702722112, selectedLocation.lat, selectedLocation.lng);
        const timeHours = distance / 40; // Відстань ділимо на швидкість
        // Додаємо 10 хвилин до загального часу доставки
        const totalTimeInMinutes = Math.round(timeHours * 60) + 10; // Перетворення часу в хвилини та додавання 10 хвилин

        const hours = Math.floor(totalTimeInMinutes / 60); // Повні години
        const minutes = totalTimeInMinutes % 60; // Залишкові хвилини

        let timeString = '';
        if (hours > 0) timeString += `${hours} година${hours > 1 ? 'и' : ''} `;
        if (minutes > 0) timeString += `${minutes} хвилин${minutes > 1 ? 'и' : ''}`;
        if (timeString === '') return 'Менше хвилини';

        return `Приблизно ${timeString.trim()}`;
    }
    return 'Не вибрано місцезнаходження або метод доставки';
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
                <MapContainer center={[48.281255389712804, 25.97772702722112]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                </MapContainer>
                <button type="button" onClick={() => setShowMap(false)}>Закрити карту</button>
            </div>
        )}
        <div>Ціна доставки: {calculateDeliveryPrice()}</div>
        <div>Середній час доставки: {calculateDeliveryTime()}</div>
        {deliveryMethod === 'pickup' && (
            <div>Адреса для самовивозу: вулиця Руська, 209-Б, Чернівці, Чернівецька область, Україна</div>
        )}
    </div>
   );
};

export default Form;