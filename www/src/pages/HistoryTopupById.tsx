import { Box, Skeleton, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import User from './User'
import { useDeleteHistoryTopUpByIdMutation, useGetHistoryTopUpByIdQuery } from '../services/historyApi'
import timeStampToLocaleString from '../utils/timeStampToClient'
import TimeAgoComponent from '../component/TimeAgoComponent'
import { ArrowBack, Delete } from '@mui/icons-material'
import toRupiah from '@develoka/angka-rupiah-js';

const HistoryTopupById = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const idNum = id?.match(/^[0-9]+$/)
    if (idNum == null) {
        navigate("/notfound")
    }

    const { data: data, isSuccess, error } = useGetHistoryTopUpByIdQuery(parseInt(id))
    const [deleteHistory] = useDeleteHistoryTopUpByIdMutation()
    if (error?.data?.statusCode === 404) {
        navigate("/notfound")
    }
    

    return (
        <>
            <User>
                <Box m={3} width={"100%"}>
                    <Box display={"flex"} alignItems={"center"} mb={3} sx={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
                        <ArrowBack sx={{ marginRight: "5px" }} />
                        Back
                    </Box>
                    {
                        isSuccess ? (

                            <Box p={4} display={"flex"} bgcolor={data?.data?.status === "SUCCESS" && data.data.status != null ? "lightgreen" : "red"} flexDirection={"column"} borderRadius={"20px"} width={"100%"} position={"relative"}>
                                <Box position={"absolute"} sx={{ cursor: "pointer" }} textAlign={"center"} top={"10px"} right={"10px"} p={1} onClick={() => {
                                    deleteHistory(id)
                                    navigate(-1)
                                }
                                }>
                                    <Delete fontSize="medium" sx={{color: data?.data?.status == "SUCCESS" ? "black" : "white"}}/>
                                </Box>
                                <Box display={"flex"}>
                                    <Typography fontSize={"20px"} fontWeight={"bold"} color={data?.data?.status === "SUCCESS" && data.data.status != null ? "green" : "white"}>{data?.data?.status}</Typography>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} mt={3} color={data?.data?.status === "SUCCESS" && data.data.status != null ? "black" : "white"}>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Amount : " + toRupiah(data?.data?.amount == null ? 0 : data.data.amount, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Current Balance : " + toRupiah(data?.data?.balance == null ? 0 : data.data.balance, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Previous Balance : " + toRupiah(data?.data?.previousBalance == null ? 0 : data.data.previousBalance, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Created at : " + timeStampToLocaleString(data?.data?.createdAt)}</Typography>
                                    <TimeAgoComponent timestamp={data?.data?.createdAt} color={data?.data?.status === "SUCCESS" && data.data.status != null ? "black" : "white"} />
                                </Box>
                            </Box>
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                animation={"wave"}
                                style={{ borderRadius: "20px" }}
                                width={"100%"}
                                height={"30%"}
                            />
                        )
                    }
                </Box>
            </User>
        </>
    )
}

export default HistoryTopupById