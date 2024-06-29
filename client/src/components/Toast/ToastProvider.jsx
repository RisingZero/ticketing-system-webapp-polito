import React from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = React.createContext();

function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((message, { severity }) => {
        const id = Date.now().toString() + Math.floor(Math.random() * 1000);
        const newToast = {
            id,
            message,
            severity,
            closeCallback: () => {
                setToasts((prevToasts) =>
                    prevToasts.filter((toast) => toast.id !== id)
                );
            },
        };
        setToasts((prevToasts) => [...prevToasts, newToast]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            <ToastContainer toasts={toasts} />
            {children}
        </ToastContext.Provider>
    );
}

export default ToastProvider;
export { ToastContext };
