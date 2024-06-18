import { UploadFile } from "@mui/icons-material"
import { Dialog, DialogTitle, DialogContent, Box, Typography, DialogActions, Button, styled, Backdrop, CircularProgress, Snackbar } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUpdatePhotoProfileMutation } from "../services/profileApi"
import { useSelector } from "react-redux"
import { User } from "../types/response"
import { RootState } from "../app/store"

type UploadFileProps = {
    open: boolean,
    setOpen: Function,
}

const UploadFileDialog: React.FC<UploadFileProps> = ({ open, setOpen }) => {
    const [sourceImg, setSourceImg] = useState<string | null | undefined | ArrayBuffer>("")
    const [file, setFile] = useState<File | undefined>(undefined)
    const [update, { data, isLoading, error }] = useUpdatePhotoProfileMutation()
    const user: User = useSelector((state: RootState) => state.user)
    const [response, setResponse] = useState("")
    const previewImage = (e: any) => {
        const fileImg: File[] = e.target.files
        const maxFileSize = 2 * 1024 * 1024
        const allowedFile = ["image/jpeg", "image/png", "image/bmp", "image/webp"];
        if (!allowedFile.includes(fileImg[0].type)) {
            setResponse(`File ${fileImg[0].type} is not allowed`)
            return
        }

        if (fileImg[0].size > maxFileSize) {
            setResponse("Image should be less than 2 mb size")
            return
        }

        if (fileImg && fileImg[0]) {
            setResponse("")
            const reader = new FileReader()
            reader.addEventListener("load", (eventFR: ProgressEvent<FileReader>) => {
                setResponse("")
                setSourceImg(() => eventFR.target?.result)
            })
            reader.readAsDataURL(fileImg[0])
            setFile(fileImg[0])
        }
    }


    const updatePhotoProfile = () => {
        update({ file, publicId: user.photo_public_id ? user.photo_public_id : "" })
    }

    useEffect(() => {
        setSourceImg("")
        setResponse("")
    }, [open])

    useEffect(() => {
        setSourceImg("")
        setFile(undefined)
        setResponse(data?.message ? data?.message : "")
    }, [data])

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 100,
    });


    return (
        <>
            {error && (error as any).message == "Aborted" && (
                <Snackbar
                    autoHideDuration={3000}
                    color="red"
                    open={true}
                    message="Sorry your request was cancelled"
                />
            )}
            <Dialog
                open={open}

                onClose={() => {
                    setOpen(() => false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <Backdrop open={isLoading}>
                    <CircularProgress />
                </Backdrop>
                <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                    Update Photo Profile
                </DialogTitle>
                <DialogContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                    {response && <Typography color={data?.statusCode == 200 ? "green" : "red"} fontWeight={"bold"} py={1}>{response}</Typography>}

                    <Box height={"300px"} width={"300px"} textAlign={"center"}>
                        {sourceImg ?
                            <Box border={"2px solid black"} sx={{ backgroundImage: `url(${sourceImg})`, backgroundSize: "cover", backgroundPosition: "center" }} width={"100%"} height={"100%"}></Box>
                            : <Button component="label" tabIndex={-1} sx={{ border: "2px dotted black", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#ddd", height: "100%" }}>
                                <Typography fontWeight={"bold"} fontSize={"20px"}>Upload File</Typography>
                                <UploadFile fontSize="large" />
                                <VisuallyHiddenInput id="fileInput" type="file" onChange={previewImage} />
                            </Button>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={() => setOpen(() => false)}>Cancel</Button>
                    <Button variant="contained" color="primary" disabled={file == null ? true : false} onClick={() => {
                        updatePhotoProfile()
                    }}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UploadFileDialog