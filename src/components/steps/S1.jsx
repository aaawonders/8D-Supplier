import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import './../css/steps.css'

library.add(faPlus)


const Step1 = () => {

    const InputWrite = ({label, type, id, onChange, width}) => {

        if (!id){
            id = 'X';
        }

        return (
            <div className={`Input-div-Write I-${id}`}>
                <label>{label}</label>
                <input type={type} className={`Input-Write I-${id} ${width}`} onChange={onChange} />
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

    return (
        <div className="Steps S1 Sup-8D">
            <Frame label={'Dados do Fornecedor'} id={1}>
                <InputWrite type={'text'} id={1} label={'Código Interno'} />
                <InputWrite type={'text'} id={2} label={'Quantidade'} />
            </Frame>
            <Frame label={'Informações da Equipe'}>
                <div>
                    <InputWrite type={'text'} id={1} label={'Código Interno'} />
                </div>
                <div>
                    
                </div>
            </Frame>
        </div>
    )
}

export default Step1