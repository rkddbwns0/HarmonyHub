import { useNavigate } from 'react-router-dom';
import useFetchUser from './useFetchUser';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';
import Nav from './Nav';

function ModifyUser() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/userdb/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    };

    const modifyInfo = async () => {
        try {
            const response = await axios.post(`${SERVER_ADDRESS}/userdb/modifyInfo`, {
                nickname: nickname || null,
                password: password || null,
            });
            if (password && response.data.suceess === true) {
                alert('비밀번호가 변경되었습니다. 다시 로그인을 진행해 주세요.');
                logout();
                navigate('/login');
            } else if (nickname && response.data.status === true) {
                console.log('닉네임이 변경되었습니다!');
                navigate('/myPage');
            } else {
                console.log('에러인듯');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log(user);
    }, []);

    return (
        <div>
            <div>
                <Nav user={user} />
            </div>
            <input />
            <input />
            <input />
            <input />
            <input />
        </div>
    );
}

export default ModifyUser;
