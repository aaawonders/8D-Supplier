import { useState } from "react";
import './css/PuP.css'
import Step1 from "./steps/S1";
import Step2 from "./steps/S2";
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

    const renderStepComponent = () => {
        switch (formStep) {
            case 1:
                return <Step1 />;
            case 2:
                return <Step2 />;
            // Adicione mais casos conforme necessário
            default:
                return null;
        }
    }


    var Title = ['D1 - Descrição da Não-Conformidade', 'D2. Ação(ões) de Contenção(ões)']

    return (
        <div className="Main Sup-8D">
            <div className={`StepPage Bigger`}>
                <div className="Step-Header"><span>{Title[formStep - 1]}</span></div>
                <PageChooser ActualPage={formStep} setFormStep={setFormStep}/>
                {renderStepComponent()}
                <Buttons />
            </div>
        </div>
    )
}

export default Sup8D