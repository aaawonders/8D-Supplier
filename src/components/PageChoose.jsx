import { useEffect, useState } from "react";
import './css/PageChoose.css'
import { Link } from "react-router-dom";


const PageChooser = ({ ActualPage, setFormStep }) => {
    const [activeStep, setActiveStep] = useState(1)

    useEffect(() => {
        setActiveStep(ActualPage);
    }, [ActualPage]);

    const onclick = (step) => {
        setActiveStep(step)
        setFormStep(step)
    }

    return (
        <div className={`Page-Chooser`}>
            <ul>
                <Link to={'/8D/D1'} onClick={() => onclick(1)} className={`Link-Step ${activeStep == 1 ? 'active' : activeStep > 1 ? 'passed' : ''}`}>1</Link>
                <Link to={'/8D/D2'} onClick={() => onclick(2)} className={`Link-Step ${activeStep == 2 ? 'active' : activeStep > 2 ? 'passed' : ''}`}>2</Link>
                <Link to={'/8D/D3'} onClick={() => onclick(3)} className={`Link-Step ${activeStep == 3 ? 'active' : activeStep > 3 ? 'passed' : ''}`}>3</Link>
                <Link to={'/8D/D4'} onClick={() => onclick(4)} className={`Link-Step ${activeStep == 4 ? 'active' : activeStep > 4 ? 'passed' : ''}`}>4</Link>
                <Link to={'/8D/D5'} onClick={() => onclick(5)} className={`Link-Step ${activeStep == 5 ? 'active' : activeStep > 5 ? 'passed' : ''}`}>5</Link>
                <Link to={'/8D/D6'} onClick={() => onclick(6)} className={`Link-Step ${activeStep == 6 ? 'active' : activeStep > 6 ? 'passed' : ''}`}>6</Link>
                <Link to={'/8D/D7'} onClick={() => onclick(7)} className={`Link-Step ${activeStep == 7 ? 'active' : activeStep > 7 ? 'passed' : ''}`}>7</Link>
                <Link to={'/8D/D8'} onClick={() => onclick(8)} className={`Link-Step ${activeStep == 8 ? 'active' : activeStep > 8 ? 'passed' : ''}`}>8</Link>
            </ul>
        </div>
    )
}

export default PageChooser