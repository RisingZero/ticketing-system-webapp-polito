import React from 'react';
import { useAuth } from '../hooks';

import { Stack, Avatar, Typography } from '@mui/joy';

function UserBadge() {
    const auth = useAuth();

    return (
        <>
            {auth.logged && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography level="title-sm" color="neutral">
                        {auth.user.username}
                    </Typography>
                    <Avatar size="sm" src={auth.user.avatar} />
                </Stack>
            )}
        </>
    );
}

export default UserBadge;
