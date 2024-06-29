import React from 'react';
import { ToastContext } from '../components/Toast/ToastProvider';

export function useToast() {
    const toastHelpers = React.useContext(ToastContext);
    return toastHelpers;
}
