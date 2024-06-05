import { Box, Button, Typography, TextField, IconButton, Backdrop, CircularProgress, Snackbar, InputLabel } from "@mui/material"
import { useForm } from "react-hook-form"
import CloseIcon from '@mui/icons-material/Close';
import { SendEmail } from "../types/dto"
import { useSendEmailForgotPasswordMutation } from "../services/authApi"
import { useEffect, useState } from "react"
type sendEmail = {
  email: string
}

const ForgotPassword = () => {
  const [err, setErr] = useState<any>(null)
  const [sendEmail, { data, isLoading, isSuccess }] = useSendEmailForgotPasswordMutation()
  const [open, setOpen] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SendEmail>()
  const onSubmit = async (dataForm: sendEmail) => {
    try {
      await sendEmail({ email: dataForm.email }).unwrap()
    } catch (error) {
      setErr(error)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(true)
    }
  }, [isSuccess])

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        color="white"
        action={(
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}
        message="We already send email to your account, Please check and follow it"
      />
      <Box display={"flex"} height={"100vh"} justifyContent={"center"}>
        <Box display={"flex"} paddingBlock={"100px"} width={"40%"} paddingInline={"10px"} flexDirection={"column"} borderRadius={"20px"}>
          <Box textAlign={"center"} mb={5} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} padding={"10px"}>
            <Typography fontSize={"30px"} fontWeight={"bold"} >Please enter your email to confirm your reset password</Typography>
            <Typography fontSize={"15px"} fontFamily={"serif"} fontWeight={500}>We will send message in your email</Typography>
          </Box>
          {err?.data && (<Typography color={"red"} fontSize={"15px"} textAlign={"center"} fontWeight={"bold"}>{err.data.message}</Typography>)}
          {isSuccess && <Typography fontSize={"15px"} textAlign={"center"} fontWeight={"bold"}>{data?.message}, this token will be expired in 5 minutes</Typography>}
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Box py={1} display={"flex"} flexDirection={"column"}>
              <InputLabel sx={{ fontWeight: "bold" }} size="normal">Email</InputLabel>
              <TextField {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please fill your correct email" }, required: { value: true, message: "Please fill email field" }, minLength: { value: 5, message: "Email too short" } })} id="standard-basic" type="email" />
              {errors.email && (<Typography color="red">{errors.email.message}</Typography>)}
            </Box>
            <Box display={"flex"} justifyContent={"center"} gap={1} flexDirection={"column"}>
              <Button variant="contained" type="submit" fullWidth >Send</Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default ForgotPassword