import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import './css/main.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

function Main() {
    const { user } = useFetchUser();
    const navigate = useNavigate();
    const [popular_hits, setPopular_hits] = useState([]);
    const [popular_liked, setPopular_liked] = useState([]);
    const time = (date) => {
        const formatTime = date.slice(0, 16);
        return formatTime;
    };
    const [melonData, setMelonData] = useState([]);
    const [genieData, setGenieData] = useState([]);
    const [bugsData, setBugsData] = useState([]);

    const popularHits = async () => {
        try {
            const response = await axios.get(`${SERVER_ADDRESS}/postdb/popular_hits`);
            const data = response.data;
            setPopular_hits(data);
        } catch (error) {
            console.error();
        }
    };

    const popularLiked = async () => {
        try {
            const response = await axios.get(`${SERVER_ADDRESS}/postdb/popular_liked`);
            const data = response.data;
            setPopular_liked(data);
        } catch (error) {
            console.error();
        }
    };

    useEffect(() => {
        popularHits();
        popularLiked();
    }, []);

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <header>
                <Nav user={user} />
            </header>
            <div>
                <div className="tableContainer">
                    <div className="popular-view">
                        <div>
                            <h4>현재 조회수가 가장 높은 게시물이에요👀</h4>
                        </div>
                        <div className="main-table-view">
                            <table className="main-table">
                                <thead className="main-thead">
                                    <tr className="main-tr">
                                        <th className="main-th">카테고리</th>
                                        <th className="main-th">제목</th>
                                        <th className="main-th">작성자</th>
                                        <th className="main-th">작성일</th>
                                        <th className="main-th">조회수</th>
                                        <th className="main-th">좋아요</th>
                                    </tr>
                                </thead>
                                <tbody className="main-tbody">
                                    {popular_hits.map((item, index) => (
                                        <tr className="main-tr" key={index}>
                                            <td className="main-td">{item.category} 게시판</td>
                                            <td
                                                className="main-td"
                                                onClick={() =>
                                                    navigate('viewBoard', {
                                                        state: { no: item.no, category_no: item.category_no },
                                                    })
                                                }
                                            >
                                                {item.title}
                                            </td>
                                            <td className="main-td">{item.writer}</td>
                                            <td className="main-td">{time(item.regDate)}</td>
                                            <td className="main-td">{item.hits}</td>
                                            <td className="main-td">{item.liked}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="popular-view">
                        <div>
                            <h4>현재 좋아요가 가장 많은 게시물이에요👍</h4>
                        </div>
                        <div className="main-table-view">
                            <table className="main-table">
                                <thead className="main-thead">
                                    <tr className="main-tr">
                                        <th className="main-th">카테고리</th>
                                        <th className="main-th">제목</th>
                                        <th className="main-th">작성자</th>
                                        <th className="main-th">작성일</th>
                                        <th className="main-th">조회수</th>
                                        <th className="main-th">좋아요</th>
                                    </tr>
                                </thead>
                                <tbody className="main-tbody">
                                    {popular_liked.map((item, index) => (
                                        <tr className="main-tr" key={index}>
                                            <td className="main-td">{item.category} 게시판</td>
                                            <td
                                                className="main-td"
                                                onClick={() =>
                                                    navigate('viewBoard', {
                                                        state: { no: item.no, category_no: item.category_no },
                                                    })
                                                }
                                            >
                                                {item.title}
                                            </td>
                                            <td className="main-td">{item.writer}</td>
                                            <td className="main-td">{time(item.regDate)}</td>
                                            <td className="main-td">{item.hits}</td>
                                            <td className="main-td">{item.liked}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
