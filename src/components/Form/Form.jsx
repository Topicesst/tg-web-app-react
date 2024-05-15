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

    useEffect(() => {
        const updateLocationFromAddress = async () => {
            if (!city || !street) return;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(street)},+${encodeURIComponent(city)}`
                );
                const data = await response.json();
                if (data && data.length > 0) {
                    setSelectedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                }
            } catch (error) {
                console.error('Error obtaining coordinates:', error);
            }
        };

        updateLocationFromAddress();
    }, [city, street]);

   const onSendData = useCallback(() => {
    const deliveryPrice = calculateDeliveryPrice();
    const deliveryTime = calculateDeliveryTime();

    const data = {
        name,
        numberphone, 
        city,
        street,
        deliveryMethod,
        deliveryPrice,
        deliveryTime,
    };

    console.log('Дані, які відправляються:', data);

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

    useEffect(() => {
        const formData = { name, numberphone, city, street, selectedLocation, deliveryMethod };
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [name, numberphone, city, street, selectedLocation, deliveryMethod]);
    
    useEffect(() => {
        const storedData = localStorage.getItem('formData');
        if (storedData) {
            const { name, numberphone, city, street, selectedLocation, deliveryMethod } = JSON.parse(storedData);
            setName(name);
            setNumberPhone(numberphone);
            setCity(city);
            setStreet(street);
            setSelectedLocation(selectedLocation);
            setDeliveryMethod(deliveryMethod);
        }
    }, []);
    

    const onChangeName = (e) => setName(e.target.value);
    const onChangeCity = (e) => setCity(e.target.value);
    const onChangeStreet = (e) => setStreet(e.target.value);

    const handleLocationSelect = async (latlng) => {
        setSelectedLocation(latlng);
        try {
            const addressData = await fetchAddress(latlng);
            if (addressData.address) {
                const { road = '', house_number = '', city: addrCity = '', town = '', village = '' } = addressData.address;
                const streetName = road || '';
                const houseNumber = house_number || '';
                const cityOrTown = addrCity || town || village || '';
                setStreet(`${streetName} ${houseNumber}`.trim());
                setCity(cityOrTown);
            }
            setShowMap(false);
        } catch (error) {
            console.error('Помилка при отриманні адреси: ', error);
        }
    };

    const fetchAddress = async (latlng) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
        if (!response.ok) throw new Error('Не вдалося отримати адресу');
        return await response.json();
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111;

    const calculateDeliveryPrice = () => {
        if (deliveryMethod === 'pickup') {
            return 'Безкоштовно';
        } else if (selectedLocation && deliveryMethod === 'courier') {
            const distance = calculateDistance(48.281255389712804, 25.97772702722112, selectedLocation.lat, selectedLocation.lng);
            const deliveryPrice = 20 + distance * 1;
            return `${deliveryPrice.toFixed(2)} грн`;
        }
        return 'Не вибрано місцезнаходження';
    };

    const calculateDeliveryTime = () => {
        if (selectedLocation && deliveryMethod === 'courier') {
            const distance = calculateDistance(48.281255389712804, 25.97772702722112, selectedLocation.lat, selectedLocation.lng);
            const timeHours = distance / 40;
            const totalTimeInMinutes = Math.round(timeHours * 60) + 10;
    
            const hours = Math.floor(totalTimeInMinutes / 60);
            const minutes = totalTimeInMinutes % 60;
    
            const getHourForm = (num) => {
                if (num === 1) return 'година';
                if (num >= 2 && num <= 4) return 'години';
                return 'годин';
            };
    
            const getMinuteForm = (num) => {
                if (num % 10 === 1 && num % 100 !== 11) return 'хвилина';
                if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) return 'хвилини';
                return 'хвилин';
            };

            let timeString = '';
            if (hours > 0) timeString += `${hours} ${getHourForm(hours)} `;
            if (minutes > 0) timeString += `${minutes} ${getMinuteForm(minutes)}`;
            if (timeString === '') return 'Менше хвилини';
    
            return `${timeString.trim()}`;
        }
        return 'Не вибрано місцезнаходження або метод доставки';
    };
    
    const onChangeNumberPhone = (e) => {
        let input = e.target.value.replace(/[^\d]/g, ''); 
        if (!input.startsWith('380')) {
          input = '380' + input; 
        }
        setNumberPhone('+' + input.slice(0, 12)); 
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
            {deliveryMethod === 'courier' && (
                <>
                    <div>Ціна доставки: {calculateDeliveryPrice()}</div>
                    <div>Приблизний час доставки: {calculateDeliveryTime()}</div>
                </>
            )}
            {deliveryMethod === 'pickup' && (
                <div>Адреса для самовивозу: вулиця Руська, 209-Б, Чернівці, Чернівецька область, Україна</div>
            )}
        </div>
    );
};

export default Form;
