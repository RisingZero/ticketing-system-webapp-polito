import React from 'react';

import { ToastIcons, ToastSeverity } from '.';
import { Stack, Snackbar } from '@mui/joy';

function ToastContainer({ toasts }) {
    return (
        <Stack direction="column" spacing={2}>
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    size="md"
                    variant="solid"
                    color={toast.severity}
                    onClose={(event, reason) => {
                        if (
                            reason === 'clickaway' ||
                            reason === 'escapeKeyDown'
                        ) {
                            return;
                        }
                        toast.closeCallback();
                    }}
                    severity={toast.severity}
                    startDecorator={ToastIcons[toast.severity]}
                    autoHideDuration={3000}
                >
                    <ToastContent toastId={toast.id}>{toast.message}</ToastContent>
                </Snackbar>
            ))}
        </Stack>
    );
}

function ToastContent({ children, toastId }) {
    if (typeof children === 'string') return <div>{children}</div>;
    if (!children.errors) return <div>{children.message}</div>;

    console.log(children.errors);
    return (
        <Stack
            sx={{
                maxWidth: 300,
                whiteSpace: 'normal',
                px: 2,
            }}
        >
            <div
                style={{
                    fontWeight: 'bold',
                    marginBottom: '0.2rem',
                    fontSize: '1.1rem',
                }}
            >
                {children.message}
            </div>
            <div>
                {children.errors.map((error, index) => (
                    <div key={`toast-${toastId}-error-${index}`}>{error}</div>
                ))}
            </div>
        </Stack>
    );
}

export default ToastContainer;
