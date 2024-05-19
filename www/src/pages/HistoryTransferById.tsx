import { Box, Skeleton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import User from './User'
import { useDeleteHistoryTransferByIdMutation, useGetHistoryTransferByIdQuery } from '../services/historyApi'
import timeStampToLocaleString from '../utils/timeStampToClient'
import TimeAgoComponent from '../component/TimeAgoComponent'
import { ArrowBack, Delete } from '@mui/icons-material'
import toRupiah from '@develoka/angka-rupiah-js';
import { useState } from 'react'



const HistoryTransferById = () => {
    const { id } = useParams()
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate()
    const [err, setErr] = useState<any>()
    const idNum = id?.match(/^[0-9]+$/)
    console.log(idNum)
    if (idNum == null) {
        navigate("/notfound")
    }
    const { data, isSuccess } = useGetHistoryTransferByIdQuery(id)
    const [deleteHistory, { data: dataDeleteHistory }] = useDeleteHistoryTransferByIdMutation()
    console.log(data)

    if (err?.data?.statusCode == 500) {
        navigate("/maintenance")
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                    Delete history
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                        Are you sure you want to delete this history transfer ??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="contained" color="error">No</Button>
                    <Button variant="contained" color="success" onClick={async () => {
                        try {
                            await deleteHistory(id).unwrap()
                            setOpen(false)
                            navigate(-1)
                        } catch (error) {
                            setErr(error)
                        }
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <User>
                <Box m={3} width={"100%"}>
                    <Box display={"flex"} alignItems={"center"} mb={3} sx={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
                        <ArrowBack sx={{ marginRight: "5px" }} />
                        Back
                    </Box>
                    <Box display={"flex"} width={"100%"} justifyContent={"center"}>
                        {dataDeleteHistory && <Typography fontWeight={"bold"} fontSize={"20px"}>{dataDeleteHistory?.data?.message}</Typography>}
                    </Box>
                    {
                        isSuccess ? (

                            <Box p={4} display={"flex"} bgcolor={data?.data?.status === "SUCCESS" && data.data.status != null ? "lightgreen" : "red"} flexDirection={"column"} borderRadius={"20px"} width={"100%"} position={"relative"}>
                                <Box position={"absolute"} sx={{ cursor: "pointer" }} textAlign={"center"} top={"10px"} right={"10px"} p={1} onClick={() => {
                                    setOpen(true)
                                }
                                }>
                                    <Delete fontSize="medium" color={data?.data?.status == "SUCCESS" ? "inherit" : "error"} />
                                </Box>
                                <Box display={"flex"}>
                                    <Typography fontSize={"20px"} fontWeight={"bold"} color={data?.data?.status === "SUCCESS" && data.data.status != null ? "green" : "white"}>{data?.data?.status}</Typography>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} mt={3} color={data?.data?.status === "SUCCESS" && data.data.status != null ? "black" : "white"}>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"To user : " + data?.data?.receiver}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"To name : " + data?.data?.receiverName}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"From : " + data?.data?.sender}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Amount : " + toRupiah(data?.data?.amount == null ? 0 : data.data.amount, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Current Balance : " + toRupiah(data?.data?.balance == null ? 0 : data.data.balance, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>{"Previous Balance : " + toRupiah(data?.data?.previousBalance == null ? 0 : data.data.previousBalance, { dot: ",", floatingPoint: 0 })}</Typography>
                                    <Typography fontSize={"15x"} fontWeight={"bold"}>Notes : {data.data.notes == "" ? "Nothing" : data.data.notes}</Typography>
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

export default HistoryTransferById