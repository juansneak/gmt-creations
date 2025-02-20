import React, { createContext, useState, useContext } from 'react';

const LayoutContext = createContext();

export const LayoutContextProvider = ({ children }) => {
  const [flashMessage, setFlashMessage] = useState(null);
  
  const showFlashMessage = (newMessage) => {
    setFlashMessage(newMessage);
    setTimeout(() => setFlashMessage(null), 3000);
  };
  
  return (
    <LayoutContext.Provider value={{ flashMessage, showFlashMessage }}>
      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>{flashMessage.text}</div>
      )}
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
