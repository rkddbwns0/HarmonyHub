import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';
import './css/viewBoard.css';

function ViewBoard() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const location = useLocation();
    const no = location.state.no;
    const category_no = location.state.category_no;
    const [view, setView] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState('');
    const [reComments, setReComments] = useState('');
    const [reply, setReply] = useState('');
    const [parentId, setParentId] = useState(null);
    const [commentsLog, setCommentsLog] = useState([]);
    const [showComments, setShowComments] = useState(false);

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
            if (comments === '' && reComments === '') {
                alert('댓글을 입력해 주세요.');
            } else {
                try {
                    const response = await axios.post(
                        `${SERVER_ADDRESS}/comments/insert`,
                        {
                            board_no: no,
                            category_no: category_no,
                            nickname: user[0]?.nickname,
                            comment: parentId ? reComments : comments,
                            parent_id: parentId || null,
                        },
                        { withCredentials: true }
                    );
                    setParentId(null);
                    setComments('');
                    setReComments('');
                    setShowComments(!showComments);
                    commentsData();
                    alert('댓글이 입력되었습니다!');
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            alert('로그인을 해주세요.');
            navigate('/login', { state: { form: location.pathname, no: no, category_no: category_no } });
            return;
        }
    };

    const handleReply = (parent_id) => {
        setShowComments(!showComments);
        setParentId(parent_id);
        setComments('');
    };

    return (
        <div className="container">
            <div>
                <Nav user={user} />
            </div>
            <div className="mainView">
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
                </div>

                <div className="commentsView">
                    <div>
                        <p>댓글</p>
                        <div className="regCommentView">
                            <div className="textareaView">
                                <textarea
                                    className="comment-input"
                                    maxLength={500}
                                    placeholder="내용을 입력해 주세요."
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                                <p className="comments_length">{comments.length} / 500</p>
                                <button onClick={insertComments} className="comment-btn">
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                    {commentsLog.length > 0 ? (
                        <div className="reCommentsContainer">
                            {commentsLog.map((item, index) => (
                                <div key={index} className="reCommentsView">
                                    {category_no === 2 ? (
                                        <p>{item.nickname}</p>
                                    ) : (
                                        <p>
                                            {item.nickname}({formatEmail(item.user_id)})
                                        </p>
                                    )}
                                    <p>{item.comment}</p>
                                    {parentId === item.no ? (
                                        <div>
                                            <textarea
                                                placeholder="답글을 입력하세요."
                                                value={reComments}
                                                onChange={(e) => setReComments(e.target.value)}
                                            />
                                            <button onClick={insertComments} className="comment-btn">
                                                등록
                                            </button>
                                        </div>
                                    ) : null}

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
