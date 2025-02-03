import { useState, useEffect, useNavigate } from "react";
import './css/OpenClaim.css'
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronDown,  faChevronLeft, faX, faCirclePlay, faPaperPlane, faPaperclip, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Select } from '@chakra-ui/react'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Axios from "axios";
import TopBar from "./TopBar";
import { ReactComponent as PdfIcon } from '../assets/icons/pdf-icon-2.svg'
const ip = require('../variables/ip')

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronDown,  faChevronLeft, faX, faCirclePlay, faPaperPlane, faPaperclip, faCircleXmark)


const Forns = ['AS Brasil', 'Autocom', 'Stay', 'Miba', 'Ensinger']

const Componente = ['C 001 017', 'C 004 005', 'C 016 005']

const Files = []

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

const UpperBar = ({lnc, mode, setMode, claimBody}) => {
    const [logged, setLogIn] = useState()

    useEffect(() => {
        const verificar = async () => {
            const usuarioLogado = await verificarToken();

            if (usuarioLogado) {
                setLogIn({Nome: usuarioLogado.Nome});
            } //else {
            //     setLogIn(null)
            //     navigate('/login')
            // }

        };
        
        verificar();
    }, []); 


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

    const sendClaim = () => {
       console.log('Form ', claimBody);
    }

    return (
        <div className="Upper-Tools">
            <div className="Title">
                {/* <button className={`back-button`}><FontAwesomeIcon icon={'fa-chevron-left'}/></button> */}
                <span className="Title-LNC">Abrir Reclamação</span>
            </div>
            <div className="Op-list">
                <button title={'Enviar Reclamação'} className={`btn-regular btn-text btn-send`} onClick={sendClaim}>
                    <FontAwesomeIcon icon={'fa-paper-plane'}/>
                    Enviar
                </button>
                <button title={'Prévia do Relatório'} className={`btn-regular btn-text btn-report`} onClick={() => ModeChange(mode)}>
                    <FontAwesomeIcon icon={'fa-paperclip'}/>
                    Prévia Relatório
                </button>
                <span className="createdby">Criando: {logged ? logged.Nome : 'Sem login'}</span>
            </div>
        </div>
    )
}

const QuantTable = ({setChange}) => {
    const [ tabQuant, setTabQuant ] = useState([{lote: '', quant: '', nf: ''}])
    const [ RowsQuant, setRowsQuant ] = useState(1)

    const addLine = (e) => {
        if  (tabQuant.length > 9){
            return
        } 
        
        setTabQuant(prevTabQuant => [
            ...prevTabQuant,
            { lote: '', quant: '', nf: '' }
        ]);
    }

    const removeLine = (index) => {
        const updatedTabQuant = tabQuant.filter((_, idx) => idx !== index);
        setTabQuant(updatedTabQuant);
    }

    const checkQuant = (val) => {
        const valor = val.toString();

        if (!/[0-9]/.test(valor)) {
            return '';
        }

        const formattedValue = valor.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return formattedValue;
    }


    const handleInputChange = (index, field, value) => {

        // Atualiza o valor específico de um campo em uma linha específica

        const updatedTabQuant = [...tabQuant];
        updatedTabQuant[index][field] = value;
        setTabQuant(updatedTabQuant);
    };

    useEffect(() => {
        if (setChange){
            setChange(tabQuant)
        }
    }, [tabQuant])

    const rows = () => {

        var length = tabQuant.length

        return tabQuant.map((row, index) => (
            <tr key={index} className={`row-Quant r-${index}`}>
                <td>{index + 1}</td>
                <td><input 
                    value={row.lote}  
                    onChange={(e) => handleInputChange(index, 'lote', e.target.value)} 
                    placeholder="Lote" 
                    type='text'/></td>
                <td><input 
                    value={row.quant}  
                    onChange={(e) => handleInputChange(index, 'quant', e.target.value)} 
                    placeholder="Quantidade" 
                    type='text'/></td>
                <td><input 
                    value={checkQuant(row.nf)}
                    onChange={(e) => handleInputChange(index, 'nf', e.target.value)} 
                    placeholder="Nota Fiscal" 
                    type='text'/></td>
                <td className={`${(index !== length - 1 || length == 10) ? 'td-remove' : 'td-add'} `}>
                    {index == length - 1 && length !== 10 && (
                        <button className={`btn-action ${length}`} onClick={(e) => addLine(e)}>
                            <FontAwesomeIcon icon={'fa-plus'}/>
                        </button>
                    )}
                    {(index !== length - 1 || length == 10) && (
                        <button className={`btn-action ${index}`} onClick={() => removeLine(index)}>
                            <FontAwesomeIcon icon={'fa-x'}/>
                        </button>
                    )}

                </td>
            </tr>
        ));
    }

    return (
        <table className={`Quant-Table Q-${RowsQuant}`}>
            <thead>
                <th>Seq.</th>
                <th>Lote</th>
                <th>Quant.</th>
                <th colspan="2">NF</th>
            </thead>
            <tbody>
                {rows()}
                {/* <tr className={`row-Quant `}>
                    <td>1</td>
                    <td className={``}><input placeholder="" type='text'/></td>
                    <td className={``}><input placeholder="" type='text'/></td>
                    <td className={``}><input onChange={(e) => checkQuant(e)} placeholder="Quant" type='text'/></td>
                    <td className={`td-remove`}><button className={`btn-action`} onClick={(e) => removeLine(e)}><FontAwesomeIcon icon={'fa-x'}/></button></td>
                </tr>
                <tr className={``}>
                    <td>2</td>
                    <td className={``}><input placeholder="" type='text'/></td>
                    <td className={``}><input placeholder="" type='text'/></td>
                    <td className={``}><input placeholder="" type='text'/></td>
                    <td className={`td-add`}><button className={`btn-action`} onClick={(e) => addLine(e)}><FontAwesomeIcon icon={'fa-plus'}/></button></td>
                </tr> */}
            </tbody>
        </table>
    )
}

