import { useState, useEffect } from "react";
import './css/TableClaims.css'
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import claimsJson from './JSON/claims.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import SearchBar from "./searchTable";

library.add(faPlus, faTrash, faPenToSquare,faChevronRight, faChevronLeft)

const UpperBar = () => {

    return (
        <div className="Upper-Tools">
            <div><SearchBar /></div>
            <div className="Options">
                <div className="Op-Edit">
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-plus'} /></button>
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-trash'} /></button>
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-pen-to-square'} /></button>
                </div>
                <div className="Op-Pags">
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-chevron-left'} /></button>
                    <input style={{width: '80px', textAlign: "center"}} placeholder="Page" type="text"/>
                    <button className={`button-tool`}><FontAwesomeIcon icon={'fa-chevron-right'} /></button>
                </div>
            </div>
            
        </div>
    )
}


const TableClaims = () => {

    const head = ['LNC', 'Fornecedor', 'Estado', 'Data', 'Código', 'Item', 'Descrição', 'Aplicação', 'Aberto Por' ]

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
    }, [checkedState]);


    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

    }, [location]);

    const Table = ({rows, columns}) => {

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
                                <th className={`th-dyn th-${i}`}>{column}</th>
                            ))
                        }
                    </thead>
                    <tbody>
                        {
                            rows.map((row, i) => (
                                <tr className={`td-claim claim-${i}`} key={i}>
                                    <td className={`td-claim td-ckb td-${i}`}><input
                                     className={`td-ckb-input`} 
                                     type="checkbox" 
                                     checked={checkedState[i]}
                                     onChange={() => handleCheck(i)}
                                     /></td>
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
          <UpperBar />
          <Table rows={claims} columns={head}/>
        </div>
    )
}

export default TableClaims