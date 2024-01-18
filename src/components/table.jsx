import { useState, useEffect } from "react";
import './css/TableClaims.css'
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';


const TableClaims = () => {
    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/');

    }, [location]);


    return (
        <div className="Main Table">
          <h1>Tabela</h1>
        </div>
    )
}

export default TableClaims