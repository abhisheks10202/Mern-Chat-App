// src/BlockContext.js
import React, { createContext, useState } from 'react';

// Create the context
const BlockContext = createContext();

// Create a provider component
const BlockProvider = ({ children }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [blocker, setBlocker] = useState('');
    const [blocked, setBlocked] = useState('');

    return (
        <BlockContext.Provider value={{ isBlocked, setIsBlocked,blocker,setBlocker,blocked,setBlocked }}>
            {children}
        </BlockContext.Provider>
    );
};

export { BlockContext, BlockProvider };
