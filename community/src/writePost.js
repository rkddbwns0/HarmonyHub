import React, { useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';
import './css/writePost.css';

function WritePost() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const location = useLocation();
    const category_no = location.state.category_no;
    const category = location.state.category;
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
                    { category_no: category_no, title: title, content: content, writer: user[0]?.nickname },
                    {
                        withCredentials: true,
                    }
                );

                if (response.data.success === true) {
                    alert('게시글이 작성되었습니다!');
                    navigate(path, { state: { category_no: category_no, category: category } });
                    return true;
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div>
                <Nav user={user} />
            </div>

            <div className="mainView">
                <div className="topView">
                    <div className="titleView">
                        <input
                            className="titleInput"
                            placeholder="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="categoryView">
                        <p>카테고리</p>
                        <p>{category}</p>
                    </div>
                </div>
                <div className="writerView">
                    <p>작성자</p>
                    {user ? <p>{user[0]?.nickname}</p> : null}
                </div>
                <div>
                    <textarea
                        className="contentInput"
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
