import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useToast } from '../hooks';
import API from '../API';

import { ToastSeverity } from './Toast';
import {
    Modal,
    ModalClose,
    ModalDialog,
    DialogTitle,
    DialogContent,
    FormControl,
    FormLabel,
    Stack,
    Input,
    Button,
} from '@mui/joy';

function LoginModal({ loginCallback }) {
    const navigate = useNavigate();
    const { onSubmit } = useOutletContext();
    const { addToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        API.login(username, password)
            .then((user) => {
                if (user) {
                    addToast(`Login successful - ${user.username}`, {
                        severity: ToastSeverity.SUCCESS,
                    });
                    loginCallback(user);
                    if (onSubmit) onSubmit();
                }
            })
            .catch((error) => {
                addToast(error, {
                    severity: ToastSeverity.ERROR,
                });
            });
    };

    return (
        <Modal open onClose={() => navigate('/')}>
            <ModalDialog>
                <ModalClose />
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleLogin}>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    placeholder="Username"
                                    name="username"
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </FormControl>
                        </Stack>
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            sx={{ mt: 2, width: '100%' }}
                        >
                            Login
                        </Button>
                    </form>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}

export default LoginModal;
