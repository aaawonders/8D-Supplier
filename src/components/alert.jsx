import { useState, useEffect, useRef } from 'react';
import './css/alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCircleInfo, faCircleCheck, faCircleXmark)



const Alert = ({type, alert, link, duration}) => {
    const [animation, setAnimation] = useState('')
    const barRef = useRef(null);

    if (duration === undefined) {
        duration = 5000;
    }

    useEffect(() => {
        setInterval(() => {
            if (barRef.current) {
                barRef.current.style.transition = `width ${duration}ms linear`;
                barRef.current.style.width = '0%';
                barRef.current.style.animation = ``;
                setAnimation('AlertIn')

                setTimeout(() =>{
                    setAnimation('');
                    setTimeout(() =>{
                        setAnimation('AlertOut');
                    }, duration)
                }, 1000)

            }
        }, 100)
    }, [duration]);


    return (
        <div className={`alert no-link alert-${type} ${animation}`}>
            <span className={`icon-info`}><FontAwesomeIcon icon={type == 'warn' ? 'fa-circle-info' : type == 'success' ? 'fa-circle-check' : type == 'error' ? 'fa-circle-xmark' : ''}/></span>
            <span className={`content-alert`}>{alert}</span>
            <span className={`bar-duration`}>
                <span ref={barRef} className={`bar-progress`}></span>
            </span>
        </div>
    )
}


export default Alert;