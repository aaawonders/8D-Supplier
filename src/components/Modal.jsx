import { useState, useEffect, useId } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faChevronDown, faBell, faUser, faUsers, faGear, faClock, faFlag, faX } from '@fortawesome/free-solid-svg-icons'
import { icon, library } from '@fortawesome/fontawesome-svg-core'
import Axios from 'axios';
import './css/Modal.css';


library.add(faPlus, faChevronDown, faBell, faUser, faUsers, faGear, faClock, faFlag, faX)

const Modal = ({title}) => {
    const [UserMenu, setUserMenu] = useState(false);
    const [expand, setExpand] = useState(false);
    const [online, setOnline] = useState(true);
    const [ tabActive, setTabActive ] = useState('Options')

    return (
        <div className={`Modal`}>
            <div className='popup t10'>
                <div className="window">
                    <div className="title">
                        <span>Test title</span>
                        <button
                        className="btn-x"
                        >
                            <FontAwesomeIcon icon={faX}/>
                        </button>
                    </div>
                    <div className="content">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;