import { useSelector } from "react-redux"
import User from "./User"
import { Box, Button, TextareaAutosize, Typography, Dialog, DialogContent, DialogTitle, DialogContentText } from "@mui/material"
import { useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"


const Help = () => {
    const [value, setValue] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [err, setErr] = useState<string>()
    const form = useRef()
    const navigate = useNavigate()

    const submittedForm = async (e) => {
        e.preventDefault()
        try {
            await emailjs.sendForm(import.meta.env.VITE_SERVICE_ID_EMAILJS, import.meta.env.VITE_TEMPLATE_ID_HELPING_EMAILJS, form.current, import.meta.env.VITE_PUBLIC_KEY_EMAILJS)
            setValue("")
        } catch (error) {
            setOpen(true)
            setErr(error)
            setValue("")
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"} color="error">
                    Error
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                        {err && <Typography >{err}</Typography>}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <User>
                <Box display={"flex"} width={"100%"} height={"100%"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} gap={2}>
                    <Box display={"flex"} mt={2} gap={1} width={"100%"} alignItems={"center"} onClick={() => navigate(-1)}>
                        <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                    </Box>
                    <Box display="flex" justifyContent={"center"} alignItems={"center"} width="95%">
                        <Box flexDirection={"column"} display={"flex"}>
                            <Typography fontSize={"50px"} fontWeight={"bold"}>Help center</Typography>
                        </Box>

                    </Box>
                    <Box width={"95%"} display={"flex"} flexDirection={"column"} >
                        <Typography fontWeight={"bold"} fontSize={"20px"}>Leave comment</Typography>
                        <Typography>If you find bugs or bad features please contact us, and i will be update if your advice is well</Typography>
                        <form ref={form} onSubmit={submittedForm} style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <TextareaAutosize name="message" value={value} minRows={5} onChange={(e) => setValue(e.target.value)} />
                            <Box mt={1} display={"flex"}>
                                <Button type="submit" variant="contained" color="primary">Send message</Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </User>
        </>
    )
}

export default Help