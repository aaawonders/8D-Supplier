import Axios from 'axios';
import { useState, useEffect } from 'react';




const GetTable = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://192.168.15.78:3000/api/lnc/');
                setData(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {
                data && (
                    data.map((item) => (
                        <div>
                            <span>Estado: {item.status}</span>
                            <span>LNC: {item.lnc + '/' + item.ano.toString().slice(2, 4)}</span>
                            <span>item: {item.component.cod}</span>
                            <span>data: {item.data}</span>
                            <span>Fornecedor: {item.forn.name}</span>
                            <span>Produto: {item.product.cod}</span>
                            <span>Descrição: {item.desc}</span>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default GetTable