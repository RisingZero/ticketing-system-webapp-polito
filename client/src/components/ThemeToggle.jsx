import React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import { AspectRatio, IconButton } from '@mui/joy';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton
            id="toggle-mode"
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'dark' && <DarkModeRoundedIcon />}
            {mode === 'light' && <LightModeIcon />}
        </IconButton>
    );
}

export default ThemeToggle;
