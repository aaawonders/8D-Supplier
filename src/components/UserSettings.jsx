import { useState, useEffect } from "react";
import './css/UserSetting.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faX } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faUser, faX)

const UserSettings = ({setUserSetting}) => {
    const [ tabActive, setChangeTab] = useState('not')


    const Notifications = () => {

        return (
            <div className={`tab-menu not`}>

            </div>
        )
    }

    return (
    <div className={`User-Setting Pop-up`}>
        <div className={`User-Setting Window`}>
            <div className="Close-tab">
                <span>Configurações do Usuário</span>
                <button onClick={() => setUserSetting(false)} className="close-setting"><FontAwesomeIcon icon={'fa-x'}/></button>
            </div>
            <div className={`Main`}>
                <div className={`tab-chooser`}>
                    <span onClick={() => setChangeTab('user')} className={`tab-op ${tabActive === 'user' ? 'active' : ''}`}>Informações do Usuário</span>
                    <span onClick={() => setChangeTab('not')} className={`tab-op ${tabActive === 'not' ? 'active' : ''}`}>Notificações</span>
                    <span onClick={() => setChangeTab('priv')} className={`tab-op ${tabActive === 'priv' ? 'active' : ''}`}>Privilégios</span>
                </div>
                <div className={`tab-view`}>
                    {tabActive === 'not' && (
                        <Notifications />
                    )}
                </div>
            </div>
        </div>
    </div>)
}

export default UserSettings