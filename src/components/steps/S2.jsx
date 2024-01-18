import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import './../css/steps.css'

library.add(faPlus)


const Step2 = () => {

    const InputWrite = ({label, type, id, onChange, width}) => {

        if (!id){
            id = 'X';
        }

        return (
            <div className={`Input-div-Write I-${id}`}>
                {/* <label>{label}</label> */}
                <input placeholder={label} type={type} className={`Input-Write I-${id} ${width}`} onChange={onChange} />
            </div>
        )
    }

    const Frame = ({children, label, id}) => {

        return (
            <div className={`Frame F-${id}`}>
                <span className={`Frame-Label`}>{label}</span>
                {children}
            </div>
        )
    }

    const DynamicInput = ({limit, start, label}) =>{
        const [InputCount, setInputCount] = useState()

        return (
            <div className={`Dynamic `}>
                <button className={`Add-Input`}><FontAwesomeIcon icon={"fa-plus"} /></button>
                <div className={`table-dym`}>

                </div>
            </div>
        )
    }

    const InputTable = ({rows}) => {

        if (!rows){
            rows = 1;
        }

          // Inicializa um array para armazenar os elementos JSX
        const inputRows = [];

        // Faz um loop até o valor de rows
        for (let i = 0; i < rows; i++) {
            // Adiciona os elementos JSX desejados ao array
            inputRows.push(
            <div key={i} className={`Input-Space i-${i + 1}`}>
                <span>{i + 1}</span>
                <input placeholder="Nome" className={`Input-Name i-${i + 1}`} />
                <input placeholder="Departamento" className={`Input-Dep i-${i + 1}`} />
            </div>
            );
        }

        return (
            <div className={`InputTable`}>
                {inputRows}
            </div>
        )
    }

    return (
        <div className="Steps S1 Sup-8D">
            <Frame label={'Dados do Fornecedor'} id={1}>
                <InputWrite type={'text'} id={1} label={'Nome do Fornecedor'} />
                <InputWrite type={'text'} id={2} width={"big"} label={'Descrição da Falha'} />
            </Frame>
        </div>
    )
}

export default Step2