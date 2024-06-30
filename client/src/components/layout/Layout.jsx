import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import { Stack, Box } from '@mui/joy';

function Layout(props) {
    return (
        <Stack>
            <Header title="Help on Road" />
            <Box
                component="main"
                sx={{
                    padding: 2,
                    maxHeight: '100dvh',
                    overflowY: 'auto',
                }}
            >
                {props.children || <Outlet />}
            </Box>
        </Stack>
    );
}

export default Layout;
