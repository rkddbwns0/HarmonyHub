import { useNavigate } from 'react-router-dom';
import useFetchUser from './useFetchUser';
import Nav from './Nav';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';
import { useEffect, useState } from 'react';

function MyPosts() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const [postData, setPostData] = useState([]);

    const myPostsData = async () => {
        try {
            const response = await axios.post(`${SERVER_ADDRESS}/postdb/myPosts`, {}, { withCredentials: true });
            const data = response.data;
            setPostData(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        myPostsData();
        console.log(postData);
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
                            <th>제목</th>
                            <th>작성자</th>
                            <th>날짜</th>
                            <th>좋아요</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postData.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.category}</td>
                                <td>{item?.title}</td>
                                <td>{item?.writer}</td>
                                <td>{item?.regDate}</td>
                                <td>{item?.liked}</td>
                                <td>{item?.hits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyPosts;
