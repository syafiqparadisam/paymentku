import { ArrowBack } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import serverError from "../assets/servererror.jpg"

const Maintenance = () => {
    const navigate = useNavigate()

    return (
        <Box height={"100vh"} display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <img src={serverError} width={"500px"} />
            <Box display={"flex"} sx={{ marginTop: "-40px" }} justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
                <Box width={"80%"} mb={2}>
                    <Typography fontWeight={"bold"} fontSize={"30px"} textAlign={"center"}>Sorry something went wrong in our server, we will be recover as soon as possible</Typography>
                </Box>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate(-2)}>
                    <ArrowBack style={{ marginRight: "5px" }} />
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default Maintenance;