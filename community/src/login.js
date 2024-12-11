import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.state?.form || '/';
    const no = location.state?.no || '';
    const category_no = location.state?.category_no || '';
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post(
                `${SERVER_ADDRESS}/userdb/login`,
                { id, password },
                { withCredentials: true }
            );
            const data = response.data.login;
            if (data === true) {
                const state = {};
                if (no) state.no = no;
                if (category_no) state.category_no = category_no;
                navigate(path, { state });
            }
        } catch (error) {
            if (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div>
                <p>아이디</p>
                <input type="email" id="id" name="id" value={id} onChange={(text) => setId(text.target.value)} />
            </div>
            <div>
                <p>비밀번호</p>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(text) => setPassword(text.target.value)}
                />
            </div>
            <div>
                <button onClick={login}>로그인</button>
            </div>
        </div>
    );
}

export default Login;
