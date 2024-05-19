import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const TimeAgoComponent: React.FC<{ timestamp: string, color?: string }> = ({ timestamp, color }) => {
    const [timeAgo, setTimeAgo] = useState('');

    function calculateTime(timestamp: string) {
        const currentTime = Date.now()
        const previousTime = new Date(timestamp).getTime()
        const difference = Math.floor((currentTime - previousTime) / (1000 * 60)); // Menghitung selisih waktu dalam menit
        if (difference === 0) {
            setTimeAgo('Baru saja');
        } else if (difference < 60) {
            setTimeAgo(`${difference} menit yang lalu`);
        } else if (difference < 1440) {
            const hours = Math.floor(difference / 60);
            setTimeAgo(`${hours} jam yang lalu`);
        } else {
            const days = Math.floor(difference / 1440);
            setTimeAgo(`${days} hari yang lalu`);
        }
    }

    useEffect(() => {
        let i: number = 0;
        calculateTime(timestamp)
        i++
        if (i >= 2) {
            const intervalId = setInterval(() => {
                calculateTime(timestamp)
            }, 60000); // Setiap menit, update waktu
            return () => clearInterval(intervalId);
        }
    }, [timestamp]);

    return <Typography color={color ? color : "black"}>{timeAgo}</Typography>;
};

export default TimeAgoComponent;
