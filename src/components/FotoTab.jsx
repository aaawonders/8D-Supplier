import { useState, useEffect, useRef } from 'react';
import './css/FotoTab.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faXmark, faChevronLeft, faChevronRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlus, faMinus, faXmark, faChevronLeft, faChevronRight, faCircleInfo )

const FotoTest = [
    {
        'link': 'https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'data': '16/02/2024',
        'addedby': 'Leonardo',
        'desc' : 'Peça com falha'
    },
    {
        'link': 'https://images.unsplash.com/photo-1544904082-33220c05819f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'data': '15/02/2024',
        'addedby': 'Leonardo',
        'desc' : 'Peça com falha 2'
    }
]

const FullFoto = ({src, SetFullImage}) => {
    const [AtualZoom, setZoom] = useState(1)
    const [inputValue, setInputValue] = useState('100%');
    const [mouseType, setMouseType] = useState('move')
    const [infoOpen, setInfoOpen] = useState(false)

    let PercentValue = AtualZoom * 100

    console.log('zoom ', AtualZoom)

    const zoomIn = () => {
        if (AtualZoom < 2) {
            setZoom(Number((AtualZoom + 0.25).toFixed(2)))
        }
    }

    const zoomOut = () => {
        if (AtualZoom > 0.5) {
            setZoom(Number((AtualZoom - 0.25).toFixed(2)))
        }
    }

    const closePopUp = () => {
        SetFullImage(false);
    }



    const changeZoom = (e) => {
        var val = e.target.value;

        val = val.replace('%','')

        val = val / 100;

        console.log(val)
        setZoom(val)
    }


    const changeScale = ({val}) => {

        val = val.replace('%','')

        val = val / 100;

        setZoom(val)
    }

    const handleWheel = (e) => {
        //if (e.ctrlKey) { // Verifica se Ctrl está pressionado
            console.log(e)
            e.preventDefault(); // Previne o comportamento padrão de scroll
            e.stopPropagation();
            console.log(e.deltaY * 1)
            const newZoom = Number((AtualZoom - e.deltaY * 0.001).toFixed(2));
            setZoom(newZoom < 0.5 ? 0.5 : newZoom > 2 ? 2 : newZoom);
        //}
    };


    const openInfoBox = () => {
        return setInfoOpen(!infoOpen)
    }
    
    useEffect(() => {
        if (AtualZoom < 0.5){
            return setZoom(0.5)
        }

        if (AtualZoom > 2){
            return setZoom(2)
        }
    }, [AtualZoom])

    return (
        <div className='Pop-up'>
            <div className={`FullImage`}>
                <div className={`Tools`}>
                    <div className={`ZoomBox`}>
                        <input onChange={(e) => changeZoom(e)} value={PercentValue + '%'}/>
                        <button onClick={zoomIn} className='zoom zoom-btn zoom-in'><FontAwesomeIcon icon={'fa-plus'} /></button>
                        <button onClick={zoomOut} className='zoom zoom-btn zoom-out'><FontAwesomeIcon icon={'fa-minus'} /></button>
                    </div>
                    <span className='divisor'></span>
                    <button onClick={openInfoBox} className={`zoom zoom-btn info ${infoOpen ? 'active' : ''}`}><FontAwesomeIcon icon={'fa-circle-info'} /></button>
                    <button onClick={closePopUp} className='zoom-btn close-fullimage'><FontAwesomeIcon icon={'fa-xmark'} /></button>
                </div>
                <div className={`Info ${infoOpen ? 'active' : ''}`}>
                    <span className={`Title`}>Informações da Foto</span>
                    <div className='Infos'>
                        <span>Descrição: {src.desc}</span>
                        <span>Data: {src.data}</span>
                        <span>Adicionada por: {src.addedby}</span>
                    </div>
                </div>
                <div className={`Image`}>
                    <img
                    onWheel={(e) => handleWheel(e)} 
                    style={{transform: `translate(-50%, -50%) scale(${AtualZoom})`}} 
                    draggable='false' 
                    className={`FotoAtual`} 
                    src={src.link}/>
                </div>
            </div>
        </div>
    )
}

const FotoTab = () => {
    const [fotoQuant, SetFotoQuant] = useState(FotoTest.length - 1)
    const [AtualFoto, SetFotoAtual] = useState(0)
    const [ActiveInfo, SetActiveInfo] = useState(false);
    const [FullImage, SetFullImage] = useState(false);
    const timerRef = useRef(null);

    const FotoNext = () => {
        if (AtualFoto == fotoQuant) return SetFotoAtual(0)

        SetFotoAtual(AtualFoto + 1)
    }

    const FotoBack = () => {
        if (AtualFoto == 0) return SetFotoAtual(fotoQuant)

        SetFotoAtual(AtualFoto - 1)
    }

    const hoverInfo = () => {
        timerRef.current = setTimeout(() => {
            SetActiveInfo(true);
        }, 1000);
    }

    const hoverInfoGo = () => {
        clearTimeout(timerRef.current);
        SetActiveInfo(false);
    }

    const openPopup = () => {
        SetFullImage(true)
    }

    return (
        <>
        <div className={`Foto-Tab`}>
            <div onMouseEnter={hoverInfo} onMouseLeave={hoverInfoGo} className={`foto-show`}>
                <img onClick={openPopup} className={`FotoAtual Foto-${AtualFoto}`} src={FotoTest[AtualFoto].link}/>
            </div>
            <div className={`foto-index`}>
                {
                    FotoTest.map((foto, index) => (
                        <span 
                        key={index}
                        index={index}
                        className={`foto-pag f-${index} ${AtualFoto == index ? 'active' : ''}`}
                        onClick={() => SetFotoAtual(index)}
                        ></span>
                    ))
                }
            </div>
            <div className={`Arrows`}>
                <span onClick={FotoBack} className={'Arrow-left'}><FontAwesomeIcon icon={'fa-chevron-left'} /></span>
                <span onClick={FotoNext} className={'Arrow-right'}><FontAwesomeIcon icon={'fa-chevron-right'} /></span>
            </div>
            <div className={`info-basic ${ActiveInfo ? 'active' : ''}`}>
                <span>Descrição: {FotoTest[AtualFoto].desc}</span>
                <span>Data: {FotoTest[AtualFoto].data}</span>
            </div>
        </div>
        {FullImage && (
            <FullFoto SetFullImage={SetFullImage}  src={FotoTest[AtualFoto]} />
        )}
        </>
    )
}


export default FotoTab