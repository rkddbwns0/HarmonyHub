import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function ViewBoard() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const location = useLocation();
    const no = location.state.no;
    const category_no = location.state.category_no;
    const [view, setView] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState('');
    const [reply, setReply] = useState('');
    const [parentId, setParentId] = useState(null);
    const [commentsLog, setCommentsLog] = useState([]);

    const formatEmail = (data) => {
        const [localPart, domain] = data.split('@');
        const maskedDomain = domain ? domain.slice(0, 5).replace(/./g, '*') : '';
        return `${localPart}@${maskedDomain}`;
    };

    const viewData = async () => {
        try {
            const response = await axios.get(`${SERVER_ADDRESS}/postdb/view`, {
                params: {
                    post_no: no,
                    category_no: category_no,
                },
            });
            const data = response.data;
            setView(data);
        } catch (error) {
            console.error(error);
        }
    };

    const checkLiked = async () => {
        if (user) {
            try {
                const response = await axios.post(
                    `${SERVER_ADDRESS}/postdb/checkLiked`,
                    { post_no: no, category_no: category_no },
                    { withCredentials: true }
                );
                setIsLiked(response.data.liked);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const commentsData = async () => {
        try {
            const response = await axios.get(`${SERVER_ADDRESS}/comments/select/${no}/${category_no}`);
            const data = response.data;
            setCommentsLog(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        viewData();
        checkLiked();
        commentsData();
    }, [no, category_no, commentsLog]);

    const liked = async () => {
        try {
            if (!user) {
                alert('로그인을 해주세요.');
                navigate('/login', { state: { form: location.pathname, no: no, category_no: category_no } });
                return;
            } else {
                const response = await axios.post(
                    `${SERVER_ADDRESS}/postdb/liked`,
                    { post_no: no, category_no: category_no },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setView((prevView) => ({
                        ...prevView,
                        liked: isLiked ? prevView.liked - 1 : prevView.liked + 1,
                    }));
                    setIsLiked((prev) => !prev);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const insertComments = async () => {
        if (user) {
            try {
                const response = await axios.post(
                    `${SERVER_ADDRESS}/comments/insert`,
                    {
                        board_no: no,
                        category_no: category_no,
                        nickname: user.nickname,
                        comment: comments,
                        parent_id: parentId,
                    },
                    { withCredentials: true }
                );
                alert('댓글이 입력되었습니다!');
            } catch (error) {
                console.error(error);
            } finally {
                setComments('');
                setParentId(null);
                commentsData();
            }
        } else {
            alert('로그인을 해주세요.');
            navigate('/login', { state: { form: location.pathname, no: no, category_no: category_no } });
            return;
        }
    };

    const handleReply = (parent_id) => {
        setParentId(parent_id);
        setComments('');
    };

    return (
        <div>
            <div>
                <Nav user={user} />
            </div>
            <div>
                <div>
                    <p>{view.title}</p>
                </div>
                <div>
                    <p>{view.writer}</p>
                </div>
                <div>
                    <p>{view.content}</p>
                </div>
                <div>
                    <p>{view.regDate}</p>
                </div>
                <div>
                    <p>{view.hits}</p>
                </div>
                <div>
                    <p>{view.liked}</p>
                    <button onClick={liked}>{user && isLiked ? '좋아요 취소' : '좋아요'}</button>
                </div>

                <div className="commentsView">
                    <div>
                        <p>댓글</p>
                        <textarea
                            className="comment-input"
                            maxLength={20}
                            placeholder="내용을 입력해 주세요."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                        <button onClick={insertComments}>등록</button>
                    </div>
                    {commentsLog.length > 0 ? (
                        <div>
                            {commentsLog.map((item, index) => (
                                <div key={index}>
                                    <p>
                                        {item.nickname}({formatEmail(item.user_id)})
                                    </p>
                                    <p>{item.comment}</p>
                                    <textarea
                                        placeholder="답글을 입력하세요."
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                    />
                                    <p
                                        onClick={() => {
                                            handleReply(item.no);
                                        }}
                                    >
                                        답글
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ViewBoard;
