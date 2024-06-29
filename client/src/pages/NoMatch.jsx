import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AspectRatio, Button, Link, Card, Stack, Typography } from '@mui/joy';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NoMatch = () => {
    return (
        <AspectRatio
            ratio="16/9"
            sx={{
                maxWidth: 400,
                margin: 'auto',
            }}
        >
            <Card color="warning" variant="outlined">
                <Stack spacing={1}>
                    <NewReleasesIcon
                        sx={{
                            fontSize: 48,
                        }}
                    />
                    <Typography level="h3">Page not found</Typography>
                    <Typography>
                        Sorry, seems like this is not the right place!
                    </Typography>
                    <Link component={RouterLink} to="/" underline="none">
                        <Button
                            color="warning"
                            sx={{
                                marginTop: 2,
                            }}
                            endDecorator={<ArrowForwardIcon />}
                        >
                            Home
                        </Button>
                    </Link>
                </Stack>
            </Card>
        </AspectRatio>
    );
};

export default NoMatch;
