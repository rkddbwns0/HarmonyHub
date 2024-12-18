import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [checkName, setCheckName] = useState(false);
    const [checkPhone, setCheckPhone] = useState(false);
    const [checkId, setCheckId] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const [idMessage, setIdMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [phoneMessage, setPhoneMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${SERVER_ADDRESS}/userdb/signup`, {
                name: name,
                phone: phone,
                id: id,
                password: password,
                nickname: nickname,
            });
            if (response.status === 201) {
                navigate('/successSignup');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const validEmail = (input) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (input === '') {
            setIdMessage('이메일을 입력해 주세요.');
            return false;
        } else if (!emailPattern.test(input)) {
            setIdMessage('유효하지 않은 형식입니다.');
            return false;
        }
        return true;
    };

    const emailvalid = async () => {
        if (!validEmail(id)) return;

        try {
            const response = await axios.post(`${SERVER_ADDRESS}/userdb/checkUser`, { id: id });
            const data = response.data.message;
            setIdMessage(data);
        } catch (error) {
            console.error(error);
        }
    };

    const validPhone = (input) => {
        const phonePattern = /^(01[016789]{1})[0-9]{4}[0-9]{4}$/;

        if (input === '') {
            setPhoneMessage('휴대폰 번호를 입력해 주세요.');
            return false;
        } else if (!phonePattern.test(input)) {
            setPhoneMessage('유효하지 않은 형식입니다.');
            return false;
        }
        return true;
    };

    const phonevalid = async () => {
        if (!validPhone(phone)) return;

        try {
            const response = await axios.post(`${SERVER_ADDRESS}/userdb/checkUser`, { phone: phone });
            const data = response.data.message;
            setPhoneMessage(data);
        } catch (error) {
            console.error(error);
        }
    };

    const validPassword = (input) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

        if (input === '' || !passwordRegex.test(input)) {
            setPasswordMessage('비밀번호는 영어와 숫자를 포함하여 8~20자로 입력해 주세요.');
        } else {
            setPasswordMessage('사용 가능한 비밀번호입니다.');
            return true;
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>이름</p>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <p>{nameMessage}</p>
                </div>
                <div>
                    <p>휴대폰 번호</p>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        maxLength={11}
                        value={phone}
                        onChange={(e) => {
                            const newPhone = e.target.value;
                            setPhone(newPhone);
                            phonevalid(newPhone);
                        }}
                    />
                    <p>{phoneMessage}</p>
                </div>
                <div>
                    <p>아이디 (이메일)</p>
                    <input
                        type="email"
                        id="id"
                        name="id"
                        value={id}
                        onChange={(e) => {
                            const newId = e.target.value;
                            setId(newId);
                            emailvalid(newId);
                        }}
                    />
                    <p>{idMessage}</p>
                </div>
                <div>
                    <p>비밀번호</p>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validPassword(e.target.value);
                        }}
                        maxLength={20}
                        minLength={8}
                    />
                    <p>{passwordMessage}</p>
                </div>
                <div>
                    <p>닉네임</p>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                        }}
                        maxLength={20}
                        minLength={5}
                    />
                </div>
                <div>
                    <button type="submit">회원가입</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
