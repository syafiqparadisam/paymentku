import { CopyrightOutlined, Email, EmailOutlined, GitHub, Instagram, LocalAtmRounded, YouTube } from "@mui/icons-material"
import { Box, Button, Input, Link, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { route } from "../constant/route"

type Email = {
    email: string
}

const Footer = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Email>()
    const navigate = useNavigate()

    const submittedForm = (data: Email) => {
    }

    return (
        <>
            <Box width={"100%"} bgcolor={"skyblue"} p={2}>
                <Box width={"100%"} display={"flex"} justifyContent={"space-around"} alignItems={"center"} py={5}>

                    <Box display={"flex"} justifyContent={"space-around"} width={"100%"}>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Box display={"flex"} alignItems={"center"}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    fontSize={"23px"}
                                    fontStyle={"italic"}
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Paymentku
                                </Typography>
                                <LocalAtmRounded sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }} />

                            </Box>
                            <Typography>Make your transaction safety and fast</Typography>
                            <Typography fontWeight={"bold"} py={3}>Subscribe now</Typography>
                            <form onSubmit={handleSubmit(submittedForm)}>
                                {errors?.email && <Typography color={"red"}>{errors.email.message}</Typography>}
                                <Input {...register("email", { pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Please enter correct email address" } })} placeholder={"Enter your email"}  />

                                <Box width={"30%"} mt={3}>
                                    <Button color="error" variant="contained" type="submit">Subscribe</Button>
                                </Box>
                            </form>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Typography fontWeight={"bold"} fontSize={"18px"}>Information</Typography>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "black" }} fontSize={"18px"} onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")}>About us</Link>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "black" }} fontSize={"18px"} onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")}>Blog</Link>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "black" }} fontSize={"18px"} onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")}>Testimonial</Link>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Typography fontWeight={"bold"} fontSize={"18px"}>Helpful links</Typography>
                            <Typography sx={{ cursor: "pointer" }} fontSize={"18px"} onClick={() => navigate(route["home"])}>Home</Typography>
                            <Typography sx={{ cursor: "pointer" }} fontSize={"18px"} onClick={() => navigate(route["dashboard"])}>Dashboard</Typography>
                            <Typography sx={{ cursor: "pointer" }} fontSize={"18px"} onClick={() => navigate(route["user"])}>Profile</Typography>
                            <Typography sx={{ cursor: "pointer" }} fontSize={"18px"} onClick={() => navigate(route["topuphistory"])}>History</Typography>
                            <Typography sx={{ cursor: "pointer" }} fontSize={"18px"} onClick={() => navigate(route["settings"])}>Settings</Typography>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Typography fontWeight={"bold"} fontSize={"18px"}>Services</Typography>
                            <Typography fontSize={"18px"}>Transfer</Typography>
                            <Typography fontSize={"18px"}>Exchange</Typography>
                            <Typography fontSize={"18px"}>Topup</Typography>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Typography fontWeight={"bold"} fontSize={"18px"}>Contact us</Typography>
                            <Box display={"flex"} alignItems={"center"}>
                                <EmailOutlined color="error" />
                                <Typography fontSize={"18px"} ml={1}>syafiqpinginfullstack@gmail.com</Typography>
                            </Box>
                            <Box mt={5} width={"100%"} display={"flex"} justifyContent={"center"}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"} width="80%">

                                    <Link href={"https://www.instagram.com/syafiqparadisam"} sx={{ textDecoration: "none", color: "black" }}>
                                        <Instagram color="error" fontSize="large" />
                                    </Link>
                                    <Link href={"https://github.com/syafiqparadisam"} sx={{ textDecoration: "none", color: "black" }}>
                                        <GitHub fontSize="large" />
                                    </Link>
                                    <Link href={"https://youtube.com/@SyafiqCoding?si=Z7zzxNwHn5bMeAQZ"} sx={{ textDecoration: "none", color: "red" }}>
                                        <YouTube fontSize="large" />
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box width={"100%"}>
                    <hr style={{ width: "100%", color: "black" }}></hr>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                        <CopyrightOutlined sx={{ marginInline: "5px" }} />
                        <Typography>paymentku | All right reserved. 2024</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Footer