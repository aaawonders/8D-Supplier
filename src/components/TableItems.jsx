import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import claimsJson from './JSON/claims.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck, faEllipsisVertical, faX, faInfo, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import './css/TableItems.css'
import Axios from 'axios';
import TopBar from "./TopBar";
import Alert from "./alert";
const ip = require('../variables/ip')

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck, faEllipsisVertical, faX, faFilter, faMagnifyingGlass)

const UpperBar = ({Mode, setMode, setLowerText, InputMode, setInputMode, Filter, setFilter}) => {
    const [searchActive, setSearchActive] = useState('')
    const [ActiveMode, setActiveMode] = useState(Mode)
    const [activeFilter, setFilterActive] = useState(Filter)
    const [ActiveAddInput, setActiveAdd] = useState(InputMode)

    const changeMode = (Mode) =>{
        setMode(Mode)
    }

    const enterInputMode = () => {
        setActiveAdd(!ActiveAddInput)
    }

    const enterFilterMode = (Filter) => {
        setFilter(Filter)
    }

    useEffect(() => {
        setActiveMode(Mode)
    }, [Mode])

    useEffect(() => {
        setFilterActive(Filter)
    }, [Filter])

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
                <button title="Eliminar items" className={`button-tool trash`}>
                    <FontAwesomeIcon icon={'fa-trash'} />
                </button>
                <button 
                title={`${activeFilter ? 'Ativar' : 'Desativar'} Filtros`} 
                onClick={enterFilterMode}
                className={`button-tool Filter ${!activeFilter ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={'fa-filter'} />
                </button>
            </div>
            
        </div>
    )
}

const AddNew = ({getTable, setLowerText, setRowsBE, Mode}) => {
    const [InputMode, SetInputMode] = useState(Mode)
    const [IsWrite, setIsWrite] = useState(false)
    const [preformData, inputForm] = useState(["", "", "", ""]);
    const [error, setError] = useState('');
    const [suggests, setSuggests] = useState([])

    const consultSuggets = (text, type) => {
        Axios.get(`http://${ip}:3000/api/${type}/${text}`)
        .then(response => {
            const suggestions = response.data.map(item => ({ id: item.id, nome: item.Nome }));
            setSuggests(suggestions);
        })
        .catch(error => {
            setSuggests([]);
        });
    }

    const link = InputMode == 'cli' ? 'customer' : InputMode == 'forn' ? 'forns' : InputMode == 'product' ? 'products' : 'comp';

    useEffect(() => {
        console.log('suggests', suggests)
    }, [suggests]);

    const inputRefs = useRef([]); 

    useEffect(() => {
        SetInputMode(Mode)
    }, [Mode])

    const InputAdd = ({key, item}) => {

        return (
            <div className="input-add">
                <input 
                    ref={el => inputRefs.current[key] = el} 
                    key={key}
                    onChange={(e) => handleChange(key, InputMode, e.target.value)}
                    value={preformData[key]}
                    className={`input-write ${item} `} 
                    placeholder={item} />
            </div>
        )
    }

    const clickSuggest = (nome, i) => {
        const updatedValues = [...preformData];
        updatedValues[0] = nome;
        inputForm(updatedValues);
        setSuggests([]);
    }


    const CompCriteria = ['Código', 'Fornecedor', 'Descrição', 'Produto'];
    const FornCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const CustomerCriteria = ['Nome', 'Contato', 'Email', 'Telefone'];
    const ProductCriteria = ['Código', 'Descrição', 'Cliente'];

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, ""); // Remove tudo que não for número
        const char = { 0: "(", 2: ") ", 3: " ", 7: "-" };
        let formatted = "";
    
        for (let i = 0; i < numbers.length; i++) {
          formatted += char[i] || "";
          formatted += numbers[i];
        }
    
        return formatted.slice(0, 16); // Limita ao tamanho máximo
      };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    const handleChange = (index, type, value) => {
        const updatedValues = [...preformData];
        
        if (error !== null){
            setTimeout(() => {
                setError('')
            }, 5000);
        } 

        updatedValues[index] = value;

        if (index === 3 && (type === 'forn' || type === 'cli' )){
            updatedValues[index] = formatPhoneNumber(value);
        }

        if (index === 0 && (type === 'forn' || type === 'cli' )){
            consultSuggets(value, link);
        }

        inputForm(updatedValues);
      };

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

        for (let index = 0; index < criteria.length; index++) {
            let key = criteria[index].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
            key = key.replace(/[^a-zA-Z0-9 ]/g, ""); // Remove caracteres especiais

            if (index === 2 && (InputMode === 'forn' || InputMode === 'cli' )) {
                if (!validateEmail(inputRefs.current[index].value)) {
                    setError("Email inválido");
                    return;
                }
            }
            
            if (index === 3 && (InputMode === 'forn' || InputMode === 'cli' )){
                formData[key] = inputRefs.current[index].value.replace(/\D/g, "");
            } else {
                formData[key] = inputRefs.current[index].value;
            }
        }

        const link = InputMode == 'cli' ? 'customer' : InputMode == 'forn' ? 'forns' : InputMode == 'product' ? 'products' : 'comp';

        Axios.post(`http://${ip}:3000/api/${link}`, formData)
          .then(function (response) {
            console.log(response);
            getTable(setRowsBE, InputMode);
          })
          .catch(function (error) {
            
            if (error.response && error.response.status === 409) {
              setError(error.response.data.message);
            } 

          })
          .finally(() => {
            setLowerText(`Linha ${formData.codigo} adicionada a tabela ${InputMode == 'cli' ? 'Clientes' : InputMode == 'forn' ? 'Fornecedores' : InputMode == 'product' ? 'Produtos' : 'Componentes'}`);
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
                    // <InputAdd key={i} item={item}/>
                    <div key={i} className={`input-add-item`}>
                        <input 
                        ref={el => inputRefs.current[i] = el} 
                        key={i}
                        onChange={(e) => handleChange(i, InputMode, e.target.value)}
                        value={preformData[i]}
                        className={`input-write ${item} `} 
                        placeholder={item} />
                        {(item === 'Nome' || item === 'Fornecedor' || item === 'Cliente' || item === 'Produto') && preformData[i] && suggests.length > 0 && (
                            <div key={i} className={`input-suggest i-${i}`}>
                                {suggests.map((item, ie) => (
                                    <span 
                                    key={ie} 
                                    onClick={() => clickSuggest(item.nome, i)}
                                    className={`suggest-item s-${ie}`}>{item.nome}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {error !== '' && (
                <div className={`info active`}>
                    <FontAwesomeIcon icon={faInfo}/>
                    <span>{error}</span>
                </div>
            )}

            <button onClick={handleSave} className={`button-save active`}><FontAwesomeIcon icon={'fa-check'}/></button>
        </div>
    )
}

const FilterBar = ({Mode, Search, SetSearch}) => {

    const SearchBar = ({Search, SetSearch}) => {
        const [searchActive, setSearchActive] = useState(true);

        const handleFocus = () => {
            setSearchActive(true);
        };

        const handleBlur = () => {
            if (Search === '') {
                setSearchActive(false);
            }
        };
        useEffect(() => {
            const inputElement = document.querySelector('.input-search');
            if (inputElement) {
                inputElement.focus();
            }
        }, [Search]);
        // useEffect(() => {
        //     SetSearch(searchText)
        // },
        // [searchText])


        return (
            <div className={`search-div ${searchActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                    placeholder={searchActive ? "Pesquisar" : "..."}
                    className={`input-search ${searchActive ? 'active' : ''}`}
                    type="text"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={Search}
                    onChange={(e) => SetSearch(e.target.value)}
                />
                {Search !== '' && (
                    <button
                    onClick={() => SetSearch('')}
                    className={`btn-delete`}
                    >
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                )}
            </div>
        );
    };

    

    const CompCriteria = ['Fornecedor', 'Produto'];
    const FornCriteria = [''];
    const CustomerCriteria = [''];
    const ProductCriteria = ['Cliente'];

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
    }

    const getAPICriteria = () => {
        switch (Mode) {
            case 'comp':
                return 'pecas';
            case 'cli':
                return 'customer';
            case 'product':
                return 'products';
            default:
                return 'forns';
        }
    }

    const FilterChanger = ({key, type, title}) => {
        const [filterSelected, SetFilterSelected] = useState()
        const [filterInSel, SetFilterDrop] = useState(false)
        const [suggests, SetSuggests] = useState([])



        const changeCriteria = () => {
            if (filterSelected !== null) {
                SetFilterSelected(null)
                return;
            }

            Axios.get(`http://${ip}:3000/api/${type}`)
            .then(response => {

                var text = [];

                response.data.map((item, index) => {
                    text.push(title === 'Fornecedor' ? item.Nome : title === 'Cliente' ? item.Nome : title === 'Produto' ? item.cod : '')
                })

                SetSuggests(text);
                console.log('suggets', suggests)
            })
            .catch(error => {
                SetSuggests([]);
            });
            
            SetFilterDrop(!filterInSel)
        }

        const getCriteria = (item) => {
            if (filterSelected === item) {
                return;
            }

            SetFilterSelected(item)
            SetFilterDrop(false)
        }

        return (
            <div className={`Filter-changer ${filterSelected ? 'active' : ''}`}>
                <div 
                className={`filter-btn ${filterInSel ? 'selecting' : ''} 
                ${filterSelected ? 'active' : ''}`}
                onClick={() => changeCriteria()}
                >
                    <span>{filterSelected ? filterSelected : title}</span>
                    <FontAwesomeIcon icon={faFilter}/>
                </div>
                {filterInSel && ( 
                    <div className="filter-drop">
                        {suggests.map((item, i) => (
                            <span 
                            key={i}
                            onClick={() => getCriteria(item)} 
                            className={`filter-sel f-${i}`}>{item}</span>
                        ))}
                    </div>    
                )}
            </div>
        )
    }


    return (
        <div className={`Filter-bar`}>
            <SearchBar Search={Search} SetSearch={SetSearch} />
            {getCriteria().filter(item => item !== '').map((item, index) => (
                <FilterChanger key={index} title={item} type={getAPICriteria()}/>
            ))}
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
    const [Filter, setFilter] = useState(true)
    const [Search, setSearch] = useState('')

    useEffect(() => {
        console.log('search', Search)
        getTable(setRowsBE, Mode);
    },[Search])

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

        Axios.get(`http://${ip}:3000/api/${type}/${Search ? Search : ''}`)
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
            {type === 'view' ? (
                field === 'mail' ? (
                    <a href={`mailto:${val}`} className={`val-input a-link in-span`} key={`${field}-${index}`}>{val}</a>
                ) : (
                    <span className={`val-input in-span`} key={`${field}-${index}`}>{val}</span>
                )
            ) : (
                <input 
                    className={`val-input in-input`} 
                    onChange={(e) => setValueEdit(e.target.value)}  
                    value={valueEdit}
                    onBlur={() => handleBlur(valueEdit)}
                    key={`${field}-${index}`} // Adicione uma chave única para cada input
                />
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
            setEditDone(true);
            console.log('teste',updatedEditItem)
        };

        useEffect(() => {
            if (EditMode === 'edit') {
            const currentItem = rows[EditIndex];
            if (currentItem) {
                const itemIndex = EditItem.findIndex((item) => item.index === EditIndex);
                const newItem = { index: EditIndex, id: currentItem.id };

                Object.keys(currentItem).forEach(key => {
                if (key !== 'id') {
                    newItem[key] = currentItem[key];
                }
                });

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

        const delItem = (id, line) => {

            const link = Mode == 'cli' ? 'customer' : Mode == 'forn' ? 'forns' : Mode == 'product' ? 'products' : 'comp'

            Axios.delete(`http://${ip}:3000/api/${link}/delete/${id}`)
            .then(response => {
                console.log('Item excluído com sucesso:', response.data);

                setRows(prevRows => prevRows.filter(row => row.id !== line));

                setLowerText(`ID ${line} excluido`)
            })
            .catch(error => {
                console.error('Erro ao excluir o item:', error);
                setLowerText(`Erro ao excluir linha`)
            });
        }



        const [selectedRows, setSelectedRows] = useState([]);

        const handleCheckboxChange = (id) => {
            setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(id)) {
                return prevSelectedRows.filter(rowId => rowId !== id);
            } else {
                return [...prevSelectedRows, id];
            }
            });
        };

        const deleteSelectedItems = () => {
            const link = Mode === 'cli' ? 'customer' : Mode === 'forn' ? 'forns' : Mode === 'product' ? 'products' : 'comp';

            const deletePromises = selectedRows.map(rowId => {
            return Axios.delete(`http://${ip}:3000/api/${link}/delete/${rowId}`)
                .then(response => {
                console.log(`Item ${rowId} excluído com sucesso:`, response.data);
                })
                .catch(error => {
                console.error(`Erro ao excluir o item ${rowId}:`, error);
                });
            });

            Promise.all(deletePromises)
            .then(() => {
                setRows(prevRows => prevRows.filter(row => !selectedRows.includes(row.uuid)));
                setLowerText(`IDs ${selectedRows.join(', ')} excluídos`);
                setSelectedRows([]);
            })
            .catch(error => {
                setLowerText(`Erro ao excluir linhas`);
            });
        };

        useEffect(() => {
            const trashButton = document.querySelector('.button-tool.trash');
            if (trashButton) {
            trashButton.addEventListener('click', deleteSelectedItems);
            }

            return () => {
            if (trashButton) {
                trashButton.removeEventListener('click', deleteSelectedItems);
            }
            };
        }, [selectedRows]);

        const changeLine = (id, index) => {
            if (EditMode === 'view' || EditIndex !== index){
            setEditMode('edit');
            setEditIndex(index);

            } else if (EditMode === 'edit' && EditIndex === index) {

            if (EditDone){
                const formData = {};
                const editItem = EditItem.find(item => item.index === index);
                // const ip = 'localhost';
                console.log(editItem)

                for (const key in editItem) {
                    console.log('formData', formData[key]);
                    console.log('editItem', editItem[key]);
                if (key !== 'index') { // Exclua 'index' e 'id' dos dados do formulário
                    formData[key] = editItem[key];
                }
                }
        
                const link = Mode == 'cli' ? 'customer' : Mode == 'forn' ? 'forns' : Mode == 'product' ? 'products' : 'comp'
                console.log('teste', link)

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

        useEffect(() => {
            const handleKeyDown = (event) => {
            if (EditMode === 'edit' && event.key === 'Enter') {
                changeLine(EditItem[EditIndex]?.id, EditIndex);
            }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
            window.removeEventListener('keydown', handleKeyDown);
            };
        }, [EditMode, EditIndex, EditItem]);

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
                <th key="checkbox-header" className={`th-dyn td-ckb`}><input 
                className={`td-ckb-input`}  
                type="checkbox"
                /></th>
                {
                    columns.map((column, i) =>(
                    <th 
                    key={i}
                    className={`th-dyn th-${i}`}
                    >{column}</th>
                    ))
                }
                <th className={`th-dyn td-menu`}></th>
                </thead>
                <tbody>
                { Mode === 'forn' && (
                    rows.map((row, i) => (
                    <tr 
                    className={`td-item claim-${i}`} 
                    key={i}>
                        <td className={`td-item td-ckb td-${i}`}><input
                         className={`td-ckb-input`} 
                         type="checkbox" 
                         /></td>
                        <td className={`td-item td-nome td-${i}`}>
                        <DynInput 
                            type={EditIndex == i ? 'edit' : 'view'} 
                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).Nome : row.Nome}
                            onChange={(field, value) => handleInputChange(i, field, value)}
                            field="Nome"
                            index={i}
                            />
                        </td>
                        <td className={`td-item td-contato td-${i}`}>{
                            <DynInput 
                            type={EditIndex == i ? 'edit' : 'view'} 
                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).contact_name : row.contact_name}
                            onChange={(field, value) => handleInputChange(i, field, value)}
                            field="contact_name"
                            index={i} />
                            }</td>
                        <td className={`td-item td-email td-${i}`}>
                        {
                            <DynInput 
                            type={EditIndex == i ? 'edit' : 'view'} 
                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? EditItem.find((item) => item.index === i).mail : row.mail}
                            onChange={(field, value) => handleInputChange(i, field, value)}
                            field="mail"
                            index={i} />
                        }
                        </td>
                        <td className={`td-item td-phone td-${i}`}>{
                            <DynInput 
                            type={EditIndex == i ? 'edit' : 'view'} 
                            val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? formatPhoneNumber(EditItem.find((item) => item.index === i).phone) : formatPhoneNumber(row.phone)}
                            onChange={(field, value) => handleInputChange(i, field, value)}
                            field="phone"
                            index={i} />
                        }</td>
                        <td className={`td-item td-op td-${i}`}>
                        <div className={`td-op expand ${MenuActive == i + 1 ? 'active' : ''}`}>
                            <button onClick={() => openMenu(i + 1)}><FontAwesomeIcon icon={'fa-ellipsis-vertical'}/></button>
                            <div className={`td-op expanded ${MenuActive == i + 1 ? 'active' : ''}`}>
                            <button onClick={() => delItem(row.uuid, row.id)}><FontAwesomeIcon icon={'fa-x'}/></button>
                            <button onClick={(e) => changeLine(row.uuid, i)}><FontAwesomeIcon icon={'fa-pen-to-square'}/></button>
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
                        <td className={`td-item td-phone td-${i}`}>{
                        <DynInput 
                        type={EditIndex == i ? 'edit' : 'view'} 
                        val={(EditIndex === i && EditItem.find((item) => item.index === i)) ? formatPhoneNumber(EditItem.find((item) => item.index === i).phone) : formatPhoneNumber(row.phone)}
                        onChange={(field, value) => handleInputChange(i, field, value)}
                        field="phone"
                        index={i} />
                        }</td>
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
          <TopBar title={'Edição de Informações produtivas'} />
          <UpperBar setLowerText={setLowerText} InputMode={InputMode} setInputMode={setInputMode} Mode={Mode} setMode={setMode} Filter={Filter} setFilter={setFilter} />
          {InputMode && (<AddNew setLowerText={setLowerText} setRowsBE={setRowsBE} getTable={getTable} Mode={Mode} setMode={setMode} />)}
          {Filter && (<FilterBar Mode={Mode} setMode={setMode} Search={Search} SetSearch={setSearch} />)}
          <TableItem setLowerText={setLowerText} Edit={Edit} setEdit={setEdit} setRows={setRows} rows={Rows} columns={head}/>
          <LowerBar text={LowerText}/>
          {/* <Alert alert={'Linha adicionada'} type={'success'}/> */}
        </div>
    )
}

export default TableItems