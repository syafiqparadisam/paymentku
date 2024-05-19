import { Box, Typography, List, ListItem } from "@mui/material"
import React from "react"
import toRupiah from '@develoka/angka-rupiah-js';

interface listRequirement {
    name: string
    icon: React.ReactNode,

}

interface props {
    amount: number,
    requirement: listRequirement[],
    onClick: Function
}

const FastTransferBox: React.FC<props> = ({ amount, requirement, onClick}) => {
    return (
        <Box border={"2px solid black"} borderRadius={"20px"} flexDirection={"column"} display={"flex"} alignItems={"center"} pb={2} width={"40%"} onClick={() => onClick()}>
            <Typography fontWeight={"bold"} py={3} color={"primary"} fontSize={"20px"}>{toRupiah(amount, { dot: ',', floatingPoint: 0 })}++</Typography>
            <List>
                {requirement.map((data: listRequirement) => (
                    <ListItem>
                        {data.icon}
                        <Typography ml={1}>{data.name}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default FastTransferBox