import { useState, useEffect } from "react";
import './css/Forn.css'
import { useLocation, Route, Routes, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faTrash, faPencil,faChevronRight, faChevronDown, faChevronLeft, faCaretUp, faDownLong, faImage, faEnvelope, faFlag } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Alert from "./alert";
import EmailTab from "./EmailTab";
import FotoTab from "./FotoTab";

library.add(faPlus, faMinus, faTrash, faPencil, faChevronRight, faChevronDown, faChevronLeft, faDownLong, faImage, faEnvelope, faFlag)

const UpperBar = ({lnc, mode, setMode}) => {

    const MultiOp = ({title, children}) =>{
        const [OpOpen, setOpOpen] = useState(false)

        const openBox = () => {
            setOpOpen(!OpOpen)
        }
        
        return (
            <div onClick={openBox} className={`dropbox ${OpOpen ? 'active' : ''}`}>
                <span className='Title'>{title}</span>
                <span className='icon-down'><FontAwesomeIcon icon={'fa-chevron-down'}/></span>
                <div className={`options ${OpOpen ? 'active' : ''}`}>
                    {children}
                </div>
            </div>
        )
    }

    const ModeChange = (mode) => {
        if (mode === 'view') {
            setMode('edit')
        } else if (mode === 'edit') {
            setMode('view')
        }
    }

    return (
        <div className="Upper-Tools">
            <div className="Title">
                {/* <button className={`back-button`}><FontAwesomeIcon icon={'fa-chevron-left'}/></button> */}
                <span className="Title-LNC">Reclamação {lnc}</span>
            </div>
            <div className="Op-list">
                <button title={mode === 'edit' ? 'Editar' : 'Visualizar'} className={`btn-regular btn-changeMode ${mode == 'edit' ? 'active' : ''}`} onClick={() => ModeChange(mode)}>
                    <FontAwesomeIcon icon={'fa-pencil'}/>
                </button>
                <button title={'Baixar relatório'} className={`btn-regular btn-download`} onClick={''}>
                    <FontAwesomeIcon icon={'fa-down-long'}/>
                </button>
                <MultiOp title={'Reclamação'}>
                    <span>Log da Reclamação</span>
                    <span>Informações do Fornecedor</span>
                </MultiOp>
            </div>
        </div>
    )
}

const LowerBar = ({mode}) => {
    const def = 'Última atualização em 15/02/2024';
    const [text, setText] = useState(def)

    let returnToDefault;

    let setMode = () => {
        if (mode !== undefined) {
            if (mode === 'view'){
                setText('Em Visualização...')
    
                returnToDefault = setTimeout(() => {
                    setText(def)
                }, 5000)
    
            } else if (mode === 'edit'){
                clearTimeout(returnToDefault)
                setText('Em Edição...')
            }
        }
    }

    useEffect(() => {
        setMode();
        console.log('bar ', text)
    }, [mode])

    return (
        <div className="Lower-Tools">
            <span>{text}</span>
        </div>
    )
}

