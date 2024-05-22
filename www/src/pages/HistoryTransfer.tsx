import { Box, Button, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from "@mui/material"
import User from "./User"
import { useDeleteHistoryTransferMutation, useGetHistoryTransferQuery } from "../services/historyApi"
import { Link, useNavigate } from "react-router-dom"
import { Loop, Delete, ArrowBack } from "@mui/icons-material"
import timeStampToLocaleString from "../utils/timeStampToClient"
import { HistoryTransfers } from "../types/response"
import SkeletonList from "../component/SkeletonList"
import TimeAgoComponent from "../component/TimeAgoComponent"
import { route } from "../constant/route"
import { useState } from "react"
import useAlert from "../hooks/useAlert"
import Category from "../component/Category"
import { Response } from '../types/response.ts';

const HistoryTransfer = () => {
    const { open, handleClose, handleOpen } = useAlert()
    const { data, isSuccess, refetch } = useGetHistoryTransferQuery()
    const [err, setErr] = useState<Response<null>>()
    const [deleteTransfer] = useDeleteHistoryTransferMutation()
    const navigate = useNavigate()
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                    Delete history
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                        Are you sure you want to delete all history transfer ??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">No</Button>
                    <Button variant="contained" color="success" onClick={async () => {
                        try {
                            await deleteTransfer().unwrap()
                            handleOpen()
                        } catch (error: any) {
                            setErr(error)
                        }
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <User>
                <Box display={"flex"} flexDirection={"column"} width={"100%"} alignItems={"center"}>
                    <Box display={"flex"} gap={1} width={"100%"} mt={1} alignItems={"center"} onClick={() => navigate(-1)}>
                        <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={"bold"} fontSize={"30px"}>History Transfer</Typography>
                    </Box>
                    <Box width={"90%"} display={"flex"} justifyContent={"space-between"}>
                        <Category firstItem={"Transfer"} menuItem={[{ categories: "Topup", redirect: "/dashboard/user/history/topup" }, { categories: "Transfer", redirect: "/dashboard/user/history/transfer" }]} />
                        {err && <Typography fontWeight={"bold"} color={"red"} fontSize={"20px"}>{err?.message}</Typography>}
                        <Box display={"flex"} gap={2} width={"30%"}>
                            <Button color="success" variant="contained" startIcon={<Loop />} onClick={refetch}>Reload</Button>
                            <Button color="error" variant="contained" startIcon={<Delete />} onClick={() => {
                                handleOpen()
                            }}>Delete All</Button>
                        </Box>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} width={"90%"} mt={3} overflow={"scroll"} maxHeight={"1000px"} gap={1}>
                        {isSuccess ? (
                            data?.data?.length === 0 ? (
                                <Box display={"flex"} width={"100%"} height={"50vh"} justifyContent={"center"} alignItems={"center"}>
                                    <Box width={"50%"} textAlign={"center"}>
                                        <Typography fontWeight={"bold"} fontSize={"15px"}>You don't have history yet, Please consider to make transfer, if you already make transfer you can click reload button</Typography>
                                    </Box>
                                </Box>

                            ) : data?.data?.map((d: HistoryTransfers) => {
                                return (
                                    <Link to={route["transferhistory"] + "/" + d.id} style={{ textDecoration: "none" }}>
                                        <Box width={"100%"} justifyContent={"space-around"} borderRadius={"10px"} alignItems={"center"} display={"flex"} bgcolor={d.isRead ? "#ddd" : "lightgreen"} p={3}>
                                            <Box width={"30%"} display={"flex"} flexDirection={"column"}>
                                                <Typography color={d.status as unknown === "SUCCESS" ? "green" : "red"} fontWeight={"bold"}>{d.status}</Typography>
                                                <Typography color={"black"}>Amount: Rp.{d.amount}</Typography>
                                            </Box>
                                            <Box width={"40%"} display={"flex"} flexDirection={"column"}>
                                                <Typography color={"black"}>From: {d.sender}</Typography>
                                                <Typography color={"black"}>To: {d.receiver}</Typography>
                                            </Box>
                                            <Box width={"30%"}>
                                                <Typography color={"black"}>Created at: {timeStampToLocaleString(d.createdAt)}</Typography>
                                                <TimeAgoComponent timestamp={d.createdAt} />
                                            </Box>
                                        </Box>
                                    </Link>
                                )
                            })
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

export default HistoryTransfer