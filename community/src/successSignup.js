import React from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessSignup() {
    const navigate = useNavigate();
    return (
        <div>
            <div>
                <text>회원가입이 완료되었습니다!🎉</text>
            </div>
            <div>
                <button onClick={() => navigate('/login')}>로그인하러 가기</button>
            </div>
            <div>
                <button onClick={() => navigate('/')}>홈으로</button>
            </div>
        </div>
    );
}

export default SuccessSignup;