const ClaimBody = ({claimInfo, setClaimInfo, mode, onChange}) => {

    const DynFrame = ({title, children}) => {

        return (
            <div className={`Frame-info`}>
                <span className={`title`}>{title}</span>
                <span className="space"></span>
                <div className="items">
                    {children}
                </div>
                <span className="space"></span>
            </div>
        )
    }

    const DynInput = ({mode, val, label, }) => {
        const [ActiveMode, setMode] = useState(mode);
        const [ValInput, setVal] = useState(val);

        const changeVal = (event) => {
            const InputVal = event.target.value;

            setVal(InputVal);
        } 

        const copyText = (val) => {
            navigator.clipboard.writeText(val)
            // .then(() => {
            //     alert('Texto copiado com sucesso!');
            // })
            // .catch((err) => {
            //     console.error('Erro ao copiar o texto:', err);
            // });
        }

        useEffect(() => {
            if (ActiveMode === 'view'){

            }            
        }, [ActiveMode]);

        return (
            <div className={`Input-Read ${ActiveMode}`}>
                {ActiveMode === 'read' && (
                    <>
                        <label className="label-dyn">{label}</label>
                        <span onClick={(e) => copyText(e.target.innerText)} className={'val-span span'}>{val}</span>
                    </>
                )}
                {ActiveMode === 'write' && (
                    <>
                        <label className="label-dyn">{label}</label>
                        <input className={'val-span input'} onChange={(e) => changeVal(e)} value={ValInput}/>
                    </>
                )}
            </div>
        )

    }

    const DynTable = ({children}) => {
        const [tableExpand, setExpand] = useState(false)

        const ExpandTable = () => {
            setExpand(!tableExpand);
        }

        return (
            <div className={`table-quant ${tableExpand ? 'active' : ''}`}>
                <span onClick={ExpandTable} className={`btn-expand ${tableExpand ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={tableExpand ? 'fa-minus' : 'fa-plus'}/>
                </span>
                <table>
                    <thead>
                        <tr>
                            <th>Quantidade</th>
                            <th>Lote</th>
                            <th>NF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        )
    }

    const DynRows = ({index, row, mode}) => {
        const [ActiveMode, setMode] = useState(mode);

        return (
            <tr className={`t-quant trow ${mode} t-${index}`}>
                <td>{mode == 'read' ? row[0] : <input className={`td-input`} />}</td>
                <td>{mode == 'read' ? row[1] : <input className={`td-input`} />}</td>
                <td>{mode == 'read' ? row[2] : <input className={`td-input`} />}</td>
            </tr>
        )
    }

    return (
        <div className={`ClaimBody`}>
            <div className={`Info-box`}>
                <DynFrame title='Informações da Reclamação'>
                    <DynInput label={'LNC'} val={claimInfo.lnc} mode={mode === 'view' ? 'read' : 'write'} onChange={''}  />
                    <DynInput label={'Reclamação'} val={'Teste'} mode={mode === 'view' ? 'read' : 'write'} onChange={''}  />
                </DynFrame>
                <DynFrame title='Quantidades'>
                    <DynTable>
                        <DynRows index={`1`} mode={mode === 'view' ? 'read' : 'write'} row={[1500, '0251651651', 135945]}/>
                        {/* <tr className={`t-quant trow t-1`}>
                            <td>1.500</td>
                            <td>0251651651</td>
                            <td>135.945</td>
                        </tr>
                        <tr className={`t-quant trow t-2`}>
                            <td>1.500</td>
                            <td>0251651651</td>
                            <td>135.945</td>
                        </tr> */}
                        <tr className={`t-quant total`}>
                            <td>1.500</td>
                            <td colSpan='2'>Total</td>
                        </tr>
                    </DynTable>
                </DynFrame>
            </div>
            <div className={`AddInfo-Box`}>
                
            </div>
        </div>
    )
}

const TabEmail = () => {

    return(
        <div>
            
        </div>
    )
}


const FrameAdd = () => {
    const [ActiveTab, setTab] = useState('foto')

    const Sidebar = ({ActiveTab, setTab}) => {
        const [ActiveBar, setBar] = useState(ActiveTab)

        const HandleClickTab = (bar) => {
            setTab(bar)
        }

        return (
            <div className={`sidebar-claim`}>
                <span label='Foto' onClick={() => HandleClickTab('foto')} className={`bar-go ${ActiveBar === 'foto' ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-image'} /></span>
                <span label='Email' onClick={() => HandleClickTab('email')} className={`bar-go ${ActiveBar === 'email' ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-envelope'} /></span>
                <span label='Relatório 8D' onClick={() => HandleClickTab('8d')} className={`bar-go ${ActiveBar === '8d' ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-flag'} /></span>
            </div>
        )
    }


    return (
        <div className={`FrameBox`}>
            <Sidebar ActiveTab={ActiveTab} setTab={setTab} />
            <div className={`Frame-Sel Bar-${ActiveTab}`}>
            {ActiveTab === 'email' && (
                <EmailTab />
            )}
            {ActiveTab === 'foto' && (
                <FotoTab />
            )}
            </div>
        </div>
    )
}

const Forn = () => {
    const [mode, setMode] = useState('view')

    const {lnc, year} = useParams();
    const LNC = lnc + '/' + year.toString().slice(2, 4);
    document.title = `LNC ${LNC}`
    const [claimInfo, setClaimInfo] = useState({
        'lnc': LNC,
        'claim': 'Vazamento',
        'data': '15/02/2024',
        'openby': 'Leonardo',
        'cod': 'C 005 009',
        'forn': 'Miba',
        'quant': {
            'total': 3000,
            'index': [
                [1500, '0251651651', 135945],
                [1500, '0251651651', 135945]
            ]
        }
    })

    return (
        <div className="Main Forn">
          <UpperBar mode={mode} setMode={setMode}  lnc={LNC}/>
            <div className={`body-divisor`}>
                <ClaimBody claimInfo={claimInfo} setClaimInfo={setClaimInfo} mode={mode} />
                <FrameAdd />
            </div>
          <LowerBar mode={mode}/>
        </div>
    )
}

export default Forn