const TextBox = ({label, setChange, key}) => {
    const [ textContent, setTextContent] = useState('')

    const changeValue = (e) => {
        const val = e.target.value;

        setTextContent(val)

        if (setChange){
            setChange(val)
        }
    }

    return (
        <div key={key} className={`div-textarea`}>
            <textarea onChange={(e) => changeValue(e)} value={textContent} placeholder={label}></textarea>
        </div>
    )

}

const Input = ({key, select, label, valueSet = '', setChange, size, invalido, isNumber = false}) => {
    const [selectOpen, togSelect] = useState(false)
    const [value, setValue] = useState('')

    console.log('teste', valueSet)

    useEffect(() => {
        if (valueSet) {
            setValue(valueSet);
        }

        console.log('setValue', valueSet)
    }, [valueSet]);

    const sizes = ['small', 'medium', 'big']

    var sizeChosen = '';

    const sizeChosen = sizes.includes(size) ? size : '';
    
    const clickOp = (val) => {
        setValue(val)
        togSelect(false)

        if (setChange){
            setChange(val)
        }
    }

    const changeValue = (e) => {
        const val = e.target.value;

        if (isNumber){
            if (!/^\d*\.?\d*$/.test(val)) {
                return ''
            } 
        }

        setValue(val)

        if (setChange){
            setChange(val)
        }
    }
    
    const openBox = () => {
        togSelect(!selectOpen)
    }

    const delText = () => {
        setValue('')
    }

    return (
        <div key={key} className={`div-input ${sizeChosen} ${invalido ? 'invalid' : ''}`}>
            <input onChange={(e) => changeValue(e)} value={value} placeholder={label}/>
            {value && (
                <span onClick={delText} className={`delText`}><FontAwesomeIcon icon={'fa-x'}/></span>
            )
            }
            {select && (
                <>
                    <span onClick={openBox} className={`open-box ${selectOpen ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-chevron-down'}/></span>
                    <div className={`Box-select ${selectOpen ? 'active' : ''}`}>
                    {select.map((item, index) => (
                        <span onClick={() => clickOp(item)} className={`option op-${index}`}>{item}</span>
                    ))}
                    </div>
                </>
            )}
        </div>
    )
}

function abbreviateFilename(filename, maxLength) {
    if (filename.length <= maxLength) {
        return filename;
    }

    const extension = filename.split('.').pop();
    const baseName = filename.substring(0, filename.length - extension.length - 1);
    const startLength = Math.ceil((maxLength - 3) / 2);
    const endLength = Math.floor((maxLength - 3) / 2);

    return baseName.substring(0, startLength) + '...' + baseName.substring(baseName.length - endLength) + '.' + extension;
}

const DragZone = ({Files, setChange, FilesArr}) => {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState(Files);
    const [filesArr, setFilesArr] = useState(FilesArr);

    const handleDragOver = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do navegador
    };


    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files); // Obtém os arquivos soltos

        const allowedFiles = droppedFiles.filter(file => 
            file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'video/mp4' || file.type === 'application/pdf'
        );

        if (allowedFiles.length !== droppedFiles.length) {
            alert('Apenas arquivos PNG, JPG, PDF e MP4 são permitidos!');
        }

        allowedFiles.forEach(droppedFile => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newFile = {
                    filename: droppedFile.name,
                    type: droppedFile.type.split('/')[1],
                    size: `${(droppedFile.size / 1024).toFixed(2)}kb`,
                    preview: event.target.result
                };
                setFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, newFile];
                    if (setChange) {
                        setChange(updatedFiles);
                    }
                    return updatedFiles;
                });
            };
            reader.readAsDataURL(droppedFile); // Converte o arquivo para base64
        });
    };

    useEffect(() => {
        if (FilesArr.length === 0) {
            setFiles([])
        }
    },[FilesArr])

    const deleteItem = (item) => {
        const newFiles = [...files];
        newFiles.splice(item, 1);
        setFiles(newFiles);

        if (setChange){
            setChange(newFiles)
        }
    }

    return (
    <div className={`ClaimForm annexx`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
        <div className={`annexx-space`}>
            {files.length > 0 && (
                files.map((item, index) => (
                    <div key={index} className={`annex-item`}>
                    <div className={"annexx-info"}>
                        <span>{abbreviateFilename(item.filename, 15)}</span>
                        <button 
                        className={"annexx-close"}
                        onClick={() => deleteItem(index)}
                        ><FontAwesomeIcon icon={'fa-x'}/></button>
                    </div>
                    <div className={"annexx-preview"}>
                        {item.type !== 'mp4' && item.type !== 'pdf' && (
                            <img  draggable='false' className={"img-preview"} src={item.preview}/>
                        )}
                        {item.type === 'mp4' && (
                            <>
                                <video muted autoplay src={item.preview}></video>
                                <span className="Play-icon"><FontAwesomeIcon icon={'fa-circle-play'}/></span>
                            </>
                        )}
                        {item.type === 'pdf' && (
                            <>
                                <span className="pdf-icon"><PdfIcon /></span>
                            </>
                        )}
                    </div>
                </div>
                ))
            )
            }
            {files.length === 0 && (
                <span className={`Text-advice`}>Sem arquivos.</span>
            )}
        </div>
    </div>
    )
}

const Frame = ({title, children}) => {

    return (
        <div className={`Frame`}>
            <span className={'Frame-title'}>{title}</span>
            {children}
        </div>
    )
}

const TypeClaim = () => {
    const [Typeclaim, setType] = useState('Dim')
    const [tol, setTol] = useState(['0', '0'])
    const [nom, setNom] = useState('0')
    const [found, setFound] = useState('')
    const [isOutside, setOutside] = useState('0.00')

    const calTol = (nom, tol, found) => {
        var tolerancia = []
        tolerancia[0] = tol[0] ? tol[0] : '0.00'  
        tolerancia[1] = tol[1] ? tol[1] : '0.00'
        const foundValue = Number(found)
        console.log(foundValue)

        var tolArr
        var nomTotal = []
        var result;

        if (tol.indexOf('/') !== -1) {
            var tolArr = tol.split('/');

            result = tolArr.map((item) => (
                Number(item)
            ))

            nomTotal[0] = Number(nom) + result[0]
            nomTotal[1] = Number(nom) - result[1]

        } else if (tol.indexOf('/') == -1){
            result = [Number(tol[0]), Number(tol[1])]

            nomTotal[0] = Number(nom) + result[0]
            nomTotal[1] = Number(nom) - result[1]
            
            console.log('Total', nomTotal, foundValue)
        }

       if (foundValue < nom) {
            if (foundValue < nomTotal[1]) {
                return (foundValue - nomTotal[1]).toFixed(3).toString()
            }
       }

       if (foundValue > nom) {
        if (foundValue > nomTotal[0]) {
            return "+" + (Math.abs(nomTotal[0] - foundValue).toFixed(3)).toString()
        }
       }

        return '0.00'
    }

    useEffect(() => {
        const toleranceRegex = /^\d+(\.\d+)?\/\d+(\.\d+)?$/;

        if (Typeclaim === 'Dim') {
            if (nom && tol && found) {
                setOutside(calTol(nom, tol, found))
            } else {
                setOutside('0.00')
            }
        }

    }, [nom, tol, found, Typeclaim])

    // console.log('cal ', calTol(5.00, '2.00/1.50', 3.49))



    return (
        <div className={`TypeSelect`}>
            <span>Tipo da Reclamação</span>
            <div className={`type-Option`}>
                <span onClick={() => setType('Dim')} className={`OptionType T-Dim ${Typeclaim == 'Dim' ? 'active' : ''}`}>Dimensional</span>
                <span onClick={() => setType('Vis')} className={`OptionType T-Vis ${Typeclaim == 'Vis' ? 'active' : ''}`}>Visual</span>
            </div>
            <div className={`type-Detail`}>
                {Typeclaim == 'Vis' && (
                    <Input label={'Detalhe a falha visual'}/>
                )}
                {Typeclaim == 'Dim' && (
                    <div style={{'width': '100%',
                    'display': 'flex',
                    'flexDirection': 'column', 
                     'gap': '5px',
                     'align-items': 'center',
                     'justifyContent': 'center'
                     }}>
                        <div style={{'width': '40%',
                                 'display': 'flex',
                                  'gap': '5px',
                                  'align-items': 'center',
                                  'justifyContent': 'center'
                                  }}>
                                <Input 
                                setChange={setNom}
                                label={'Nominal'}/>
                                <Input 
                                setChange={(val) => setTol([val, tol[1]])}
                                label={'Tolerância Mín'}/>
                                <Input 
                                setChange={(val) => setTol([tol[0], val])}
                                label={'Tolerância Máx'}/>
                            <span className={`deviation-val ${isOutside !== '0.00' ? 'outside' : ''}`}>{isOutside}</span>
                        </div>
                        <Input setChange={setFound} label={'Encontrado'}/>
                    </div>
                )}
            </div>
        </div>
    )
}


const getForns = async () => {

    try {
        const response = await Axios.get(`http://${ip}:3000/api/forns/`)
        return response.data;
    } catch (error){
        console.log({ code: 400, data: error });
        return []; // Retorna um array vazio em caso de erro
    }      
}

const getPecas = async (produto) => {
    const search = produto ? produto : '';

    try {
        const response = await Axios.get(`http://${ip}:3000/api/pecas/${search}`)
        return response.data;
    } catch (error){
        console.log({ code: 400, data: error });
        return []; // Retorna um array vazio em caso de erro
    }      
}

const OpenClaim = () => {
    const [fornList, setFornList] = useState('')
    const [pecasList, setPecasList] = useState('')
    const [claimBody, setClaimBody] = useState({
        claim: {
            desc: '',
            initialQuant: '',
            type: '',
            desctype: {
                nom: '',
                tol: [],
                found: ''
            },
            details: ''
        },
        component: {
            cod: '',
            desc: '',
            forn: '',
            contact: ''
        },
        quantities: [
            {
                lote: '',
                quant: '',
                nf: ''
            }
        ],
        files: [
            {
                filename: '',
                type: '',
                size: '',
                preview: ''
            }
        ]
    })

    useEffect(() => {
        const fetchCodInfo = async () => {
            try {
                if (claimBody.component.cod && !claimBody.component.desc) {
                    const codInfo = await getPecas(claimBody.component.cod);
                    setClaimBody(prevState => ({
                        ...prevState,
                        component: {
                            ...prevState.component,
                            forn: codInfo[0].forn_name,
                            desc: codInfo[0].desc_br,
                            contact: codInfo[0].desc_br
                        }
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar codInfo:', error);
            }
        };
    
        fetchCodInfo();
    }, [claimBody.component.cod, claimBody.component.desc]);
    

    const clearFiles = () => {
        setClaimBody({ ...claimBody, files: [] });
    }

    const attForm = (path) => (val) => {
        const isNested = path.includes('.');

        if (isNested) {
            // Cria uma cópia do estado atual
            let updatedClaimBody = { ...claimBody };
    
            // Divide o caminho em partes
            const pathParts = path.split('.');
    
            // Navega pelo objeto até chegar ao campo que queremos atualizar
            let currentPart = updatedClaimBody;

            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
    
                // Se a parte atual não existir no objeto, cria um objeto vazio
                if (!currentPart[part]) {
                    currentPart[part] = {};
                }
    
                // Move para a próxima parte do caminho
                currentPart = currentPart[part];
            }
    
            // Atualiza o valor no campo desejado
            currentPart[pathParts[pathParts.length - 1]] = val;
    
            // Atualiza o estado com o novo objeto
            setClaimBody(updatedClaimBody);
        } else {
            // Atualiza diretamente o campo não aninhado
            setClaimBody({ ...claimBody, [path]: val });
        }
    }

    useEffect(() => {

        document.title = 'Abrir Reclamação';

        const fetchAPI = async () => {
            const forns = await getForns();
            setFornList(forns);

            const pecas = await getPecas();
            setPecasList(pecas);
        };

        fetchAPI();

    }, []);
    
    const fornsName = Array.isArray(fornList) ? fornList.map((item) => item.Nome) : [];
    const pecasCod = Array.isArray(pecasList) ? pecasList.map((item) => item.cod) : [];

    return (
        <div className="Main OpenClaim">
            <TopBar title={'Abrir Reclamação'}/>
            <UpperBar claimBody={claimBody} />
            <Tabs width='80%' colorScheme='green'>
                <TabList>
                    <Tab>Informações</Tab>
                    <Tab>Anexos</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <div className={`ClaimForm info`}>
                            <div className={`Form-Tools`}></div>
                            <Frame title="Componente">
                            <div style={{'width': '100%',
                                 'display': 'flex',
                                  'gap': '5px',
                                  'align-items': 'center',
                                  'justifyContent': 'center'
                                  }}>
                                    <Input setChange={attForm('component.cod')} select={pecasCod} size={'small'} label={'Código'} />
                                    <Input setChange={attForm('component.desc')}  valueSet={claimBody.component.desc} size={'medium'} label={'Descrição'}/>
                                </div>
                            </Frame>
                            <Frame title="Fornecedor">
                            <div style={{'width': '100%',
                                 'display': 'flex',
                                  'gap': '5px',
                                  'align-items': 'center',
                                  'justifyContent': 'center'
                                  }}>
                                    <Input setChange={attForm('component.forn')} select={fornsName} valueSet={claimBody.component.forn} size={'small'} label={'Nome do Fornecedor'} />
                                    <Input setChange={attForm('component.contact')}  size={'medium'} label={'Pessoa de Contato'}/>
                                </div>
                            </Frame>
                            <Frame title="Reclamação">
                                <div style={{'width': '100%',
                                 'display': 'flex',
                                  'gap': '5px',
                                  'align-items': 'center',
                                  'justifyContent': 'center'
                                  }}>
                                    <Input setChange={attForm('claim.desc')}  size={'small'} label={'Descrição'} />
                                    <Input setChange={attForm('claim.cod')} isNumber={true} size={'small'} label={'Quantidade inicial'}/>
                                </div>
                                <TypeClaim />
                                <TextBox setChange={attForm('claim.details')} label={'Detalhes adicionais'} />
                            </Frame>
                            <Frame title="Quantidades">
                                <QuantTable setChange={attForm('quantities')} />
                            </Frame>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <div className={`Annex-Tools`}>
                                <span>{claimBody.files.length + (claimBody.files.length === 1 ? ' Arquivo Selecionado' : ' Arquivos Selecionados' )}</span>
                                {claimBody.files.length > 0 && (
                                    <button
                                    onClick={() => clearFiles()}
                                    ><FontAwesomeIcon icon={faCircleXmark} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <DragZone setChange={attForm('files')} Files={Files} FilesArr={claimBody.files}/>
                        <span style={{'font-size': '11px', 'userSelect': 'none', 'color': 'grey'}}>Arraste seus arquivos para dentro o retangulo</span>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default OpenClaim