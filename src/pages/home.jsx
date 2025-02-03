import { useState, useEffect } from 'react';
import './css/MainPage.css'
import { useLocation, useNavigate, Link  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBell, faBars, faArrowUpRightFromSquare, faChartLine, faCircleExclamation, faReply, faChevronDown, faX, faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Axios from 'axios';
import UserSettings from '../components/UserSettings';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2'
const ip = require('../variables/ip')

library.add(faUser, faBell, faBars, faArrowUpRightFromSquare, faChartLine, faCircleExclamation, faReply, faChevronDown, faX, faPlus)

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


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
};

const loggout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
}


const menuButton = [{
        icon: 'fa-chart-line',
        text: 'Estatísticas',
        action: ''
    },  
    {
        icon: 'fa-circle-exclamation',
        text: 'Reclamações',
        subgroup: [
            'Abrir Reclamações',
            'Visão Geral'
        ],
        link: ''
    },
    {
        icon: 'fa-reply',
        text: 'Respostas do Fornecedor',
        action: '/list'
    }   
]


// fa-arrow-up-right-from-square
const UpperBar = ({setUserSetting}) => {
    const [logged, setLogIn] = useState()
    const [listOpen, setListOpen] = useState()
    const navigate = useNavigate(); // Adiciona o useNavigate

    useEffect(() => {
        const verificar = async () => {
            const usuarioLogado = await verificarToken();
            console.log('log', logged)

            if (usuarioLogado) {
                setLogIn({Nome: usuarioLogado.Nome});
            } else {
                setLogIn(null)
                navigate('/login')
            }

        };
        
        verificar();
    }, []); 

    const openList = (list) => {
        if (listOpen === list ) return setListOpen('');

        setListOpen(list)
    }

    const openClaim = () => {
        navigate('/open')
    }

    return (
        <div className="Upper-Tools">
            {logged && (
                <> 
                    <div>{`Bem-vindo ${logged.Nome}`}</div>
                    <div className={`options`}>
                        <button
                        onClick={() => openClaim()}
                        className={`opening-btn`}
                        title="Abrir uma nova reclamação ao fornecedor"
                        >
                            <FontAwesomeIcon icon={'fa-plus'}/>
                            Abrir Reclamação
                        </button>
                        <button onClick={() => openList('user')} detail="Perfil" className={`user-btn profile ${listOpen == 'user' ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-user'}/>
                            <div className={`User-List ${listOpen == 'user' ? 'active' : ''}`}>
                                <span onClick={setUserSetting}>Configurações</span> 
                                <span onClick={loggout}>Sair</span>                              
                            </div>
                        </button>
                        <button detail="Notificações" className={`user-btn notification`}><FontAwesomeIcon icon={'fa-bell'}/></button>
                    </div>
                </>
            )}
            {!logged && (
                <Link to="/login">
                    <button className={`btn-login`}>Fazer Login</button>
                </Link>
            )

            }
        </div>
    )
}

const SideBar = () => {
    const [ expanded, setExpanded ] = useState(false)

    const Button = ({icon, text, action, expand, list, link}) => {
        const navigate = useNavigate(); // Add this line
        const [ listItems, setListItems ] = useState(false)

        const clickButton = () => {
            if (list) {
                return setListItems(!listItems)
            }

            //action()
            if (link) {
                navigate(link);
            }

        }


        return (
            <div className={`btn-div ${listItems ? 'inList' : ''} ${expand ? 'expanded' : ''}`}>
                <button onClick={clickButton} className={`btn-action ${expand ? 'expanded' : ''}`}>
                    <span><FontAwesomeIcon icon={icon}/></span>
                    {expand ? text : ''}
                    {list && (
                        <span className={`arrow-expand ${expand ? 'active' : ''} ${listItems ? 'open' : ''}`}><FontAwesomeIcon icon={'fa-chevron-down'} /></span>
                    )}
                </button>
                {list && listItems && (
                    <ul className={`list-btn `}>
                        {
                            list.map((item) => (
                                <li>{item}</li>
                            ))
                        }
                    </ul>
                )}
            </div>
        )
    }

    return (
        <div className={`Sidebar ${expanded ? 'active' : ''}`}>
            <button onClick={() => setExpanded(!expanded)} className={`btn-action bar-expand ${expanded ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-bars'}/></button>
            <span className={`Menu-title ${expanded ? 'active' : ''}`}>Menu</span>
            <span className={`bar ${expanded ? 'active' : ''}`}></span>
            {menuButton.map((item, index) => (
                <Button list={item.subgroup} key={index} expand={expanded} icon={item.icon} text={item.text} link={item.action} />
            ))
            }
        </div>
    )
}



const Dashboard = () => {



const Advice = ({type, text}) => {
    const [ isClosed, setClose ] = useState(false)

    return (
        <div className={`Advice ${!isClosed ? 'active' : ''}`}>
            <span className={`icon-important`}><FontAwesomeIcon icon={'fa-circle-exclamation'}/></span>
            <span className={`text-content`}>{text}</span>
            <button onCLick={() => setClose(true)} className={`btn-close`}><FontAwesomeIcon icon={'fa-x'}/></button>
        </div>
    )
} 

    return (
        <div className={`MenuPage Dashboard`}>
            <div className='Stats Main'>
                <div className='Stat S-1'>
                    <span>Ratio</span>
                    <span>5% <span className='Ratio-up'><FontAwesomeIcon icon={'fa-chevron-down'}/></span></span>
                </div>
                <div className='Stat S-2'>
                    <span>Média mensal</span>
                    <span>5 <span className='Ratio-up'><FontAwesomeIcon icon={'fa-chevron-down'}/></span></span>
                </div>
                <div className='Stat S-3'>
                    <span>Fornecedor Crítico</span>
                    <span>Ensinger</span>
                </div>
            </div>
            <div className='Stats Charts Main'>
                <p className="Title">Análise</p>
                <div className='Chart Chart-1'>
                    <Bar 
                        data={{
                            labels: ['A', 'B', 'C'],
                            datasets: [{
                                label: 'Revenue',
                                data: [200, 300, 400],
                                borderColor: '#36A2EB',
                                backgroundColor: '#9BD0F5',
                            }]
                        }}
                        options={{
                            scales: {
                              x: {
                                title: {
                                  display: false,
                                  text: 'Category'
                                }
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: 'Value'
                                }
                              },
                              xAxes: [{
                                ticks: {
                                    fontSize: 10
                                }
                              }],
                              yAxes: [{
                                ticks: {
                                    fontSize: 10
                                }
                              }]
                            },
                            maintainAspectRatio: false, // Isso permite que o gráfico preencha o contêiner
                            responsive: true,
                            aspectRatio: 1, // Controla a razão entre a largura e a altura do gráfico
                            plugins: {
                                legend: {
                                    display: false,
                                    labels: {
                                        color: 'rgb(255, 99, 132)',
                                        font:{
                                            size: '10px'
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Resumo mensal de reclamações'
                                }
                            }
                          }}
                        />
                </div>
            </div>
        </div>
    )
}




const MainPage = ({setUserSetting, userSetting}) => {
    const [ menuActive, setMenuActive ] = useState('Dash')
    const [ lastInfo, setLastInfo ] = useState({
        NotQuant: 2,
        CriticalQuant: 0
    })


    document.title = `Home (${lastInfo.NotQuant})`

    return (
        <div className={`Main MainPage`}>
            <UpperBar setUserSetting={setUserSetting}/>
            {/* <span>Home</span> */}
            {menuActive === 'Dash' && (
                <Dashboard />
            )}
            <SideBar />
            {userSetting && (<UserSettings setUserSetting={setUserSetting}/>)}
        </div>
    )
}

export default MainPage