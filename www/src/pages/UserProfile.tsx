import { ArrowBack } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit'
import { TextareaAutosize } from "@mui/base"
import { useState, useEffect, MouseEvent } from 'react'
import { Box, Button, Input, Dialog, DialogTitle, Typography, Badge, Avatar, TextField, InputLabel, DialogActions, DialogContent } from '@mui/material'
import { useUpdateNameMutation, useUpdateBioMutation, useUpdatePhoneMutation } from '../services/profileApi'
import { useDeleteAccountMutation, useLogoutMutation, useUpdateUsernameMutation } from '../services/authApi'
import timeStampToLocaleString from '../utils/timeStampToClient';
import { useValidation } from '../hooks/useValidation';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toRupiah from '@develoka/angka-rupiah-js';
import UploadFileDialog from '../component/UploadFileDialog';
import useAlert from '../hooks/useAlert';
import Alert from '../component/Alert';

const UserProfile = () => {
    const [updateName, { isSuccess: successUpdateName }] = useUpdateNameMutation()
    const [updateBio, { isSuccess: successUpdateBio }] = useUpdateBioMutation()
    const [updatePhone, { isSuccess: successUpdatePhone }] = useUpdatePhoneMutation()
    const [updateUser, { isSuccess: successUpdateUser }] = useUpdateUsernameMutation()
    const [logout] = useLogoutMutation()
    const [deleteAccount, { isSuccess: successDeleteAccount }] = useDeleteAccountMutation()
    const [err, setErr] = useState<any>(null)
    const { open: openAlert, handleOpen, handleClose } = useAlert()
    const [openUploadFile, setOpenUploadFile] = useState<boolean>(false)
    const { handleUpdateUsername, setValueForUsername, validateInput, cleanUp, label, open, value, valueForUsername, updateVal, totalInput, openModal, validatePhoneNumber, valueForPassword, setValueForPassword } = useValidation()
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        cleanUp()
        setErr("")
    }, [successUpdateUser, successUpdateName, successUpdateBio, successUpdatePhone, successDeleteAccount,cleanUp])

    if (successDeleteAccount) {
        navigate("/signup")
    }

    async function handleSubmit() {
        try {
            switch (label) {
                case "username":
                    const { success: successUsername, error: errUsername, trimmedval } = validateInput(valueForUsername)
                    if (!successUsername) {
                        throw { data: { message: errUsername } }
                    }
                    console.log(trimmedval, valueForPassword)
                    await updateUser({ username: trimmedval, password: valueForPassword }).unwrap()
                    console.log("apakah berhasil ?")
                    break;
                case "name":
                    const { success: successName, error: errName, trimmedval: nameVal } = validateInput(value)

                    if (!successName) {
                        throw { data: { message: errName } }
                    }
                    await updateName({ name: nameVal }).unwrap()
                    break;
                case "Bio":
                    await updateBio({ bio: value }).unwrap()
                    break;
                case "Phone number":
                    const { success: successPhone, error: errPhone, trimmedval: phoneVal } = validatePhoneNumber(value)
                    if (!successPhone) {
                        throw { data: { message: errPhone } }
                    }
                    await updatePhone({ phoneNumber: phoneVal }).unwrap()
                    break;
                case "delete account":
                    await deleteAccount({ password: value }).unwrap()
                    break;
                default:
                    throw new Error("Something went wrong")
            }

        } catch (e) {
            console.log(e)
            setErr(e)
        }
    }


    return (
        <>
            <UploadFileDialog open={openUploadFile} setOpen={setOpenUploadFile} />

            <Alert open={openAlert} handleClose={handleClose} actions={() => {
                logout()
                navigate("/signin")
            }} title="Logout" desc="Are you sure you want to logout ?" />

            <Dialog
                open={open}

                onClose={() => {
                    setErr({ data: { message: "" } })
                    cleanUp()
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                    Update profile
                </DialogTitle>
                <DialogContent>
                    <Box display={"flex"} width={"100%"} justifyContent={"center"}>
                        {err && <Typography color={"red"} textAlign={"center"} fontWeight={"bold"} fontSize={"15px"}>{err?.data?.message}</Typography>}
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                        <Typography fontWeight={"bold"}>{label === "username" || label === "delete account" ? "If you're login with google, Please don't fill password field" : null}</Typography>
                        <InputLabel htmlFor={label === "delete account" ? "password" : label}>{label === "delete account" ? "password" : label} :</InputLabel >
                        {
                            label != "Bio" ? <TextField sx={{ fontWeight: "bold", fontSize: "15px" }} defaultValue={label === "username" ? valueForUsername : value} onChange={(e) => {
                                if (label === "username") {
                                    setValueForUsername(e.target.value)
                                } else {
                                    updateVal(e.target.value)
                                }
                            }} /> : (
                                <>
                                    <TextareaAutosize id={label} style={{ border: "1px solid black", fontFamily: "sans-serif" }} minRows={5} defaultValue={user.bio} onChange={(e) => {
                                        updateVal(e.target.value)
                                    }}>
                                    </TextareaAutosize>
                                </>
                            )
                        }
                    </Box>
                    {totalInput > 1 && (
                        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                            <InputLabel sx={{ fontWeight: "bold", fontSize: "15px" }} htmlFor='pass'>Password :</InputLabel>
                            <TextField id='pass' type="text" onChange={(e) => {
                                setValueForPassword(e.target.value)
                            }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color='error' type='submit' onClick={() => {
                        setErr({ data: { message: "" } })
                        cleanUp()
                    }}>Cancel</Button>
                    <Button variant="contained" type='submit' color='success' onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Box display={"flex"} width={"100%"} position={"relative"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} ml={2}>
                <Box display={"flex"} position={"absolute"} top={"20px"} gap={1} width={"100%"} alignItems={"center"} onClick={() => navigate(-1)}>
                    <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                </Box>
                <Box width={"100%"} display={"flex"} justifyContent={"space-around"} alignItems={"center"}>
                    <Box onClick={() => setOpenUploadFile(true)}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <EditIcon fontSize="large" sx={{ borderRadius: "50%", background: "black", color: "white", padding: "5px" }} />
                            }
                        >
                            <Avatar alt="Travis Howard" sx={{ width: "300px", height: "300px" }} src={user.photo_profile} />
                        </Badge>
                    </Box>

                    <Box display={"flex"} flexDirection={"column"} width={"30%"}>
                        <InputLabel>Username: </InputLabel>
                        <Input sx={{ marginBottom: "20px" }} fullWidth value={user.user} onClick={handleUpdateUsername} />
                        <InputLabel>Name: </InputLabel>
                        <Input value={user.name} onClick={(e: MouseEvent<HTMLDivElement, MouseEvent> | any) => {
                            openModal(e.target.value, "name")
                        }} />
                    </Box>

                </Box>
                <Box width={"100%"} display={"flex"} justifyContent={"center"} flexDirection={"column"} py={5} >
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} width={"30%"} pt={3}>
                        <Typography fontWeight={"bold"}>Your balance is {toRupiah(user.balance, { dot: ",", floatingPoint: 0 })}</Typography>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} width={"50%"} pt={3}>
                        <label>Account number :</label>
                        <TextField size='small' disabled value={user.accountNumber}></TextField>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} width={"50%"} pt={3}>
                        <label>Email :</label>
                        <TextField size='small' disabled value={user.email}></TextField>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} width={"50%"} pt={3}>
                        <label>Phone number :</label>
                        <TextField size='small' disabled={user.phoneNumber == null ? false : true} value={user.phoneNumber} placeholder={user.phoneNumber == null ? "You haven't yet set your phone number" : ""} onClick={(e: MouseEvent<HTMLDivElement, MouseEvent> | any) => {
                            openModal(e.target.value, "Phone number")
                        }}></TextField>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} width={"50%"} pt={3}>
                        <label>Bio :</label>
                        <TextareaAutosize style={{ border: "1px solid black", fontFamily: "sans-serif" }} onClick={(e: MouseEvent<HTMLDivElement, MouseEvent> | any) => {
                            openModal(e.target.value, "Bio")
                        }} minRows={5} value={user.bio ? user.bio : "You don't have a bio"}></TextareaAutosize>
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} width={"100%"} pt={3}>
                        <Typography fontWeight={"bold"}>This account was created at {timeStampToLocaleString(user.created_at)}</Typography>
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} mt={7} gap={2}>
                        <Button variant="contained" color="error" onClick={() => {
                            handleOpen()
                        }}>Logout</Button>
                        <Button variant="contained" color="error" onClick={(e: MouseEvent<HTMLButtonElement, MouseEvent> | any) => {
                            openModal(e.target.value + "", "delete account")
                        }}>Delete account</Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default UserProfile