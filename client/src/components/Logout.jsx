import React, { useEffect } from 'react';
import API from '../API';

function Logout({ logoutCallback }) {
    useEffect(() => {
        API.logout().then(() => {
            logoutCallback();
        });
    }, []);

    return <></>;
}

export default Logout;
