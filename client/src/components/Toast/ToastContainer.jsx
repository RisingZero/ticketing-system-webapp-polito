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
                    {toast.message}
                </Snackbar>
            ))}
        </Stack>
    );
}

export default ToastContainer;
