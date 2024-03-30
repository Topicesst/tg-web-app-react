import React, { useState, useCallback, useEffect } from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram"; // Переконайтеся, що шлях до файлу правильний
import burgerImg from "../images/burger.png";
import pizzaImg from "../images/pizza.png";
import kebabImg from "../images/kebab.png";
import saladImg from "../images/salad.png";
import icecreamImg from "../images/icecream.png";
import icecream1Img from "../images/icecream1.png";
import cocaImg from "../images/coca.png";
import waterImg from "../images/water.png";

const products = [
    // Ваші продукти...
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + item.price, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg } = useTelegram();

    useEffect(() => {
        console.log("Telegram WebApp initialized:", tg);
    }, [tg]);

    const onSendData = useCallback(() => {
        console.log("onSendData called");
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId: tg.initDataUnsafe?.query_id, // Використовуємо безпечні дані з tg
        };

        fetch('http://80.85.143.220:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }, [addedItems, tg]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    const onAdd = (product) => {
        // Логіка додавання продуктів...
    };

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
