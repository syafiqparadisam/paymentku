import { Typography, Box, Container, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import notfoundImg from "../assets/notfound.jpg"
import { ArrowBack } from '@mui/icons-material'
import { route } from '../constant/route'

const NotFound = () => {
    const [time, setTime] = useState<number>(6)
    const navigate = useNavigate()
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setTime((prev) => {
                return prev -= 1
            })
        }, 1000);

        if (time <= 0) {
            clearTimeout(timeOut)
            navigate("/")
        }
    }, [time])

    return (
        <Container>
            <Box display={"flex"} height={"100vh"} flexDirection={"column"} alignItems={"center"}>
                <img src={notfoundImg} width="500px" style={{marginTop: "20px"}}/>
                <Typography fontWeight={"bold"} fontSize={"50px"}>Not Found</Typography>
                <Typography fontWeight={"bold"} fontSize={"20px"}>Automatically back to home in {time}s</Typography>
                <Button variant="contained" color="primary" size="large" sx={{marginTop: "10px"}} onClick={() => navigate(route["home"])}>
                    <ArrowBack style={{ marginRight: "5px" }} />
                    Back
                </Button>
            </Box>
        </Container>
    )
}

export default NotFound