import { useState, useEffect } from 'react';
import './css/Emailtab.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faEnvelope, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faChevronLeft, faEnvelope, faPaperclip )

const EmailTest = [
    {
        'de': 'Carlos',
        'para': 'Leonardo',
        'data': '15/02/2024',
        'assunto': 'Isso é um teste',
        'body': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'annex' : [
            'fsafsafsaf'
        ]
    },
    {
        'de': 'Carlos',
        'para': 'Leonardo',
        'data': '16/02/2024',
        'assunto': 'Isso é um teste 2',
        'body': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'annex' : []
    }
]

const EmailTab = () => {
    const [emailOpen, setEmail] = useState('')


    return (
        <div className={`Email-Tab`}>
            <div className={`Header`}>
                <span className='btn-action btn-back'><FontAwesomeIcon icon={'fa-chevron-left'}/></span>
                <span className='Title'>{`Emails (${EmailTest.length})`}</span>
                <span className='btn-action btn-mail'><FontAwesomeIcon icon={'fa-envelope'}/></span>
            </div>
            <div className={`Main-Body-Email`}>
                {
                    EmailTest.map((item, index) => (
                        <div key={index} className={`Email-item E-${index}`}>
                            <span className={`email-icon`}><FontAwesomeIcon icon={'fa-envelope'} /></span>
                            <div className={`email-details`}>
                                <span className='email-assunto'>{item.assunto}</span>
                                <div className='email-people'>
                                    <span>De: {item.de}</span>
                                    <span>Para: {item.para}</span>
                                </div>
                            </div>
                            <div className='email-details2'>
                                <span className={`email-data`}>{item.data}</span>
                                <span>{item.annex.length > 0 && (<FontAwesomeIcon icon={'fa-paperclip'}/>)}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default EmailTab