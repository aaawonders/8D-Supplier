import { useState } from "react";
import './css/PuP.css'
import Step1 from "./steps/S1";
import PageChooser from "./PageChoose";


const Sup8D = () => {

    const [form, setForm] = useState({

    });
    const [formStep, setFormStep] = useState(1);

    const Buttons = () => {

        return (
            <div className="Buttons-nav">
                <button className={''}>Voltar</button>
                <button className={'finish'}>Prosseguir</button>
            </div>
        )
    }

    var Title = ['D1 - Descrição da Não-Conformidade', 'D2. Ação(ões) de Contenção(ões)']

    return (
        <div className="Main Sup-8D">
            <div className={`StepPage Bigger`}>
                <div className="Step-Header"><span>{Title[formStep - 1]}</span></div>
                <PageChooser ActualPage={formStep} setFormStep={setFormStep}/>
                <Step1 />
                <Buttons />
            </div>
        </div>
    )
}

export default Sup8D