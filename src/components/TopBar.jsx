import { useState, useEffect, useId } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate, Link  } from 'react-router-dom';
import { faPlus, faChevronDown, faBell, faUser, faUsers, faGear, faClock, faFlag, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { icon, library } from '@fortawesome/fontawesome-svg-core'
import Axios from 'axios';
import './css/TopBar.css';
const ip = require('../variables/ip')

library.add(faPlus, faChevronDown, faBell, faUser, faUsers, faGear, faClock, faFlag, faPowerOff)

const verificarToken = async () => {
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            const res = await Axios.get(`http://${ip}:3000/api/authtoken`, {
                headers: {
                    Authorization: `Bearer ${token}`
            }})

            const dados = res.data;

            if (dados.usuario) {
                // Token é válido e o usuário está logado
                console.log('Usuário logado:', dados.usuario);
                console.log('Usuário logado:', dados);
                return dados.usuario;
            } else {
                // Token é inválido ou expirou
                console.log('Token inválido ou expirado');
                localStorage.removeItem('token'); // Remover token inválido
                return null;
            }
        } catch (erro) {
            console.error('Erro ao verificar token:', erro);
            return null;
        }

    } else {
        console.log('Nenhum token encontrado');
        return null;
    }
}

const loggout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
}


const TopBar = ({title}) => {
    const [UserMenu, setUserMenu] = useState(false);
    const [expand, setExpand] = useState(false);
    const [online, setOnline] = useState(true);
    const [tabActive, setTabActive] = useState('Options')
    const [logged, setLogIn] = useState('')
    const [listOpen, setListOpen] = useState()
    const navigate = useNavigate(); // Adiciona o useNavigate

        useEffect(() => {
            const verificar = async () => {
                const usuarioLogado = await verificarToken();
                console.log('log', logged)
    
                if (usuarioLogado) {
                    setLogIn({Nome: usuarioLogado.Nome, id: usuarioLogado.usageID});
                } else {
                    setLogIn(null)
                    navigate('/login')
                }
    
            };
            
            verificar();
        }, []); 
    

    const Notifs = [
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'middle',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'low',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'low',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        }
        ,
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'low',
            icon: ''
        },
        {
            title: 'Reclamação aberta para Ensinger',
            date: '17/03/2024',
            by: 'Leonardo',
            critical: 'important',
            icon: ''
        }
    ]

    const OpsItems = [
        {
            icon: 'fa-user',
            name: 'User',
            title: 'Meu Perfil'
        },
        {
            icon: 'fa-users',
            name: 'Team',
            title: 'Equipe'
        },
        {
            icon: 'fa-gear',
            name: 'Config',
            title: 'Config.'
        },
        {
            icon: 'fa-clock',
            name: 'Logs',
            title: 'Registros'
        },
        {
            icon: 'fa-flag',
            name: 'Report',
            title: 'Reportar'
        },
        {
            icon: 'fa-power-off',
            name: 'Turnoff',
            title: 'Sair',
            onClick: loggout
        }
    ]

    const openMenu = () => {
        setUserMenu(!UserMenu);
    }

    const UserSettings = ({expand, setTabActive }) => {

        // console.log('tabActive', tabActive)
        
        const Notifications = ({ isOpen, setTabActive }) => {

            const setTab = () => {
                setTabActive('Notif')
            }

            return (
                <div className={`Not ${isOpen ? 'active' : ''}`}>
                    {!isOpen && (
                        <div onClick={setTab}>
                            <span className="bell-icon"><FontAwesomeIcon icon={'fa-bell'}/></span>
                            <span className="text-last">Foi aberta uma reclamação, dia 17/03/24</span>
                            <span className="icon-count">{`+${Notifs.length - 1}`}</span>
                        </div>
                    )}
                    {isOpen && Notifs.map((item, i) => (
                        <div key={i} className={`Notif ${item.critical} N-${i}`}>
                            <span className='icon'><FontAwesomeIcon icon={item.icon ? item.icon : 'fa-bell'}/></span>
                            <div>
                                <span>{item.title}</span>
                                <span>{`Por: ${item.by}`}</span>
                            </div>        
                        </div>
                    ))}
                </div>
            )
        }

        const OptionGo = ({ Name, Title, Icon, onClick }) => {

            return (
            <div className={`Option-icon Option-${Name}`} onClick={onClick}>
                <span className="Op-icon"><FontAwesomeIcon icon={Icon}/></span>
                <span className="Op-title">{Title}</span>
            </div>
            )
        }

        return (
            <div className={`user-interact ${expand ? 'active' : ''}`}>
                <div className='user-space user-info'>
                    <div className="img-div"><span className="avatar-letter">AS</span></div>
                    <span>André Silva</span>
                    <span>[{logged.id}]</span>
                </div>
                <div className='user-space user-not'>
                    <div className="header">
                        <span>Notificações</span>
                        <span><FontAwesomeIcon icon={'fa-chevron-down'}/></span>
                    </div>
                    <div className='not-main'>
                        <Notifications setTabActive={setTabActive} isOpen={tabActive == 'Notif'} />
                    </div>
                </div>
                <div className='user-space user-op'>
                        {tabActive !== 'Options' && (
                            <div onClick={() => setTabActive('Options')} className="Op-hidden header">
                                <span>Opções</span>
                                <span><FontAwesomeIcon icon={'fa-chevron-down'}/></span>
                            </div>
                        )}
                        {tabActive == 'Options' && (
                            <div className="op-main">{
                            OpsItems.map((item, i) => (
                                <OptionGo key={i} Name={item.name} Icon={item.icon} Title={item.title} 
                                onClick={item.onClick ? item.onClick : null}/>
                            ))}
                            </div>
                        )}
                </div>
            </div>
        )
    }

    return (
        <div className={`Top-bar`}>
            <span>{title}</span>
            <div onClick={openMenu} className={`User-toGo ${UserMenu ? 'active' : ''}`}>
                <span className={`user-status ${online ? 'online' : 'offline'}`}></span>
                <button>{logged.Nome}</button>
            </div>
                <UserSettings setTabActive={setTabActive} expand={UserMenu}/>
            {/* <button className={`expand-btn ${expand ? 'expand' : ''}`}><FontAwesomeIcon icon={'fa-chevron-down'}/></button>     */}
        </div>
    )
}

export default TopBar;