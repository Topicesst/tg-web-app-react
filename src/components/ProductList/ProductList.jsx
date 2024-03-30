import React, { useState, useCallback, useEffect } from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import burgerImg from "../images/burger.png";
import pizzaImg from "../images/pizza.png";
import kebabImg from "../images/kebab.png";
import saladImg from "../images/salad.png";
import icecreamImg from "../images/icecream.png";
import icecream1Img from "../images/icecream1.png";
import cocaImg from "../images/coca.png";
import waterImg from "../images/water.png";

const products = [
    { id: '1', title: 'Гамбургер', price: 130, description: <i>(Класичний з зеленню)</i>, Image: burgerImg },
    { id: '2', title: 'Піца', price: 220, description: <i>(Сирна з ковбасками)</i>, Image: pizzaImg },
    { id: '3', title: 'Кебаб', price: 160, description: <i>(Курячий в солодкому соусі)</i>, Image: kebabImg },
    { id: '4', title: 'Салат "Цезар"', price: 150, description: <i>(Овочевий з сиром "Фета")</i>, Image: saladImg },
    { id: '5', title: 'Морозиво в ріжку', price: 60, description: <i>(Малиновий смак)</i>, Image: icecreamImg },
    { id: '6', title: 'Морозиво в стаканчику', price: 85, description: <i>(Смородиновий смак)</i>, Image: icecream1Img },
    { id: '7', title: 'Пляшка "Coca-Cola"', price: 35, description: <i>(Газований солодкий напій)</i>, Image: cocaImg },
    { id: '8', title: 'Пляшка води', price: 25, description: <i>(Газований напій)</i>, Image: waterImg },
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + item.price, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems.map(item => ({ id: item.id, title: item.title })),
            totalPrice: getTotalPrice(addedItems),
        };

        // Відправляємо дані в Telegram бота
        tg.sendData(JSON.stringify(data));
    }, [addedItems, tg]);

    useEffect(() => {
        // Налаштування кнопки Telegram
        tg.MainButton.setParams({
            text: `Купити за ${getTotalPrice(addedItems)}₴`,
            isVisible: addedItems.length > 0,
        });

        // Прослуховування подій кнопки
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, addedItems, tg]);

    const onAdd = useCallback((product) => {
        setAddedItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            return itemExists ? prevItems.filter(item => item.id !== product.id) : [...prevItems, product];
        });
    }, []);

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
