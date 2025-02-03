import { useState, useEffect, useNavigate } from "react";
import './css/Profile.css'
import { useLocation, Route, Routes, Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronDown,  faChevronLeft, faX, faCirclePlay, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Axios from "axios";
import TopBar from "./TopBar";

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronDown,  faChevronLeft, faX, faCirclePlay, faPaperPlane, faPaperclip)

const ip = 'localhost'

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


const UpperBar = ({setUserSetting}) => {
    // const [logged, setLogIn] = useState()
    // const [listOpen, setListOpen] = useState()
    // const navigate = useNavigate(); // Adiciona o useNavigate

    // useEffect(() => {
    //     const verificar = async () => {
    //         const usuarioLogado = await verificarToken();
    //         console.log('log', logged)

    //         if (usuarioLogado) {
    //             setLogIn({Nome: usuarioLogado.Nome});
    //         } else {
    //             setLogIn(null)
    //             navigate('/login')
    //         }

    //     };
        
    //     verificar();
    // }, []); 

    // const openList = (list) => {
    //     if (listOpen === list ) return setListOpen('');

    //     setListOpen(list)
    // }

    return (
        <div className="Upper-Tools">
            <div className="Title">
                <span className="Title-LNC">Perfil</span>
            </div>
            <div className="Op-list">
              
            </div>
        </div>
    )
}

const Profile = () => {
    const [fornList, setFornList] = useState('')
    

    return (
        <div className="Main Profile">
           <TopBar />
           <UpperBar />
        </div>
    )
}

export default Profile