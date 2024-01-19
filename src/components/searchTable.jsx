import { useState, useEffect } from "react";
import './css/TableClaims.css'
import { useLocation, Route, Routes, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlus, faMagnifyingGlass)

const SearchBar = () => {

    return (

            <div className={`Search-space`}>
                <span><FontAwesomeIcon icon={"fa-magnifying-glass"}/></span>
                <input className={`search`} type="text"/>
                <div></div>
            </div>
        )
}

export default SearchBar