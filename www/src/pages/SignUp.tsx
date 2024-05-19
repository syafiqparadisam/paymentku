import {
  Box,
  Typography,
  TextField,
  InputLabel,
  Button
} from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from "react-router-dom";
import { SignUpInput } from "../types/dto";
import { useSignInWithGoogleMutation, useSignUpMutation } from "../services/authApi";
import { route } from "../constant/route";


const SignUp = () => {
  const [signUp, { isSuccess }] = useSignUpMutation()
  const [signInGoogle] = useSignInWithGoogleMutation()
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInput>()
  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    signUp(data)
  }
  const navigate = useNavigate()
  if (isSuccess) navigate("/signin")

  return (
    <Box display={"flex"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
      <Box paddingBlock={"30px"} paddingInline={"60px"} flexDirection={"column"} width={"40%"} borderRadius={"20px"}>
        <Box textAlign={"center"} width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} padding={"10px"}>
          <Typography fontSize={"30px"} fontWeight={"bold"}>Signup</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box py={2} display={"flex"} width={"100%"} flexDirection={"column"} >
            <InputLabel>Username :</InputLabel>
            <TextField {...register("user", { required: { value: true, message: "Please fill username field" }, maxLength: { value: 100, message: "Username too long" } })} />
            {errors.user && (<Typography color="red">{errors.user.message}</Typography>)}
          </Box>
          <Box display={"flex"} flexWrap={"wrap"} flexDirection={"column"}>
            <InputLabel>Email : </InputLabel>
            <TextField type="email" {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please fill your correct email" }, required: { value: true, message: "Please fill email field" }, minLength: { value: 5, message: "Email too short" } })} />
            {errors.email && (<Typography color={"red"}>{errors.email.message}</Typography>)}
          </Box>
          <Box pt={2} pb={1} display={"flex"} flexWrap={"wrap"} flexDirection={"column"}>
            <InputLabel>Password : </InputLabel>
            <TextField type="password" {...register("password", { required: { value: true, message: "Please fill password field" }, maxLength: { value: 100, message: "Password too long" }, minLength: { value: 8, message: "Password must be greater than 8 characters" } })} />
            {errors.password && (<Typography color={"red"}>{errors.password.message}</Typography>)}
          </Box>
          <Box pb={1} display={"flex"} justifyContent={"flex-start"}>
            <Link style={{ fontSize: "13px", textDecoration: "none" }} to={route["signin"]}>Already have an account ? Please login</Link>
          </Box>
          <Box display={"flex"} justifyContent={"center"} gap={1} flexDirection={"column"}>
            <Button variant="contained" type="submit" fullWidth >Sign up</Button>
            <Button variant="outlined" startIcon={<GoogleIcon color="error" sx={{ fontWeight: "bold", marginBottom: "2px", fontSize: "30px" }} />} fullWidth sx={{ border: "1px solid gray", fontWeight: "bold", fontSize: "14px", color: "black" }} onClick={() => window.location.replace(import.meta.env.VITE_API_URL + "/auth/login/google")}>
              Sign up With Google
            </Button>
          </Box>
        </form>
      </Box >
    </Box >
  )
}

export default SignUp