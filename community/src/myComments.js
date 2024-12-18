import { useNavigate } from 'react-router-dom';
import useFetchUser from './useFetchUser';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';
import Nav from './Nav';

function MyComments() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const [commentsData, setCommentsData] = useState([]);

    const myCommentsData = async () => {
        try {
            const response = await axios.post(`${SERVER_ADDRESS}/comments/myComments`, {}, { withCredentials: true });
            const data = response.data;
            setCommentsData(data);
            console.log(commentsData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        myCommentsData();
    }, [user]);
    return (
        <div>
            <div>
                <Nav user={user} />
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>카테고리</th>
                            <th>글 제목</th>
                            <th>댓글 내용</th>
                            <th>작성자</th>
                            <th>좋아요</th>
                            <th>작성일</th>
                        </tr>
                    </thead>

                    <tbody>
                        {commentsData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.category}</td>
                                <td>{item.title}</td>
                                <td>{item.comment}</td>
                                <td>{item.nickname}</td>
                                <td>{item.liked}</td>
                                <td>{item.regDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyComments;
