import React from 'react';
import ThemeToggle from '../ThemeToggle';
import LoginButton from '../LoginButton';
import UserBadge from '../UserBadge';
import { Sheet, Stack, Typography } from '@mui/joy';

function Header(props) {
    return (
        <Sheet
            component="header"
            color="primary"
            variant="soft"
            sx={{
                padding: '0.7rem 1.3rem',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography
                    level="h1"
                    sx={{
                        justifySelf: 'flex-start',
                    }}
                >
                    {props.title}
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyItems="flex-end"
                    spacing={2}
                >
                    <UserBadge />
                    <LoginButton />
                    <ThemeToggle />
                </Stack>
            </Stack>
        </Sheet>
    );
}

export default Header;
