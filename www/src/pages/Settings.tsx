import User from './User'
import { Box, Switch, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setDarkMode } from '../features/web/darkMode'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    const dispatch = useDispatch()
    const darkMode = useSelector(state => state.darkMode)
    const navigate = useNavigate()

    return (
        <User>
            <Box display={"flex"} width={"100%"} height={"100%"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} gap={2}>
                <Box display={"flex"} gap={1} mt={2} width={"100%"} alignItems={"center"} onClick={() => navigate(-1)}>
                    <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
                </Box>
                <Box display="flex" justifyContent={"space-between"} p={4} mt={2} alignItems={"center"} width="95%" border={"1px solid #ddd"} borderRadius={"10px"}>
                    <Box flexDirection={"column"} display={"flex"}>
                        <Typography fontSize={"20px"}>Configure sidebar dark mode</Typography>
                        <Typography >When enable text in sidebar will be light and background will be dark</Typography>
                    </Box>
                    <Switch defaultChecked={darkMode.isDark ? true : false} onChange={(e) => dispatch(setDarkMode(e.target.checked))}></Switch>
                </Box>
            </Box>
        </User>

    )
}

export default Settings