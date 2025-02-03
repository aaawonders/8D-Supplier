import { useState, useEffect } from "react";
import './css/TableClaims.css'
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import claimsJson from './JSON/claims.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import SearchBar from "./searchTable";
import TopBar from "./TopBar";
import Modal from "./Modal";

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft, faCaretUp, faCaretDown, faCheck)

const UpperBar = ({ActiveFilter, SetFailFilter, SearchActive, SetSearch}) => {
    const [searchActive, setSearchActive] = useState('')

    const FilterStatus = () => {
        const [failureSet, SetFailure] = useState('none');
        const [listActive, setListActive] = useState(false);

        const openList = () => {
            setListActive(!listActive);
        }

        const selFilter = (Filter) => {
            if (Filter === failureSet) return
            SetFailure(Filter);
            SetFailFilter(Filter);

            setListActive(!listActive);
        }

        useEffect(() => {
            SetFailure(ActiveFilter)
    
        }, [ActiveFilter]);

        return (
            <div className={`Filter-by-falha ${listActive ? 'active' : ''}`}>
                <button onClick={() => openList()} className={`button-tool`}>Filtrar por status <FontAwesomeIcon icon={'fa-caret-down'} /></button>
                <div selected={failureSet} className={`filter-list-fails ${listActive ? 'active' : ''}`}>
                    <div onClick={() => selFilter('none')}
                    className={`op-fail none ${failureSet == 'none' ? 'active' : ''}`}
                    >
                        {failureSet === 'none' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat">Nenhum</span>
                    </div>
                    <div onClick={() => selFilter('open')}
                    className={`op-fail open ${failureSet == 'open' ? 'active' : ''}`}
                    >
                        {failureSet === 'open' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-open">Aberto</span>
                    </div>
                    <div onClick={() => selFilter('overdue')}
                    className={`op-fail overdue ${failureSet == 'none' ? 'active' : ''}`}
                    >
                        {failureSet === 'overdue' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-overdue">Vencido</span>
                    </div>
                    <div onClick={() => selFilter('new')}
                    className={`op-fail new ${failureSet == 'none' ? 'active' : ''}`}
                    >                       
                        {failureSet === 'new' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-new">Novo</span>
                    </div>
                    <div onClick={() => selFilter('closed')}
                    className={`op-fail closed ${failureSet == 'none' ? 'active' : ''}`}
                    >                       
                        {failureSet === 'closed' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-closed">Fechado</span>
                    </div>
                    <div onClick={() => selFilter('action')}
                    className={`op-fail action ${failureSet == 'none' ? 'active' : ''}`}
                    >                       
                        {failureSet === 'action' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-action">Ação Implem.</span>
                    </div>
                    <div onClick={() => selFilter('cancel')}
                    className={`op-fail cancel ${failureSet == 'none' ? 'active' : ''}`}
                    >                       
                        {failureSet === 'cancel' ? (<FontAwesomeIcon icon="fa-check"/>) : ''}
                        <span className="label-stat lb-cancel">Cancelado</span>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        SetSearch(searchActive)

    }, [searchActive]);

    const delClaim = () => {
        
    }

    return (
        <div className="Upper-Tools">
            <div><SearchBar SearchActive={searchActive} setSearchActive={setSearchActive} /></div>
            <div className="Options">
                <div className="Op-Edit">
                    <button title="Criar Reclamação" className={`button-tool`}><FontAwesomeIcon icon={'fa-plus'} /></button>
                    <button title="Eliminar Reclamação" className={`button-tool trash`}><FontAwesomeIcon icon={'fa-trash'} /></button>
                    <button title="Editar Reclamação" className={`button-tool`}><FontAwesomeIcon icon={'fa-pen-to-square'} />
                    </button>
                </div>
                <div className="Op-Pags">
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-chevron-left'} /></button>
                    <input style={{width: '80px', textAlign: "center"}} placeholder="Page" type="text"/>
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-chevron-right'} /></button>
                </div>
                <FilterStatus />
            </div>
            
        </div>
    )
}

const LowerBar = () => {


    return (
        <div className="Lower-Tools">
            <span>Aguardando...</span>
        </div>
    )
}


const TableClaims = () => {
    const [FailFilter, SetFailFilter] = useState('none');
    const [SearchActive, SetSearch] = useState('');


    const head = ['Status', 'LNC', 'Fornecedor', 'Estado', 'Data', 'Código', 'Item', 'Descrição', 'Aplicação', 'Aberto Por' ]

    const build = [
    //     {
    //     lnc: '031/23',
    //     by: 'Leonardo'
    // }
    ]

    const [hasSocketClaim, SetSocketClaim] = useState(build);

    console.log('build ', hasSocketClaim)

    const claims = claimsJson;

    const [checkedState, setCheckedState] = useState(new Array(claims.length).fill(false));

    // Manipulador para marcar/desmarcar todos
    const handleCheckAll = (event) => {
        setCheckedState(new Array(claims.length).fill(event.target.checked));
    };

    // Manipulador para checkboxes individuais
    const handleCheck = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };

    // Efeito para atualizar o estado do checkbox "marcar todos"
    useEffect(() => {
        const isAllChecked = checkedState.every(Boolean);
        const isIndeterminate = checkedState.some(Boolean) && !isAllChecked;
        const masterCheckbox = document.querySelector('.th-dyn.td-ckb input');

        if (masterCheckbox) {
            masterCheckbox.checked = isAllChecked;
            masterCheckbox.indeterminate = isIndeterminate;
        }

        if (checkedState.some((item) => item == true)) {
            console.log('algum marcado')
            
            document.querySelector('.button-tool.trash').classList.add('On');
            // document.querySelector('.button-tool.trash').style.color = 'red';
        } else {
            document.querySelector('.button-tool.trash').classList.remove('On');
            // document.querySelector('.button-tool.trash').style.color = 'white';
        }

    }, [checkedState]);


    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

    }, [location]);

    const Table = ({rows, columns, ActiveFilter, SearchActive}) => {
        const [sort, setSortColumn] = useState ('th-1')
        const [sortDir, setSortDic] = useState ('')
        const [sortedRows, setSortedRows] = useState(rows);

        const sortData = () => {
            const sortedRowsCopy = [...sortedRows];

            sortedRowsCopy.sort((a, b) => {
                const valueA = a[sort].toLowerCase();
                const valueB = b[sort].toLowerCase();

                if (sortDir === 'asc') {
                    return valueA.localeCompare(valueB);
                } else {
                    return valueB.localeCompare(valueA);
                }
            });

            setSortedRows(sortedRowsCopy);
        };

        const SortClick = ({column}) =>{
            if (sort === column) {
                // Se já estivermos classificando pela mesma coluna, invertemos a direção
                setSortDic(sortDir === 'asc' ? 'desc' : 'asc');
            } else {
                // Se estamos classificando por uma nova coluna, definimos a coluna e a direção padrão
                setSortColumn(column);
                setSortDic('asc');
            }
        }

        // useEffect(() => {
        //     // Chamada para sortData sempre que sortColumn ou sortDirection mudar
        //     sortData();
        // }, [sort, sortDir]);

        const sortFail = () => {
            const sortedRow = [...rows];

            if (ActiveFilter === 'none'){
                return setSortedRows(rows)
            }

            const filtered = sortedRows.filter(row => row.status.includes(ActiveFilter));
            return setSortedRows(filtered)
        }

        const searchFail = () => {
            const sortedRow = [...rows];

            if (SearchActive === '') return setSortedRows(sortedRow)

            const filtered = sortedRows.filter(row => Object.values(row).some((val) => 
                String(val).toLowerCase().includes(SearchActive.toLowerCase())));
            return setSortedRows(filtered)
        }

        useEffect(() => {
            document.title = 'Lista de Reclamações'
        }, []);

        useEffect(() => {
            sortFail();
        }, [ActiveFilter]);

        useEffect(() => {
            // searchFail()
        }, [SearchActive]);

        return (
            <div className="Table-Main">
                <table>
                    <thead>
                        <th className={`th-dyn td-ckb`}><input 
                        className={`td-ckb-input`}  
                        type="checkbox"
                        onChange={handleCheckAll} 
                        /></th>
                        {
                            columns.map((column, i) =>(
                                <th 
                                className={`th-dyn th-${i}`}
                                onClick={() => SortClick(i)}
                                >{column}</th>
                            ))
                        }
                    </thead>
                    <tbody>
                    {hasSocketClaim && (
                        hasSocketClaim.map((row, i) => (
                            <tr className={`td-claim claim-building td-${i}`} key={i}>
                                <td className={`td-claim td-ckb td-${i}`}></td>
                                <td className={`td-claim td-status-build td-${i}`}>
                                    <span className={`label-stat lb-build`}>
                                       Criando
                                    </span>
                                </td>
                                <td className={`td-claim td-lnc td-${i}`}>{row.lnc}</td>
                                <td colspan="7" className={`td-claim td-lnc td-${i}`}>...</td>
                                <td className={`td-claim td-opb td-${i}`}>{row.by}</td>
                            </tr>
                        ))
                    )}
                        {!sortedRows && (
                            <div className="no-content">Sem reclamações</div>
                        )}

                        {sortedRows &&
                            sortedRows.map((row, i) => (
                                <tr className={`td-claim claim-${i}`} key={i}>
                                    <td className={`td-claim td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     checked={checkedState[i]}
                                     onChange={() => handleCheck(i)}
                                     /></td>
                                    <td className={`td-claim td-status-${row.status} td-${i}`}>
                                        <span className={`label-stat lb-${row.status}`}>
                                            {row.status === 'open' ? 'Aberto' : row.status === 'closed' ? 'Fechado' : row.status === 'new' ? 'Novo' : row.status === 'Action' ? 'Ação Implem.' : row.status === 'cancel' ? 'Cancel.' : 'Erro'}
                                        </span>
                                    </td>
                                    <td className={`td-claim td-lnc td-${i}`}>{row.lnc}</td>
                                    <td className={`td-claim td-sup td-${i}`}>{row.supplier}</td>
                                    <td className={`td-claim td-state td-${i}`}>{row.estado}</td>
                                    <td className={`td-claim td-data td-${i}`}>{row.data}</td>
                                    <td className={`td-claim td-cod td-${i}`}>{row.cod}</td>
                                    <td className={`td-claim td-item td-${i}`}>{row.item}</td>
                                    <td className={`td-claim td-desc td-${i}`}>{row.desc}</td>
                                    <td className={`td-claim td-app td-${i}`}>{row.applic}</td>
                                    <td className={`td-claim td-opb td-${i}`}>{row.openby}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }


    return (
        <div className="Main Table">
          <TopBar title={"Lista de reclamações"}/>
          <UpperBar ActiveFilter={FailFilter} 
          SetFailFilter={SetFailFilter} 
          SearchActive={SearchActive} 
          SetSearch={SetSearch}/>
          <Table SearchActive={SearchActive} ActiveFilter={FailFilter} rows={claims} columns={head}/>
          <LowerBar />
          {/* <Modal /> */}
        </div>
    )
}

export default TableClaims