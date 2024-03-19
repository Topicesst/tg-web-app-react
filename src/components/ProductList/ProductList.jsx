import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";
import burgerImg from "../../images/burger.png";

const products = [
    {id: '1', title: 'Гамбургер', price: 130, description: <i>Класичний з зеленню</i>, Image: burgerImg },
    {id: '2', title: 'Піца', price: 220, description: <i>Сирна з ковбасками</i>},
    {id: '3', title: 'Кебаб', price: 160, description: <i>Курячий в солодкому соусі</i>},
    {id: '4', title: 'Салат Цезар', price: 150, description: <i>слово</i>},
    {id: '5', title: 'Морозиво в ріжку', price: 60, description: <i>Малинове</i>},
    {id: '6', title: 'Морозиво в стаканчику', price: 85, description: <i>Смородинове</i>},
    {id: '7', title: 'Пляшка коли', price: 35, description: <i>Газований солодкий напій</i>},
    {id: '8', title: 'Пляшка води', price: 25, description: <i>Газований напій</i>},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

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