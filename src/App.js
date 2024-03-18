import React, { useState, useEffect } from 'react';
import './App.css';
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import { Route, Routes } from 'react-router-dom';
import Card from "./components/Card/Card";
import Cart from "./components/Cart/Cart";
import Form from "./components/Form/Form";
import { getData } from "./db/db"; // Імпортуємо функцію getData для отримання даних про їжу

function App() {
    const { onToggleButton, tg } = useTelegram();
    const [cartItems, setCartItems] = useState([]); // Стан для елементів кошика
    const foods = getData(); // Отримуємо дані про їжу

    useEffect(() => {
        tg.ready();
    }, [tg]); // Викликаємо телеграм тільки при зміні tg

    // Функція додавання продукту до кошика
    const onAdd = (food) => {
        const exist = cartItems.find((x) => x.id === food.id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...food, quantity: 1 }]);
        }
    };

    // Функція видалення продукту з кошика
    const onRemove = (food) => {
        const exist = cartItems.find((x) => x.id === food.id);
        if (exist.quantity === 1) {
            setCartItems(cartItems.filter((x) => x.id !== food.id));
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
                )
            );
        }
    };

    // Функція оформлення замовлення
    const onCheckout = () => {
        // Ваша логіка для оформлення замовлення
    };

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<Cart cartItems={cartItems} onCheckout={onCheckout} />} />
                <Route path="/form" element={<Form />} />
            </Routes>
            <div className="cards__container">
                {foods.map((food) => (
                    <Card key={food.id} food={food} onAdd={onAdd} onRemove={onRemove} />
                ))}
            </div>
        </div>
    );
}

export default App;
