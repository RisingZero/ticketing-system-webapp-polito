import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

import { Button } from '@mui/joy';

function LoginButton() {
    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <Button
            variant={auth.logged ? 'outlined' : 'solid'}
            onClick={() => navigate(auth.logged ? '/logout' : '/login')}
        >
            {auth.logged ? 'Logout' : 'Login'}
        </Button>
    );
}

export default LoginButton;
