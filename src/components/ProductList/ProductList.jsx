import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";
import burgerImg from "../images/burger.png";
import pizzaImg from "../images/pizza.png";
import kebabImg from "../images/kebab.png";
import saladImg from "../images/salad.png";
import icecreamImg from "../images/icecream.png";
import icecream1Img from "../images/icecream1.png";
import cocaImg from "../images/coca.png";
import waterImg from "../images/water.png";


const products = [
    {id: '1', title: 'Гамбургер', price: 130, description: <i>(Класичний з зеленню)</i>, Image: burgerImg },
    {id: '2', title: 'Піца', price: 220, description: <i>(Сирна з ковбасками)</i>, Image: pizzaImg },
    {id: '3', title: 'Кебаб', price: 160, description: <i>(Курячий в солодкому соусі)</i>, Image: kebabImg },
    {id: '4', title: 'Салат "Цезар"', price: 150, description: <i>(Овочевий з сиром "Фета")</i>, Image: saladImg },
    {id: '5', title: 'Морозиво в ріжку', price: 60, description: <i>(Малиновий смак)</i>, Image: icecreamImg },
    {id: '6', title: 'Морозиво в стаканчику', price: 85, description: <i>(Смородиновий смак)</i>, Image: icecream1Img },
    {id: '7', title: 'Пляшка "Coca-Cola"', price: 35, description: <i>(Газований солодкий напій)</i>, Image: cocaImg },
    {id: '8', title: 'Пляшка води', price: 25, description: <i>(Газований напій)</i>, Image: waterImg },
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    // const [addedItems, setAddedItems] = useState([]);
    // const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: '1',
            totalPrice: '1'
        }
        fetch('https://80.85.143.220:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
