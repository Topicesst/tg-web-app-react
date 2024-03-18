import React from "react";
import "./Cart.css";
import Button from "../Button/Button";

function Cart({ cartItems, onCheckout }) {
    const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

    return (
        <div className="cart__container">
            <br />
            {/* Використання шаблонних рядків для вставки змінної totalPrice */}
            <span className="">Загальна сума: {totalPrice.toFixed(0)}₴</span>
            {/* Використання шаблонних рядків для встановлення тексту кнопки залежно від наявності елементів у кошику */}
            <Button
                title={`${cartItems.length === 0 ? "Корзина пуста" : "Оформити замовлення"}`}
                type={"checkout"}
                disable={cartItems.length === 0 ? true : false}
                onClick={onCheckout}
            />
        </div>
    );
}

export default Cart;
