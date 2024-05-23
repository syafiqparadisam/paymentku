import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { LocalAtmRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { route } from '../constant/route';


const settings: Array<{ name: string, link: string }> = [
    {
        name: "Home",
        link: route["home"],
    },
    {
        name: "Dashboard",
        link: route["dashboard"]
    },
    {
        name: "Profile",
        link: route["user"]
    },
    {
        name: "Settings",
        link: route["settings"]
    },
    {
        name: "Help",
        link: route["help"]
    }
];

function Navbar() {
    const user = useSelector((state) => state.user)
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const navigate = useNavigate()

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleHoverNav = (e) => {
        e.target.style.backgroundColor = "green"
    }


    const handleHoverOutNav = (e) => {
        e.target.style.backgroundColor = "transparent"
    }


    return (
        <AppBar position="sticky">
            <Box maxWidth="xl" display={"flex"} justifyContent={"space-between"} p={1} >
                <Box display={"flex"} width="40%" alignItems={"center"} ml={2} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                    <LocalAtmRounded sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
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
                </Box>
                {user.user != "" ? (
                    <>
                        <Box width={"30%"} display={"flex"} justifyContent={"flex-end"} textAlign={"center"}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User profile image" src={user.photo_profile} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <RouterLink style={{ textDecoration: "none", color: "black" }} to={setting.link}>
                                        <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" width={"100%"}>{setting.name}</Typography>
                                        </MenuItem>
                                    </RouterLink>
                                ))}
                            </Menu>
                        </Box>
                    </>

                ) : (
                    <Box width="60%" display={"flex"} justifyContent={"space-between"}>
                        <Box display={"flex"} gap={2}>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "white", transition: "background-color 0.1s ease-in-out", backgroundColor: "transparent" }} p={1} borderRadius={"6px"} fontSize={"18px"} onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")} onMouseOver={handleHoverNav} onMouseOut={handleHoverOutNav}>About us</Link>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "white", transition: "background-color 0.1s ease-in-out" }} p={1} onMouseOut={handleHoverOutNav} borderRadius={"6px"} className="blog" fontSize={"18px"} onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")} onMouseOver={handleHoverNav}>Blog</Link>
                            <Link sx={{ textDecoration: "none", cursor: "pointer", color: "white", transition: "background-color 0.1s ease-in-out" }} p={1} borderRadius={"6px"} onMouseOut={handleHoverOutNav} fontSize={"18px"} className="testimoni" onClick={() => window.open("https://syafiqparadisam.netlify.app", "_blank")} onMouseOver={handleHoverNav}>Testimonial</Link>

                        </Box>
                        <Box display={"flex"} gap={3} mr={5}>
                            <Button variant="contained" color="success" onClick={() => navigate(route["signin"])}>Login</Button>
                            <Button variant="contained" color="success" onClick={() => navigate(route["signup"])}>Sign up</Button>
                        </Box>
                    </Box>
                )}

            </Box>
        </AppBar>
    );
}
export default Navbar