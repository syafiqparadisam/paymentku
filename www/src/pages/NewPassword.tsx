import { useEffect, useState } from 'react'
import { Box, TextField, Typography, Button, InputLabel } from '@mui/material'
import { useForm, SubmitHandler } from "react-hook-form"
import * as dto from '../types/dto'
import { usePasswordResetMutation } from '../services/authApi'
import { Link, useNavigate } from 'react-router-dom'
import { route } from '../constant/route'


const NewPassword = () => {

    const [error, setError] = useState<any | string>("")
    const [passwordReset, { data, isSuccess }] = usePasswordResetMutation()
    const [token, setToken] = useState<string>("")
    const { register, handleSubmit, watch, formState: { errors } } = useForm<dto.ForgotPassword>()
    const navigate = useNavigate()
    const onSubmit: SubmitHandler<dto.ForgotPassword> = async (data) => {
        try {
            await passwordReset({ token, password: data.password, confirmPassword: data.confirmPassword }).unwrap()
            console.log(data)
            if (isSuccess) {
                navigate(route["signin"])
            }
        } catch (error) {
            setError(error)
        }
    }
    const password = watch("password")
    console.log(data, error)
    useEffect(() => {
        const queryString = window.location.search;

        const urlParams = new URLSearchParams(queryString);

        const token = urlParams.get('token');

        if (token) {
            setToken(token)
            console.log('Token:', token);
        } else {
            navigate("/signin")
        }
    }, []);


    return (
        <>
            <Box display={"flex"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
                <Box display={"flex"} flexDirection={"column"} width={"35%"} borderRadius={"20px"}>
                    <Box textAlign={"center"} mb={5} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} padding={"10px"}>
                        <Typography fontSize={"30px"} fontWeight={"bold"}>New password</Typography>
                    </Box>
                    {error && <Typography textAlign={"center"} color={"red"} fontWeight={"bold"}>{error.data.message}</Typography>}
                    {isSuccess && <Typography textAlign={"center"} color={"green"} fontWeight={"bold"}>{data?.message}</Typography>}
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                        <Box py={2} display={"flex"} width={"100%"} flexDirection={"column"} >
                            <InputLabel sx={{ fontWeight: "bold" }}>Password :</InputLabel>
                            <TextField type="password" fullWidth {...register("password", { required: { value: true, message: "Please enter password field" }, minLength: { value: 8, message: "Password must be 8 characters or greater" }, maxLength: { value: 100, message: "Username too long" } })} id="standard-basic" />
                            {errors.password && (<Typography color="red">{errors.password.message}</Typography>)}
                        </Box>
                        <Box pt={2} pb={1} display={"flex"} flexWrap={"wrap"} flexDirection={"column"}>
                            <InputLabel sx={{ fontWeight: "bold" }}>Confirm password :</InputLabel>
                            <TextField type="password" {...register("confirmPassword", { required: { value: true, message: "Please enter confirm password field" }, validate: value => value === password || "Please match the value with password field" })} id="standard-basic" />
                            {errors.confirmPassword && (<Typography color={"red"}>{errors.confirmPassword.message}</Typography>)}
                        </Box>
                        <Box pb={1} display={"flex"} justifyContent={"flex-start"} flexDirection={"column"}>
                            <Typography fontSize={"15px"}>If your token is invalid, you can get token by send email again</Typography>
                            <Link to={route["forgotPassword"]} style={{ fontSize: "15px", textDecoration: "none" }}>Send token again ?</Link>

                            <Link to={route["signin"]} style={{ fontSize: "15px", textDecoration: "none" }}>Already update password? Please Login</Link>

                        </Box>
                        <Box display={"flex"} justifyContent={"center"} gap={1} flexDirection={"column"}>
                            <Button type="submit" fullWidth variant="contained">Send</Button>
                        </Box>
                    </form>
                </Box >
            </Box >
        </>
    )
}

export default NewPassword