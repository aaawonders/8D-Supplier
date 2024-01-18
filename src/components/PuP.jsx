import { useState, useEffect } from "react";
import './css/PuP.css'
import Step1 from "./steps/S1";
import Step2 from "./steps/S2";
import PageChooser from "./PageChoose";
import Scopes from "./JSON/Scopes.json";
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';


const Sup8D = () => {

    const [form, setForm] = useState({

    });
    const [formStep, setFormStep] = useState(1);

    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

        // Verifica se o primeiro segmento é '8D'
        if (pathSegments[1] === "8D") {
            // Verifica o segmento seguinte para determinar o formStep
            switch(pathSegments[2]) {
                case "D1":
                    setFormStep(1);
                    break;
                case "D2":
                    setFormStep(2);
                    break;
                case "D3":
                    setFormStep(3);
                    break;
                case "D4":
                    setFormStep(4);
                    break;
                case "D5":
                    setFormStep(5);
                    break;
                case "D6":
                    setFormStep(6);
                    break;
                case "D7":
                    setFormStep(7);
                    break;
                case "D8":
                    setFormStep(8);
                    break;
                // Adicione casos adicionais conforme necessário
                default:
                    setFormStep(1);
                    break;
            }
        }

    }, [location]);

    const Buttons = () => {

        return (
            <div className="Buttons-nav">
                <button className={''}>Voltar</button>
                <button className={'finish'}>Prosseguir</button>
            </div>
        )
    }

    var Title = ['D1 - Descrição da Não-Conformidade', 'D2. Ação(ões) de Contenção(ões)']

    var Lang = "PT"

    var Titles = Scopes[Lang].Steps
    console.log("Scopes ", Titles[0].stepindex)

    return (
        <div className="Main Sup-8D">
            <div className={`StepPage Bigger`}>
                <div className="Step-Header"><span>{Titles[formStep - 1].stepindex + " - " + Titles[formStep - 1].title}</span></div>
                <PageChooser ActualPage={formStep} setFormStep={setFormStep}/>
                <Routes>
                    <Route path="D1" element={<Step1 />} />
                    <Route path="D2" element={<Step2 />} />
                </Routes>
                <Outlet />
                <Buttons />
            </div>
        </div>
    )
}

export default Sup8D