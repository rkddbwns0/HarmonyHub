import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import './css/board.css';
import useFetchUser from './useFetchUser';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function Category_posts() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { no, category } = location.state || {};
    const [boardData, setBoardData] = useState([]);

    const time = (date) => {
        const formatTime = date.slice(0, 16);
        return formatTime;
    };

    const handleWritePost = () => {
        if (!user) {
            alert('로그인을 해주세요.');
            navigate('/login', { state: { path: location.pathname, no: no } });
        } else {
            navigate('/writePost', { state: { no: no } });
        }
    };

    useEffect(() => {
        axios
            .get(`${SERVER_ADDRESS}/board_category/selectBoard`, {
                params: {
                    category_no: no,
                },
            })
            .then((res) => {
                setBoardData(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [no]);

    return (
        <div className="container">
            <header>
                <Nav user={user} />
            </header>
            <div>
                <div className="mainContainer">
                    <div>
                        <strong>{category}</strong>
                    </div>
                    <table className="boardTable">
                        <thead>
                            <tr>
                                <th className="no">번호</th>
                                <th className="titleName">제목</th>
                                <th className="witer">작성자</th>
                                <th className="regDate">날짜</th>
                                <th>좋아요</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boardData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.no}</td>
                                    <td
                                        className="titleText"
                                        onClick={() =>
                                            navigate('/viewBoard', { state: { no: item.no, category_no: no } })
                                        }
                                    >
                                        {item.title}
                                    </td>
                                    <td className="witer">{item.writer}</td>
                                    <td className="regDate">{time(item.regDate)}</td>
                                    <td className="content">{item.liked}</td>
                                    <td className="content">{item.hits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button onClick={handleWritePost}>게시글 작성</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Category_posts;
