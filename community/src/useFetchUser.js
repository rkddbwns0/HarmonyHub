import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

const useFetchUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loginUser = async () => {
            try {
                const response = await axios.post(`${SERVER_ADDRESS}/userdb/user`, {}, { withCredentials: true });
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        loginUser();
    }, []);

    return { user };
};

export default useFetchUser;
