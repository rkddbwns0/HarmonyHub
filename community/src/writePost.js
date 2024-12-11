import React, { useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function WritePost() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const location = useLocation();
    const category_no = location.state.category_no;
    const path = location.state.form;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const writePost = async () => {
        try {
            if (title === '' && content === '') {
                alert('내용을 모두 입력해 주세요.');
                return false;
            } else {
                const response = await axios.post(
                    `${SERVER_ADDRESS}/postdb/insert`,
                    { category_no: category_no, title: title, content: content, writer: user.nickname },
                    {
                        withCredentials: true,
                    }
                );

                if (response.data.success === true) {
                    alert('게시글이 작성되었습니다!');
                    navigate(path, { state: { category_no: category_no } });
                    return true;
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            <header>
                <Nav user={user} />
            </header>

            <div>
                <div>
                    <input
                        placeholder="제목을 입력해 주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <p>작성자</p>
                    {user ? <p>{user.nickname}</p> : null}
                </div>
                <div>
                    <textarea
                        maxLength={1000}
                        placeholder="내용을 입력해 주세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <p>{content.length} / 1000</p>
                </div>
                <button onClick={writePost}>작성하기</button>
            </div>
        </div>
    );
}

export default WritePost;
