import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { usePosts } from './context/postContext';
import useFetchUser from './useFetchUser';
import axios from 'axios';
import './css/board.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function Board() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useFetchUser();
    const { category, category_no } = location.state;
    const { posts, setPosts } = usePosts();
    const [board, setBoard] = useState([]);

    const time = (date) => {
        const formatTime = date.slice(0, 16);
        return formatTime;
    };

    const handleWritePost = () => {
        if (!user) {
            alert('로그인을 해주세요.');
            navigate('/login', { state: { form: location.pathname, category_no: category_no, category: category } });
        } else {
            navigate('/writePost', {
                state: { form: location.pathname, category_no: category_no, category: category },
            });
        }
    };

    useEffect(() => {
        axios
            .get(`${SERVER_ADDRESS}/postdb/select`, { params: { category_no: category_no } })
            .then((res) => {
                setBoard(res.data);
                setPosts(res.data);
            })
            .catch((error) => console.error(error));
    }, [category_no]);

    return (
        <div className="container">
            <header>
                <Nav user={user} />
            </header>
            <div className="mainContainer">
                <div>
                    <strong>{category}</strong>
                </div>
                <table className="boardTable">
                    <thead className="board-thead">
                        <tr className="board-tr">
                            <th className="board-th">번호</th>
                            <th className="titleName">제목</th>
                            <th className="board-th">작성자</th>
                            <th className="board-th">날짜</th>
                            <th className="board-th">좋아요</th>
                            <th className="board-th">조회수</th>
                        </tr>
                    </thead>
                    <tbody className="board-tbody">
                        {board.map((item, index) => (
                            <tr key={index}>
                                <td className="board-td">{item?.row_num}</td>
                                <td
                                    className="titleText"
                                    onClick={() =>
                                        navigate('/viewBoard', { state: { no: item?.no, category_no: category_no } })
                                    }
                                >
                                    {item.title}
                                </td>
                                <td className="board-td">{item?.writer}</td>
                                <td className="board-td">{time(item?.regDate)}</td>
                                <td className="board-td">{item?.liked}</td>
                                <td className="board-td">{item?.hits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <button type="button" onClick={handleWritePost}>
                        게시글 작성하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Board;
