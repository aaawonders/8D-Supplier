import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import claimsJson from './JSON/claims.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck, faEllipsisVertical, faX } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import './css/TableItems.css'
import Axios from 'axios';
import TopBar from "./TopBar";
import Alert from "./alert";

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck, faEllipsisVertical, faX)

const ip = 'localhost' //'192.168.0.236'

const logs = [
    {
        id: ''
    }
]

const UpperBar = ({Mode, setMode, setLowerText, InputMode, setInputMode}) => {
    const [searchActive, setSearchActive] = useState('')
    const [ActiveMode, setActiveMode] = useState(Mode)
    const [ActiveAddInput, setActiveAdd] = useState(InputMode)

    const changeMode = (Mode) =>{
        setMode(Mode)
    }

    const enterInputMode = () => {
        setActiveAdd(!ActiveAddInput)
    }


    useEffect(() => {
        setActiveMode(Mode)
    }, [Mode])

    useEffect(() => {
        setInputMode(ActiveAddInput)
    }, [ActiveAddInput])

    return (
        <div className="Upper-Tools2">
            <div></div>
            <div className="Options2">
                <div className="Op-Change">
                    <button onClick={() => changeMode('forn')} className={`button-change ${ActiveMode == 'forn' ? 'active' : ''} forn`} >Fornecedor</button>
                    <button onClick={() => changeMode('cli')} className={`button-change ${ActiveMode == 'cli' ? 'active' : ''} cli`} >Cliente</button>
                    <button onClick={() => changeMode('product')} className={`button-change ${ActiveMode == 'product' ? 'active' : ''} product`} >Produto</button>
                    <button onClick={() => changeMode('comp')} className={`button-change ${ActiveMode == 'comp' ? 'active' : ''} comp`} >Componente</button>
                </div>
                <button
                onClick={enterInputMode}
                title={`Criar ${ActiveMode == 'Comp' ? 'Componente' : ActiveMode == 'cli' ? 'produto' : 'Fornecedor'}`} 
                className={`button-tool add-item ${ActiveAddInput ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-plus'} />
                </button>
            </div>
            
        </div>
    )
}

const AddNew = ({getTable, setLowerText, setRowsBE, Mode}) => {
    const [InputMode, SetInputMode] = useState(Mode)
    const [IsWrite, setIsWrite] = useState(false)

    const inputRefs = useRef([]); 

    useEffect(() => {
        SetInputMode(Mode)
    }, [Mode])


    const CompCriteria = ['Código', 'Fornecedor', 'Descrição', 'Produto'];
    const FornCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const CustomerCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const ProductCriteria = ['Código', 'Descrição', 'Cliente'];

    const getCriteria = () => {
        switch (InputMode) {
            case 'comp':
                return CompCriteria;
            case 'cli':
                return CustomerCriteria;
            case 'product':
                return ProductCriteria;
            default:
                return FornCriteria;
        }
    };

    const handleSave = () => {
        const criteria = getCriteria();
        const formData = {};

        criteria.forEach((criterion, index) => {
            let key = criterion.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
            key = key.replace(/[^a-zA-Z0-9 ]/g, ""); // Remove caracteres especiais
            formData[key] = inputRefs.current[index].value;
        });

        const link = InputMode == 'cli' ? 'customer' : InputMode == 'forn' ? 'forns' : InputMode == 'product' ? 'products' : 'comp'

        Axios.post(`http://${ip}:3000/api/${link}`, formData)
          .then(function (response) {
            console.log(response);
            getTable(setRowsBE, InputMode)

          })
          .catch(function (error) {
            console.log(error);
            
          }).finally(() => {
            setLowerText(`Linha ${formData.codigo} adicionada a tabela ${InputMode == 'cli' ? 'Clientes' : InputMode == 'forn' ? 'Fornecedores' : InputMode == 'product' ? 'Produtos' : 'Componentes'}`)
          });


        console.log(formData);
    };

    return (
        <div className={`Line-add`}>
            <span>
                {InputMode == 'comp' ? 'Cadastrar Componente' : InputMode == 'cli' ? 'Cadastrar Cliente' : InputMode == 'product' ? 'Cadastrar Produto' : 'Cadastrar Fornecedor'}
            </span>
            <div className={`input-add`}>
                {getCriteria().map((item, i) => (
                    <input ref={el => inputRefs.current[i] = el} key={i} className={`input-write ${item}`} placeholder={item} />
                ))}
            </div>
            <button onClick={handleSave} className={`button-save active`}><FontAwesomeIcon icon={'fa-check'}/></button>
        </div>
    )
}

const LowerBar = ({text}) => {
    

    // useEffect(() => {

    // }, [text])


    return (
        <div className="Lower-Tools2">
            <span>{text}</span>
        </div>
    )
}


const TableItems = () => {
    const [Mode, setMode] = useState('forn')
    const [Edit, setEdit] = useState('view')
    const [InputMode, setInputMode] = useState(false)
    const [RowsBE, setRowsBE] = useState({'code' : 0 , 'data': []})
    const [Rows, setRows] = useState(RowsBE.data)

    const [LowerText, setLowerText] = useState('Aguardando...')


    const CompCriteria = ['Código', 'Fornecedor', 'Descrição', 'Produto'];
    const FornCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const CustomerCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const ProductCriteria = ['Código', 'Descrição', 'Cliente'];


    const getCriteria = () => {
        switch (Mode) {
            case 'comp':
                return CompCriteria;
            case 'cli':
                return CustomerCriteria;
            case 'product':
                return ProductCriteria;
            default:
                return FornCriteria;
        }
    };    
    
    
    
    const [head, setHead] = useState(getCriteria())


    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const regex = /^(\d{2})(\d{1})(\d{4})(\d{4})$/;
        return phoneNumber.replace(regex, '($1) $2 $3-$4');
      }

    const getTable = (setRowsBE, mode) => {

        const type = mode == 'cli' ? 'customer' : mode == 'forn' ? 'forns' : mode == 'product' ? 'products' : 'pecas'

        Axios.get(`http://${ip}:3000/api/${type}/`)
        .then(response => {
          setRowsBE({ code: 200, data: response.data });

          const DataCount = response.data.length;
          const LowerText = DataCount > 1 ? `Encontrado ${DataCount} linhas` : DataCount == 1 ? 'Encontrado 1 linha' : 'Sem resultados encontrados'

          setLowerText(LowerText)
        })
        .catch(error => {
          setRowsBE({ code: 400, data: error });
        });
    }

    useEffect(() => {
        getTable(setRowsBE, Mode)
    }, []);

    useEffect(() => {
        setRows(RowsBE.data)
    }, [RowsBE]);

      
    useEffect(() => {
        setHead(getCriteria());
        getTable(setRowsBE, Mode)
    }, [Mode]);
    
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            setLowerText('Pronto')
        }, 7000)

    }, [LowerText]);

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

    }, [location])

    const TableItem = ({rows, columns, ActiveFilter, SearchActive, Edit, setEdit}) => {
        const [MenuActive, setMenuActive] = useState(0)
        const [EditMode, setEditMode] = useState('view')
        const [EditIndex, setEditIndex] = useState()
        const [EditItem, setEditItem] = useState([])
        const [EditDone, setEditDone] = useState(false)

        const Modal = () => {

            return (
                <div className={`Modal-advice active`}>
                    <div className="msg">
                        {/* <span><FontAwesomeIcon icon={""}/></span> */}
                        <span>Tem certeza que deseja editar itens?</span>
                    </div>
                    <div className="btn">
                        <button>Cancelar</button>
                        <button>Confirmar</button>
                    </div>
                </div>
            )
        }

        const DynInput = ({type, val, onChange, field, index}) => {
            const [ valueEdit, setValueEdit] = useState(val)
            
            const handleBlur = (val) => {
                onChange(field, val);
            }

            return(
                <>
                    {type === 'edit' && (
                        <input 
                            className={`val-input in-input`} 
                            onChange={(e) => setValueEdit(e.target.value)}  
                            value={valueEdit}
                            onBlur={() => handleBlur(valueEdit)}
                            key={`${field}-${index}`} // Adicione uma chave única para cada input
                        />
                    )}
                    {type === 'view' && (
                        <span className={`val-input in-span`} key={`${field}-${index}`}>{val}</span>
                    )}
                </>
            )
        }

        const handleInputChange = (index, field, value) => {
            const updatedEditItem = [...EditItem];
            const itemIndex = updatedEditItem.findIndex((item) => item.index === index);
            if (itemIndex !== -1) {
                updatedEditItem[itemIndex] = { ...updatedEditItem[itemIndex], [field]: value };
            } else {
                updatedEditItem.push({
                     index,
                      id: rows[index].id,
                      [field]: value 
                    });
            }
            setEditItem(updatedEditItem);
            setEditDone(true)
        };

        useEffect(() => {
                if (EditMode === 'edit') {
                    const currentItem = rows[EditIndex];
                    if (currentItem) {
                        const itemIndex = EditItem.findIndex((item) => item.index === EditIndex);
                        const newItem = {
                            index: EditIndex,
                            id: currentItem.id,
                            cod: currentItem.cod,
                            forn_name: currentItem.forn_name,
                            desc_br: currentItem.desc_br,
                            prod_name: currentItem.prod_name,
                        };
            
                        if (itemIndex !== -1) {
                            const updatedEditItem = [...EditItem];
                            updatedEditItem[itemIndex] = newItem;
                            setEditItem(updatedEditItem);
                        } else {
                            setEditItem([...EditItem, newItem]);
                        }
                    }
                }
        }, [EditMode, EditIndex, rows]);

        const openMenu = (id) => {
            if (id === MenuActive) return setMenuActive(0)

            setMenuActive(id)
        }

        const delItem = (id) => {

            Axios.delete(`http://${ip}:3000/api/pecas/delete/${id}`)
            .then(response => {
                console.log('Item excluído com sucesso:', response.data);

                setRows(prevRows => prevRows.filter(row => row.id !== id));

                setLowerText(`ID ${id} excluido`)
            })
            .catch(error => {
                console.error('Erro ao excluir o item:', error);
                setLowerText(`Erro ao excluir linha`)
            });
        }

        const changeLine = (id, index) => {
            if (EditMode === 'view' || EditIndex !== index){
                setEditMode('edit');
                setEditIndex(index);

            } else if (EditMode === 'edit' && EditIndex === index) {

                if (EditDone){
                    const formData = {};
                    const editItem = EditItem.find(item => item.index === index);
                    // const ip = 'localhost';

                    for (const key in editItem) {
                        if (key !== 'index') { // Exclua 'index' e 'id' dos dados do formulário
                            formData[key] = editItem[key];
                        }
                    }
    
                    const link = InputMode == 'cli' ? 'customer' : InputMode == 'forn' ? 'forns' : InputMode == 'product' ? 'products' : 'comp'

                    console.log('edit ', formData)
            
                    Axios.put(`http://${ip}:3000/api/${link}`, formData)
                      .then(function (response) {
                        console.log(response);
                        getTable(setRowsBE, InputMode)
            
                      })
                      .catch(function (error) {
                        console.log(error.response.data);
                        
                      }).finally(() => {
                        setLowerText(`Linha ${formData.codigo} editada na tabela ${InputMode == 'cli' ? 'Clientes' : InputMode == 'forn' ? 'Fornecedores' : InputMode == 'product' ? 'Produtos' : 'Componentes'}`)
                      });
                }

                setEditMode('view');
                setEditIndex(null);
            }
            
            // console.log(`Editing... `, EditIndex)
            // console.log(`ID ${id} editado`)
        }

        const dblClickEdit = (id, index) => {
            if (EditMode === 'view' || EditIndex !== index){
                changeLine(id, index)

            } else if (EditMode === 'edit' && EditIndex === index) {
                changeLine(id, index)
            }
        }

        return (
            <div className="Table-Main">
                {/* <Modal /> */}
                <table>
                    <thead>
                        <th className={`th-dyn td-ckb`}><input 
                        className={`td-ckb-input`}  
                        type="checkbox"
                        /></th>
                        {
                            columns.map((column, i) =>(
                                <th 
                                className={`th-dyn th-${i}`}
                                >{column}</th>
                            ))
                        }
                        <th className={`th-dyn td-menu`}></th>
                    </thead>
                    <tbody>
                        { Mode === 'forn' && (
                            rows.map((row, i) => (
                                <tr className={`td-item claim-${i}`} key={i}>
                                    <td className={`td-item td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     /></td>
                                    <td className={`td-item td-nome td-${i}`}>{row.Nome}</td>
                                    <td className={`td-item td-contato td-${i}`}>{row.contact_name}</td>
                                    <td className={`td-item td-email td-${i}`}>
                                        <a href={`mailto:${row.mail}`} className={`td-link-email`}>
                                            {row.mail}
                                        </a>
                                    </td>
                                    <td className={`td-item td-phone td-${i}`}>{formatPhoneNumber(row.phone)}</td>
                                    <td className={`td-item td-op td-${i}`}>
                                        <div className={`td-op expand ${MenuActive == i + 1 ? 'active' : ''}`}>
                                            <button onClick={() => openMenu(i + 1)}><FontAwesomeIcon icon={'fa-ellipsis-vertical'}/></button>
                                            <div className={`td-op expanded ${MenuActive == i + 1 ? 'active' : ''}`}>
                                                <button ><FontAwesomeIcon icon={'fa-x'}/></button>
                                                <button ><FontAwesomeIcon icon={'fa-pen-to-square'}/></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )
                        }
                          { Mode === 'product' && (
                            rows.map((row, i) => (
                                <tr className={`td-item claim-${i}`} key={i}>
                                    <td className={`td-item td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     /></td>
                                    <td className={`td-item td-cod td-${i}`}>{row.cod}</td>
                                    <td className={`td-item td-desc td-${i}`}>{row.desc_br}</td>
                                    <td className={`td-item td-cli td-${i}`}>{row.cust_name}</td>
                                    <td className={`td-item td-op td-${i}`}>
                                        <div className={`td-op expand ${MenuActive == i + 1 ? 'active' : ''}`}>
                                            <button onClick={() => openMenu(i + 1)}><FontAwesomeIcon icon={'fa-ellipsis-vertical'}/></button>
                                            <div className={`td-op expanded ${MenuActive == i + 1 ? 'active' : ''}`}>
                                                <button ><FontAwesomeIcon icon={'fa-x'}/></button>
                                                <button ><FontAwesomeIcon icon={'fa-pen-to-square'}/></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )
                        }
                        { Mode === 'cli' && (
                            rows.map((row, i) => (
                                <tr className={`td-item claim-${i}`} key={i}>
                                    <td className={`td-item td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     /></td>
                                    <td className={`td-item td-nome td-${i}`}>{
                                        <DynInput 
                                        type={EditIndex == i ? 'edit' : 'view'} 
                                        val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).Nome : row.Nome}
                                        onChange={(field, value) => handleInputChange(i, field, value)}
                                        field="nome"
                                        index={i}
                                        />
                                    }</td>
                                    <td className={`td-item td-contato td-${i}`}>{row.contact_name}</td>
                                    <td className={`td-item td-email td-${i}`}>
                                        <a href={`mailto:${row.mail}`} className={`td-link-email`}>
                                            {row.mail}
                                        </a>
                                    </td>
                                    <td className={`td-item td-phone td-${i}`}>{formatPhoneNumber(row.phone)}</td>
                                    <td className={`td-item td-op td-${i}`}>
                                        <div className={`td-op expand ${MenuActive == i + 1 ? 'active' : ''}`}>
                                            <button onClick={() => openMenu(i + 1)}><FontAwesomeIcon icon={'fa-ellipsis-vertical'}/></button>
                                            <div className={`td-op expanded ${MenuActive == i + 1 ? 'active' : ''}`}>
                                                <button ><FontAwesomeIcon icon={'fa-x'}/></button>
                                                <button ><FontAwesomeIcon icon={'fa-pen-to-square'}/></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )
                        }
                          { Mode === 'comp' && (
                            rows.map((row, i) => (
                                <tr className={`td-item claim-${i}`} key={i}>
                                    <td className={`td-item td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     /></td>
                                    <td 
                                    className={`td-item td-cod td-${i}`}>{
                                        <DynInput 
                                            type={EditIndex == i ? 'edit' : 'view'} 
                                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).cod : row.cod}
                                            onChange={(field, value) => handleInputChange(i, field, value)}
                                            field="cod"
                                            index={i}
                                            />
                                    }</td>
                                    <td 
                                    className={`td-item td-forn td-${i}`}>{
                                        <DynInput 
                                            type={EditIndex === i ? 'edit' : 'view'} 
                                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).forn_name : row.forn_name}
                                            onChange={(field, value) => handleInputChange(i, field, value)}
                                            field="forn_name"
                                            index={i}
                                             />
                                    }</td>
                                    <td 
                                    className={`td-item td-desc td-${i}`}>{
                                        <DynInput 
                                        type={EditIndex === i ? 'edit' : 'view'} 
                                        val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).desc_br : row.desc_br}
                                        onChange={(field, value) => handleInputChange(i, field, value)}
                                        field="desc_br"
                                        index={i}
                                        />
                                    }</td>
                                    <td 
                                    className={`td-item td-prod td-${i}`}>{
                                        <DynInput 
                                        type={EditIndex === i ? 'edit' : 'view'} 
                                        val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).prod_name : row.prod_name}
                                        onChange={(field, value) => handleInputChange(i, field, value)}
                                        field="prod_name"
                                        index={i}
                                        />
                                    }</td>
                                    <td className={`td-item td-op td-${i}`}>
                                        <div className={`td-op expand ${MenuActive == i + 1 ? 'active' : ''}`}>
                                            <button onClick={() => openMenu(i + 1)}><FontAwesomeIcon icon={'fa-ellipsis-vertical'}/></button>
                                            <div className={`td-op expanded ${MenuActive == i + 1 ? 'active' : ''}`}>
                                                <button onClick={() => delItem(row.id)}><FontAwesomeIcon icon={'fa-x'}/></button>
                                                <button onClick={(e) => changeLine(row.id, i)}><FontAwesomeIcon icon={'fa-pen-to-square'}/></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )
                        }
                    </tbody>
                </table>
            </div>
        )
    }


    return (
        <div className="Main Table-Items">
          {/* <TopBar /> */}
          <UpperBar setLowerText={setLowerText} InputMode={InputMode} setInputMode={setInputMode} Mode={Mode} setMode={setMode} />
          {InputMode && (<AddNew setLowerText={setLowerText} setRowsBE={setRowsBE} getTable={getTable} Mode={Mode} setMode={setMode} />)}
          <TableItem setLowerText={setLowerText} Edit={Edit} setEdit={setEdit} setRows={setRows} rows={Rows} columns={head}/>
          <LowerBar text={LowerText}/>

          {/* <Alert alert={'Linha adicionada'} type={'success'}/> */}
        </div>
    )
}

export default TableItems