import { useState, useEffect } from 'react';
import './css/Login.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheck, faX, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Axios from 'axios';
import { Spinner } from '@chakra-ui/react'
const ip = require('../variables/ip')

library.add(faEye, faCheck, faX, faCircleXmark)

//const ip = '192.168.0.124' //'192.168.0.123'//'192.168.0.236'

const LoginBox = ({setType, navigate}) => {
    const [showPass, setShow] = useState(false);
    const [keepLogged, setkeepLogged] = useState(false);
    const [ error, setError ] = useState({id: '', message: ''})
    const [ alert, setAlert] = useState('')
    const [ goLoading, setGoLoading ] = useState(false)
    const [ formLogin, setFormLogin] = useState({
        email: '',
        senha: '',
        keepLogged: ''
    })

    useEffect(() => {
        setFormLogin({...formLogin, ['keepLogged']: keepLogged })
    }, [keepLogged])

    // useEffect(() => {
    //     if (error.id !== '') {
    //         return false
    //     }

    //     if(formLogin.email !== '' && formLogin.senha !== '') {
    //         setError({id: '', message: ''})
    //     }
    // }, [formLogin])

    const clickRegister = () => {
        setType('register');
        navigate('/register');
    }

    const changeForm = (field, val) => {
        const updatedItems = { ...formLogin, [field]: val };
        setFormLogin(updatedItems);
    }

    const tryLogin = () => {
        const FieldsFilled = Object.values(formLogin).every(value => value !== '');

        if (!FieldsFilled){
            console.error('falta Preencher')
            setError({id: 1, message: 'Preencher todos os campos'})
            return false;
        } 

       const { email, senha, keepLogged } = formLogin

       setGoLoading(true)
       Axios.post(`http://${ip}:3000/api/login`, formLogin)
          .then(function (response) {

            const token = response.data.token;

            sessionStorage.setItem('token', token);

            // if (formLogin.keepLogged) {

            // } else {

            // }

            navigate('/');

            console.log(response);

          })
          .catch(function (error) {
            const erro = error.response.data

            if (erro.message === 'Usuário inválido') {
                setError({id: '2', message: 'Usuário não existe'})
            }

            if (erro === 'Muitas tentativas de login') {
                setError({id: '2', message: 'Muitas tentativas de login, tente novamente mais tarde.'})
            }
            
            setGoLoading(false)
          }).finally(() => {

            setGoLoading(false)
          });
    }

    return (
        <div className={`LoginBox login`}>
            <span style={{'font-size': '20px', 'userSelect': 'none', 'margin-bottom': '20px'}}>Fazer Login</span>
                <div className={`input-div`}>
                    <input className={`input-form ${(error['id'] == 1 &&  formLogin.email == '') ? 'error' : ''}`} type='text' placeholder='Email' onChange={(e) => changeForm('email', e.target.value)} />
                </div>
                <div className={`input-div`}>
                    <input className={`input-form ${(error['id'] == 1 &&  formLogin.senha == '') ? 'error' : ''}`} type={showPass ? 'text' : 'password'} placeholder='Senha' onChange={(e) => changeForm('senha', e.target.value)} />
                    <span 
                    onClick={() => setShow(!showPass)} 
                    className={`show-pass ${showPass ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-eye'}/></span>
                </div>
                <div className={`input-div ${error['id'] !== '' ? 'advice' : ''}`}>
                    <span 
                    onClick={() => setkeepLogged(!keepLogged)} 
                    className={`keep-logged ${keepLogged ? 'active' : ''}`}>Manter logado</span>
                    <span className={`info-repSenha ${(error['id'] == 1 || error['id'] == 2) ? 'active' : ''}`}>{error['message']}</span>
                </div>
                <div className={`input-div`}>
                    <button className={`btn-login login`} onClick={tryLogin}>
                    {!goLoading ? 'Entrar' : ''}
                    {goLoading && (<Spinner size='sm' />)}
                    </button>
                </div>
                <div className={`input-div`}>
                    <span style={{'font-size': '14px'}}>Não tem conta? 
                        <a 
                        className='btn-changeRegister'
                        onClick={clickRegister}
                        >Registrar</a>
                    </span>
                </div>
        </div>
    )
}

const RegisterBox = ({setType, navigate}) => {
    const [showPass, setShow]= useState(false);
    const [ alert, setAlert] = useState('')
    const [ error, setError ] = useState({id: '', message: ''})
    const [ showVal , setShowVal] = useState(false)
    const [ goLoading, setGoLoading ] = useState(false)
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        specialChar: false,
        number: false,
        uppercase: false,
        lowercase: false,
      });

    const [ formRegister, setFormRegister] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        repsenha: ''
    })

      const validatePassword = (password) => {
        const validation = {
          length: password.length >= 8,
          specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
          number: /\d/.test(password),
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
        };
      
        setPasswordValidation(validation);
      };

      const perVal = (validationObject) => {
          
          const totalItems = Object.keys(passwordValidation).length;
          const trueItems = Object.values(validationObject).filter((value) => value).length;
          const percentual = (trueItems / totalItems) * 100;

          return percentual
      };
      
      const clickLogin = () => {
        setType('login');
        navigate('/login');
    }

    const changeForm = (field, val) => {
        const updatedItems = { ...formRegister, [field]: val };
    
        setFormRegister(updatedItems);
    }

    const changePassword = (field, password) => {
        validatePassword(password);
        changeForm(field, password)
    }

    const tryRegister = () => {
        const FieldsFilled = Object.values(formRegister).every(value => value !== '');

        if (!FieldsFilled){
            console.error('falta Preencher')
            return false;
        } 

       const { nome, sobrenome, email, senha, repsenha } = formRegister

       const areAllFieldsTrue = Object.values(passwordValidation).every(value => value === true);

       if (!areAllFieldsTrue){
        console.error('Senha não atende os requisitos mínimos')
        return setError({id: 2, message: 'Senha não atende os requisitos mínimos'})
       }

       if (senha !== repsenha) {
        console.error('Senhas não correspondem')
        return setError({id: 1, message: 'Senhas não correspondem'})
       }
       
        setGoLoading(true)
       Axios.post(`http://${ip}:3000/api/register`, formRegister)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
            const erro = error.response.data
            console.log(erro);

            if (erro.message === 'Usuário inválido') {
                setError({id: '1', message: 'Usuário não existe'})
            }

          }).finally(() => {
            setGoLoading(false)
            setType('RegSuccess');
          });


    }

    // useEffect(() => {
    //    const FieldsFilled = Object.values(formRegister).every(value => value !== '');
    //    if (!FieldsFilled) return false 
    //    const { nome, sobrenome, email, senha, repsenha } = formRegister
    //    const areAllFieldsTrue = Object.values(passwordValidation).every(value => value === true);
    //    if (!areAllFieldsTrue) return false
    //    if (senha !== repsenha) return false

    //     setError({id: '', message: ''});
    // }, [formRegister])

    return (
        <div className={`LoginBox register`}>
            {alert && (
                <span className={`alert-login ${alert ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={'fa-circle-xmark'} />
                    {alert}
                </span>
            )}
             <span style={{'font-size': '20px', 'userSelect': 'none', 'margin-bottom': '20px'}}>Registrar</span>
                <div 
                className={`input-div`}
                style={{'display': 'flex', 'gap': '10px'}}
                >
                    <input className={`input-form`} type='text' placeholder='Nome' onChange={(e) => changeForm('nome', e.target.value)} />
                    <input className={`input-form`} type='text' placeholder='Sobrenome' onChange={(e) => changeForm('sobrenome', e.target.value)} />
                </div>
                <div className={`input-div`}>
                    <input className={`input-form`} type='text' placeholder='Email' onChange={(e) => changeForm('email', e.target.value)} />
                </div>
                <div className={`input-div`}>
                    <input 
                    className={`input-form ${(error['id'] == 1 || error['id'] == 2) ? 'error' : ''}`} 
                    type={showPass ? 'text' : 'password'}
                    onChange={(e) => changePassword('senha', e.target.value)} 
                    onFocus={() => setShowVal(true)}
                    placeholder='Senha' />
                    <span 
                    onClick={() => setShow(!showPass)} 
                    className={`show-pass ${showPass ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-eye'}/></span>
                </div>
                <div className={`input-div ${error['id'] !== '' ? 'advice' : ''}`}>
                    <input className={`input-form ${(error['id'] == 1) ? 'error' : ''}`} type={showPass ? 'text' : 'password'} placeholder='Repetir Senha' onChange={(e) => changeForm('repsenha', e.target.value)} />
                    <span className={`info-repSenha ${(error['id'] == 1 || error['id'] == 2) ? 'active' : ''}`}>{error['message']}</span>
                </div>
                <div className={`input-div`}>
                    <button className={`btn-login register`} onClick={tryRegister}>
                        {!goLoading ? 'Registrar' : ''}
                        {goLoading && (<Spinner size='sm' />)}
                    </button>
                </div>
                <div className={`input-div`}>
                    <span style={{'font-size': '14px'}}>Já tem conta? 
                        <a 
                        className='btn-changeRegister'
                        onClick={clickLogin}
                        >Entrar</a>
                    </span>
                </div>
                <div className={`val-password ${showVal ? 'active' : ''}`}>
                        <div className={`progress-bar p${perVal(passwordValidation)}`}>
                            <span></span>
                        </div>
                        <ul className={`val-list`}>
                            <li className={passwordValidation.length ? 'ok' : ''}>
                                <FontAwesomeIcon icon={passwordValidation.length ? 'fa-check' : 'fa-x'}/>
                                Pelo menos 8 digitos
                            </li>
                            <li 
                            className={passwordValidation.specialChar ? 'ok' : ''}>
                                <FontAwesomeIcon icon={passwordValidation.specialChar ? 'fa-check' : 'fa-x'}/>
                                Um caractere especial "!@#$%^&*(),.?":{}|<></>"
                            </li>
                            <li className={passwordValidation.number ? 'ok' : ''}>
                                <FontAwesomeIcon icon={passwordValidation.number ? 'fa-check' : 'fa-x'}/>
                                Pelo menos um número
                            </li>
                            <li 
                            className={passwordValidation.lowercase ? 'ok' : ''}>
                                <FontAwesomeIcon icon={passwordValidation.lowercase ? 'fa-check' : 'fa-x'}/>
                                Pelo menos uma letra minuscula
                            </li>
                            <li className={passwordValidation.uppercase ? 'ok' : ''}>
                                <FontAwesomeIcon icon={passwordValidation.uppercase ? 'fa-check' : 'fa-x'}/>
                                Pelo menos uma letra maíuscula
                            </li>
                        </ul>
                </div>
        </div>
    )
}

const Advice = ({type, text, onClick}) => {

    return (
        <div className={`LoginBox advice`}>
            <span className={`icon`}>
                <FontAwesomeIcon icon={'fa-check'}/>
            </span>
            <span className={`text-content`}>{text}</span>
            <button onClick={onClick}>OK</button>
        </div>
    )
}


const LoginPage = () => {  
    const [ type, setType ] = useState('')  
    const location = useLocation();
    const navigate = useNavigate(); // Adiciona o useNavigate

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

        if (pathSegments[1] === 'login'){
            setType('login')
        } else if (pathSegments[1] === 'register'){
            setType('register')
        } else {
            setType('')
        }
    }, [location]);

    useEffect(() => {
        document.title = type == 'login' ? 'Fazer Login' : 'Registrar'
    }, [type])

    const confirmRegAdvice = () => {
        setType('login');
        navigate('/login');
    }

    return (
        <div className={`Main LoginPage`}>
            {type == 'RegSuccess' && (
                <Advice type={'success'} text={'Conta criada com sucesso'} onClick={confirmRegAdvice} navigate={navigate} setType={setType} />
            )}
            {type == 'login' && (
                <LoginBox navigate={navigate} setType={setType} />
            )}
            {type == 'register' && (
                <RegisterBox navigate={navigate} setType={setType} />
            )}
        </div>
    )
}

export default LoginPage