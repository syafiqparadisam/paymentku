import { Box, Typography } from '@mui/material'
import React from 'react'

const Header: React.FC<{ title?: string, desc?: string, bgimage?: string }> = ({ title, desc, bgimage }) => {
  return (
    <Box display={"flex"} width={"100%"} height={bgimage ? "300px" : "100%"} justifyContent={"center"} sx={{ backgroundImage: `url("${bgimage}")`, backgroundSize: "cover", backgroundPosition: "center" }} alignItems={"center"} mb={1} bgcolor={"#ddd"}>
      {!bgimage && <Box display={"flex"} textAlign={"center"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} p={3}>
        <Typography fontWeight={"bold"} fontSize={"30px"}>{title}</Typography>
        <Typography>{desc}</Typography>
      </Box>}
    </Box>
  )
}

export default Header