import {
    Box,
    Typography,
    TextField,
    InputLabel,
    Button,
    Backdrop,
    CircularProgress
} from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from "react-router-dom";
import { SignInInput } from "../types/dto";
import { useForm, SubmitHandler } from "react-hook-form"
import { useSignInMutation } from "../services/authApi";
import { useState } from "react";

const SignIn = () => {
    const [err, setErr] = useState<any>("")
    const [signIn, { isSuccess, isLoading }] = useSignInMutation()
    const { register, handleSubmit, formState: { errors } } = useForm<SignInInput>()
    const onSubmit: SubmitHandler<SignInInput> = async (data) => {
        console.log(data)
        try {
            const data2 = await signIn(data).unwrap()
            console.log(data2)
        } catch (err) {
            setErr(err)
            console.log(err)
        }
    }
    const navigate = useNavigate()

    if (err?.status == 500 || err?.data?.statusCode == 500) {
        navigate("/maintenance")
    }
    if (isSuccess) navigate("/dashboard")


    return (
        <>
            <Backdrop open={isSuccess}>
                <CircularProgress />
            </Backdrop>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
                <Box display={"flex"} paddingBlock={"30px"} paddingInline={"60px"} flexDirection={"column"} width={"40%"} borderRadius={"20px"}>
                    <Box textAlign={"center"} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} padding={"10px"}>
                        <Typography fontSize={"30px"} fontWeight={"bold"}>Signin</Typography>
                        {err?.data?.message && err?.status != 500 && (<Typography fontSize={"15px"} color={"red"} fontWeight={500}>{err.data.message}</Typography>)}
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                        <Box py={2} display={"flex"} width={"100%"} justifyContent={"space-between"} flexDirection={"column"}>
                            <InputLabel>Username :</InputLabel>
                            <TextField fullWidth {...register("user", { required: { value: true, message: "Please fill username field" }, maxLength: { value: 100, message: "Username too long" } })} id="standard-basic" />
                            {errors.user && (<Typography color="red">{errors.user.message}</Typography>)}
                        </Box>
                        <Box display={"flex"} width={"100%"} flexWrap={"wrap"} flexDirection={"column"}>
                            <InputLabel>Password :</InputLabel>
                            <TextField type="password" fullWidth {...register("password", { required: { value: true, message: "Please fill password field" }, maxLength: { value: 100, message: "Password too long" }, minLength: { value: 8, message: "Password must be greater than 8 characters" } })} id="standard-basic" />
                            {errors.password && (<Typography color={"red"}>{errors.password.message}</Typography>)}
                        </Box>
                        <Box pt={2} pb={1} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
                            <Link style={{ fontSize: "13px", textDecoration: "none" }} to={"/signup"}>Didn't have an account ? Please signup</Link>
                            <Link style={{ fontSize: "13px", textDecoration: "none" }} to={"/forgotPassword"}>Forgot password ?</Link>
                        </Box>
                        <Box display={"flex"} justifyContent={"center"} gap={1} flexDirection={"column"}>
                            <Button variant="contained" type="submit" fullWidth disabled={isLoading}>Sign in</Button>
                            <Button variant="outlined" startIcon={<GoogleIcon color="error" sx={{ fontWeight: "bold", marginBottom: "2px", fontSize: "30px" }} />} fullWidth sx={{ border: "1px solid gray", fontWeight: "bold", fontSize: "14px", color: "black" }} onClick={() => window.location.replace(import.meta.env.VITE_API_URL + "/auth/login/google")}>
                                Sign in With Google
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    )
}

export default SignIn