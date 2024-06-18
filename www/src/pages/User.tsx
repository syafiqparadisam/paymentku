import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import React, { ReactElement, ReactNode } from 'react';
import UserProfile from './UserProfile';
import { route } from '../constant/route';
import { Help, Settings } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface Props {
    children: ReactNode | ReactElement
}

const User: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const darkMode = useSelector((state: RootState) => state.darkMode)

    return (
        <>
            <Box display={"flex"} height={"100%"}>
                <Box display={"flex"} width={"20%"} bgcolor={darkMode.isDark ? "#222" : "white"} mr={3} height={"180vh"} flexDirection={"column"} alignItems={"center"}>
                    <List sx={{ width: "100%" }}>
                        <ListItem disablePadding onClick={() => navigate(route["user"])} sx={{ width: "100%" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon style={{ color: darkMode.isDark ? "white" : "black" }} />
                                </ListItemIcon>
                                <ListItemText sx={{ fontWeight: "bold", color: darkMode.isDark ? "white" : "black" }} primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding onClick={() => navigate(route["topuphistory"])} sx={{ width: "100%" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HistoryIcon style={{ color: darkMode.isDark ? "white" : "black" }} />
                                </ListItemIcon>
                                <ListItemText sx={{ fontWeight: "bold", color: darkMode.isDark ? "white" : "black" }} primary="History" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding onClick={() => navigate(route["settings"])} sx={{ width: "100%" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Settings style={{ color: darkMode.isDark ? "white" : "black" }} />
                                </ListItemIcon>
                                <ListItemText sx={{ fontWeight: "bold", color: darkMode.isDark ? "white" : "black" }} primary="Setting" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding onClick={() => navigate(route["help"])} sx={{ width: "100%" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Help style={{ color: darkMode.isDark ? "white" : "black" }} />
                                </ListItemIcon>
                                <ListItemText sx={{ fontWeight: "bold", color: darkMode.isDark ? "white" : "black" }} primary="Help" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
                {children ? children : <UserProfile />}
            </Box >
        </>
    )
}

export default User