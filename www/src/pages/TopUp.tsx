import { Box, Button, Checkbox, InputLabel, TextField, Typography, Dialog, DialogContentText, DialogContent, DialogTitle, DialogActions, Backdrop, Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { User } from "../types/response"
import { useTopupMutation } from "../services/transactionApi"
import { ArrowBack, BoltRounded, CloseOutlined, Done } from "@mui/icons-material"
import toRupiah from "@develoka/angka-rupiah-js"
import FastTransferBox from "../component/FastTransferBox"
import { useNavigate } from "react-router-dom"

const TopUp = () => {
    const [amount, setAmount] = useState<number>(0)
    const [err, setErr] = useState<any>("")
    const user: User = useSelector(state => state.user)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [topup, { data, isSuccess, error, isLoading }] = useTopupMutation()
    const [operational, setOperational] = useState<boolean>(true)
    const [bonus, setBonus] = useState<number>(0)
    const [totalGettingMoney, setTotalGettingMoney] = useState<number>(0)
    const [open, setOpen] = useState<boolean>(false)
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const navigate = useNavigate()

    function calculatePrice(amount: number, checked: boolean, operationalFee: boolean, bonus: number): number {
        const operational = operationalFee ? 2 / 100 : 0
        const protection = checked ? 500 : 0
        return (amount * operational) + protection + amount + bonus
    }
    function calculateGettingMoney(amount: number, bonus: number): number {
        return amount + bonus
    }

    console.log("error", error)

    useEffect(() => {
        const total = calculatePrice(amount, isChecked, operational, bonus)
        setTotalPrice(total)
        setTotalGettingMoney(calculateGettingMoney(amount, bonus))
    }, [amount, isChecked, bonus, operational])
    useEffect(() => {
        if (isSuccess) {
            setOpenSnackbar(true)
        }
        if (error?.originalStatus == 500) {
            setOpenSnackbar(true)
        }
    }, [isSuccess, error])
    console.log(data)

    return (
        <>
            {openSnackbar && <Snackbar
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                autoHideDuration={3000}
                color="success"
                message={error?.originalStatus == 500 ? "Ups something went wrong" : data.message}
            />}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={() => setOpen(false)}
            ></Backdrop>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                    Confirm payment
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                        Do you really wanna topup {toRupiah(totalGettingMoney, { dot: ",", floatingPoint: 0 })} You will pay {toRupiah(totalPrice, { dot: ",", floatingPoint: 0 })} ??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="contained" color="error">No</Button>
                    <Button variant="contained" disabled={isLoading == false ? false : true} color="success" onClick={async () => {
                        try {
                            await topup({ amount: totalGettingMoney }).unwrap()
                            setOpen(false)

                        } catch (error: any) {

                            setErr(error.data.message)
                        }
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Box display={"flex"} width={"100%"} py={2} flexDirection={"column"}>
                <Box display={"flex"} gap={1} alignItems={"center"} onClick={() => navigate(-1)}>
                    <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                </Box>
                <Box width={"100%"} textAlign={"center"}>
                    <Typography fontWeight={"bold"} fontSize={"30px"}>Topup payment</Typography>
                </Box>
                <Box display={"flex"} width={"100%"}>

                    <Box width={"50%"} display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} alignItems={"flex-start"} py={4} px={8}>
                        <Box width={"100%"} justifyContent={"center"} flexDirection={"column"}>
                            <Box display={"flex"} flexDirection={"column"}>

                                <InputLabel sx={{ fontWeight: "bold", fontSize: "15px" }}>Amount</InputLabel>
                                <TextField type="number" fullWidth value={amount == 0 ? "" : amount} onChange={(e) => {
                                    const num = parseInt(e.target.value)
                                    if (num <= 49) {
                                        setAmount(num)
                                        return
                                    }
                                    if (num > 100000000) {
                                        setErr("Amount exceeded")
                                        return
                                    }
                                    setErr("")
                                    if (e.target.value === "") {
                                        setAmount(0)
                                        setBonus(0)
                                        return
                                    }
                                    setAmount(num)
                                    if (num >= 100000000) {
                                        setBonus(200000)
                                        setOperational(false)

                                    } else if (num >= 10000000) {
                                        setBonus(50000)
                                        setOperational(false)
                                    } else if (num >= 1000000) {
                                        setBonus(10000)
                                        setOperational(false)
                                    } else if (num >= 500000) {
                                        setBonus(0)
                                        setOperational(false)
                                    } else {
                                        setBonus(0)
                                        setOperational(true)
                                    }
                                }
                                } />
                                {err && <Typography color={"red"}>{err}</Typography>}
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} flexWrap={"wrap"}>
                                <Box display={"flex"} alignItems={"center"}>
                                    <Typography fontWeight={"bold"} fontSize={"20px"} py={3}>Fast topup</Typography>
                                    <BoltRounded color="warning" />
                                </Box>
                                <Box flexWrap={"wrap"} display={"flex"} justifyContent={"center"} alignItems={"center"}>

                                    <Box display={"flex"} gap={4} justifyContent={"center"} width={"100%"} flexWrap={"wrap"}>
                                        <FastTransferBox amount={500000} requirement={[{ icon: <Done />, name: "Free operational price" }, { icon: <CloseOutlined />, name: "No bonus" }]} onClick={() => {
                                            setAmount(500000)
                                            setBonus(0)
                                            setOperational(false)
                                        }} />
                                        <FastTransferBox amount={1000000} requirement={[{ icon: <Done />, name: "Free operational price" }, { icon: <Done />, name: "Bonus " + toRupiah(10000, { dot: ",", floatingPoint: 0 }) }]} onClick={() => {
                                            setAmount(1000000)
                                            setBonus(10000)
                                            setOperational(false)
                                        }} />
                                        <FastTransferBox amount={10000000} requirement={[{ icon: <Done />, name: "Free operational price" }, { icon: <Done />, name: "Bonus " + toRupiah(50000, { dot: ",", floatingPoint: 0 }) }]} onClick={() => {
                                            setAmount(10000000)
                                            setBonus(50000)
                                            setOperational(false)
                                        }} />
                                        <FastTransferBox amount={100000000} requirement={[{ icon: <Done />, name: "Free operational price" }, { icon: <Done />, name: "Bonus " + toRupiah(200000, { dot: ",", floatingPoint: 0 }) }]} onClick={() => {
                                            setAmount(100000000)
                                            setBonus(200000)
                                            setOperational(false)
                                        }} />
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box width={"50%"} display={"flex"} flexDirection={"column"} py={4} px={8}>
                        <Box border={"1px solid black"} width={"100%"} display={"flex"} flexDirection={"column"} p={2} justifyContent={"center"} alignItems={"flex-start"} borderRadius={"10px"}>
                            <Typography fontWeight={"bold"} fontSize={"18px"}>Information :</Typography>
                            <Box width={"100%"}>
                                <Typography>Amount : {toRupiah(amount, { dot: ",", floatingPoint: 0 })}</Typography>
                                <Typography>Balance : {toRupiah(user.balance, { dot: ",", floatingPoint: 0 })}</Typography>
                                <Typography>Operational 2%: {toRupiah(operational ? amount * 2 / 100 : 0, { dot: ",", floatingPoint: 0 })}</Typography>
                                <Typography>Bonus : {toRupiah(bonus, { dot: ",", floatingPoint: 0 })}</Typography>
                                <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                                        <Typography>Protection costs : {toRupiah(500, { dot: ",", floatingPoint: 0 })}</Typography>
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={(event) => { setIsChecked(event.target.checked) }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </Box>
                                    <Typography ml={2} mt={"-10px"} fontSize={"12px"} color={"lightblue"}>Helps secure more transaction processes</Typography>
                                </Box>
                            </Box>
                            <Typography>Total obtained : {toRupiah(totalGettingMoney, { dot: ",", floatingPoint: 0 })}</Typography>
                            <Typography mb={1}>Total payment : {toRupiah(totalPrice - bonus, { dot: ",", floatingPoint: 0 })}</Typography>
                            <Button variant="contained" fullWidth color="success" disabled={amount == 0 ? true : false} onClick={() => {
                                if (totalPrice <= 0) return
                                setOpen(true)
                            }}>Topup</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default TopUp