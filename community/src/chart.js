import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import useFetchUser from './useFetchUser';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SERVER_ADDRESS } from './serverAddress/serverAddress';

const Chart = () => {
    const { user } = useFetchUser();
    const location = useLocation();
    const chart_data = location.state.chart_data;
    const [chart, setChart] = useState([]);

    const allChart = async () => {
        try {
            const response = await axios.get(`${SERVER_ADDRESS}/${chart_data}/${chart_data}`);
            const data = response.data;
            setChart(data);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        allChart();
    }, []);

    return (
        <div>
            <div>
                <Nav user={user} />
            </div>
            <div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>순위</th>
                                <th>곡정보</th>
                                <th>아티스트</th>
                                <th>앨범</th>
                                <th>좋아요</th>
                                <th>즐겨찾기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chart.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.ranking}</td>
                                    <td>
                                        <img src={item.album_images} />
                                        <p>{item.title}</p>
                                    </td>
                                    <td>{item.artist}</td>
                                    <td>{item.album}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Chart;
