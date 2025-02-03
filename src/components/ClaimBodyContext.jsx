// ClaimBodyContext.js
import React, { createContext, useState, useContext } from 'react';
const ClaimBodyContext = createContext();

export const ClaimBodyProvider = ({ children }) => {
    const [claimBody, setClaimBody] = useState({
        // Estrutura inicial do claimBody
    });

    const updateClaimBody = (field, value) => {
        setClaimBody((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <ClaimBodyContext.Provider value={{ claimBody, updateClaimBody }}>
            {children}
        </ClaimBodyContext.Provider>
    );
};

export const useClaimBody = () => useContext(ClaimBodyContext);
