import burgerImg from "../images/burger.png";
import pizzaImg from "../images/pizza.png";
import kebabImg from "../images/kebab.png";
import saladImg from "../images/salad.png";
import icecreamImg from "../images/icecream.png";
import icecream1Img from "../images/icecream1.png";
import cocaImg from "../images/coca.png";
import waterImg from "../images/water.png";

// Функція, що повертає дані про товари
export function getData() {
    return [
        { title: "Гамбургер", price: 130, Image: burgerImg, id: 1 },
        { title: "Піца", price: 220, Image: pizzaImg, id: 2 },
        { title: "Кебаб", price: 160, Image: kebabImg, id: 3 },
        { title: "Салат Цезар", price: 150, Image: saladImg, id: 4 },
        { title: "Морозиво в ріжку", price: 35, Image: icecreamImg, id: 5 },
        { title: "Морозиво в стаканчику", price: 55, Image: icecream1Img, id: 6 },
        { title: "Пляшка коли", price: 30, Image: cocaImg, id: 7 },
        { title: "Пляшка води", price: 25, Image: waterImg, id: 8 },
    ];
}
