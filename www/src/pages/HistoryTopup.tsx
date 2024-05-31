import { Box, Button, Typography, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { useDeleteHistoryTopUpMutation, useGetHistoryTopUpQuery } from '../services/historyApi'
import User from './User'
import { ArrowBack, Delete, Loop } from '@mui/icons-material'
import { HistoryTopUps } from '../types/response'
import timeStampToLocaleString from '../utils/timeStampToClient';
import { useNavigate } from 'react-router-dom'
import useAlert from '../hooks/useAlert'
import TimeAgoComponent from '../component/TimeAgoComponent'
import { route } from '../constant/route'
import SkeletonList from '../component/SkeletonList'
import Category from '../component/Category';


const HistoryTopup = () => {
    const { open, handleClose, handleOpen } = useAlert()
    const { data, refetch, isSuccess } = useGetHistoryTopUpQuery()
    const [deleteTopUp, { error: errDeleteAllHistory }] = useDeleteHistoryTopUpMutation()
    const navigate = useNavigate()

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                        Do you really want to delete all history ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color="error" onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        deleteTopUp()
                        handleClose()
                    }} variant="contained" color="success" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <User>
                <Box display={"flex"} flexDirection={"column"} width={"100%"} alignItems={"center"}>
                    <Box display={"flex"} gap={1} width={"100%"} alignItems={"center"} mt={2} onClick={() => navigate(-1)}>
                        <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={"bold"} fontSize={"30px"}>History Topup</Typography>
                    </Box>
                    <Box width={"90%"} display={"flex"} justifyContent={"space-between"}>
                        <Category firstItem={"Topup"} menuItem={[{ categories: "Topup", redirect: "/dashboard/user/history/topup" }, { categories: "Transfer", redirect: "/dashboard/user/history/transfer" }]} />
                        {errDeleteAllHistory && <Typography fontWeight={"bold"} color={"red"} fontSize={"20px"}>{errDeleteAllHistory?.data?.message}</Typography>}
                        <Box display={"flex"} gap={2} width={"30%"}>
                            <Button color="success" variant="contained" startIcon={<Loop />} onClick={refetch}>Reload</Button>
                            <Button color="error" variant="contained" startIcon={<Delete />} onClick={() => {
                                handleOpen()
                            }}>Delete All</Button>
                        </Box>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} width={"90%"} maxHeight={"1000px"} overflow={"scroll"} my={3} gap={1}>


                        {isSuccess ? (
                            data?.data?.length == 0 ? (
                                <Box display={"flex"} width={"100%"} height={"50vh"} justifyContent={"center"} alignItems={"center"}>
                                    <Box width={"50%"} textAlign={"center"}>
                                        <Typography fontWeight={"bold"} fontSize={"15px"}>You don't have history yet, Please consider to make topup, if you already make topup you can click reload button</Typography>
                                    </Box>
                                </Box>

                            ) : (
                                data?.data?.map((d: HistoryTopUps) => {
                                    return (
                                        <Box width={"100%"} onClick={() => navigate(`${route["topuphistory"]}/${d.id}`)} justifyContent={"space-around"} borderRadius={"10px"} alignItems={"center"} display={"flex"} bgcolor={d.isRead == true ? "#ddd" : d.status === "SUCCESS" ? "lightgreen" : "red"} p={3}>

                                            <Box width={"50%"} display={"flex"} flexDirection={"column"}>
                                                <Typography color={d.status === "SUCCESS" ? "green" : "white"} fontWeight={"bold"}>{d.status}</Typography>
                                                <Typography color={"black"}>Amount: Rp.{d.amount}</Typography>
                                            </Box>
                                            <Box width={"50%"}>
                                                <Typography color={"black"}>Created at: {timeStampToLocaleString(d.createdAt)}</Typography>
                                                <TimeAgoComponent timestamp={d.createdAt} />
                                            </Box>
                                        </Box>
                                    )
                                })
                            )
                        ) : (
                            <Box display={"flex"} width={"100%"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} pb={5}>
                                <SkeletonList total={2} />
                            </Box>
                        )}
                    </Box>
                </Box>
            </User>

        </>
    )
}

export default HistoryTopup