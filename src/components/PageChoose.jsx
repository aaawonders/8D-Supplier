import { useEffect, useState } from "react";
import './css/PageChoose.css'


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
                <li onClick={() => onclick(1)} className={` ${activeStep == 1 ? 'active' : activeStep > 1 ? 'passed' : ''}`}>1</li>
                <li onClick={() => onclick(2)} className={` ${activeStep == 2 ? 'active' : activeStep > 2 ? 'passed' : ''}`}>2</li>
                <li onClick={() => onclick(3)} className={` ${activeStep == 3 ? 'active' : activeStep > 3 ? 'passed' : ''}`}>3</li>
                <li onClick={() => onclick(4)} className={` ${activeStep == 4 ? 'active' : activeStep > 4 ? 'passed' : ''}`}>4</li>
                <li onClick={() => onclick(5)} className={` ${activeStep == 5 ? 'active' : activeStep > 5 ? 'passed' : ''}`}>5</li>
                <li onClick={() => onclick(6)} className={` ${activeStep == 6 ? 'active' : activeStep > 6 ? 'passed' : ''}`}>6</li>
                <li onClick={() => onclick(7)} className={` ${activeStep == 7 ? 'active' : activeStep > 7 ? 'passed' : ''}`}>7</li>
                <li onClick={() => onclick(8)} className={` ${activeStep == 8 ? 'active' : activeStep > 8 ? 'passed' : ''}`}>8</li>
            </ul>
        </div>
    )
}

export default PageChooser