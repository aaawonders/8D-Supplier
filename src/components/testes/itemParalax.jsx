import { useState, useEffect } from 'react';
import './css/itemParalax.css';
import Items from './items.json'


const ItemParallax = () => {
    const [MousePosition, setMousePosition] = useState({
        left: 0,
    })
    const [activeItem, setActiveItem] = useState([1, 0, 0]);

    console.log(MousePosition * 0.2)

    const handleMouseMove = (e) => {
        var pos = e.pageX * 0.2;

        if (pos > 250) return false

        setMousePosition(pos)
        // console.log(e)
    }

    const selItem = (item) => {
        if (activeItem === item) return false

        setActiveItem(item)
    }


    return (
        <div className="ItemParallax">
            <div 
            onMouseMove={(e)=> handleMouseMove(e)}
            onMouseLeave={() => setMousePosition(0)}
            style={{transform: `translateX(${MousePosition}px)`}}
            className='ParallaxSpace'>
                {Items.map((item, index) => (
                    <span key={index} onClick={() => selItem([index,0,0])}className={`item i-${index} ${activeItem[0] === index ? 'active' : ''}`}>{item.produto}
                    {/* {activeItem[0] === index && (
                        <div className={`mouse-info`}>
                            <span>Código: {item.codigo}</span>
                            <span>Desenho: {item.desenho}</span>
                            <span>Revisão: {item.rev}</span>
                        </div>
                    )} */}
                    </span>
                ))}
                <div>

                </div>
            </div>
        </div>
    )
}

export default ItemParallax;