import React, { useState } from 'react';
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd }) => {
    const [isAdded, setIsAdded] = useState(false); // Додавання стану для відстеження доданого товару

    const onAddHandler = () => {
        onAdd(product);
        setIsAdded(!isAdded); // Зміна стану при натисканні кнопки
    }

    return (
        <div className={'product ' + className}>
            <div className={'img'}><img src={product.Image} alt={product.title}/></div>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Ціна: <b>{product.price}₴</b></span>
            </div>
            <Button className={`add-btn ${isAdded ? 'added' : ''}`} onClick={onAddHandler}>
                {isAdded ? 'Додано' : 'Додати в кошик'}
            </Button>
        </div>
    );
};

export default ProductItem;
