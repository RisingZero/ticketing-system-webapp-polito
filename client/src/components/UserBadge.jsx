import React from 'react';
import { useAuth } from '../hooks';

import { Stack, Avatar, Typography } from '@mui/joy';

function UserBadge() {
    const auth = useAuth();

    return (
        <>
            {auth.logged && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        level="title-sm"
                        color={auth.user.isAdmin ? 'danger' : 'neutral'}
                    >
                        {auth.user.username}
                    </Typography>
                    <Avatar
                        size="sm"
                        src={auth.user.avatar}
                        color={auth.user.isAdmin ? 'danger' : 'neutral'}
                    />
                </Stack>
            )}
        </>
    );
}

export default UserBadge;
