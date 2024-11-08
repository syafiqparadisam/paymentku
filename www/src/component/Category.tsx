import { Box,InputLabel, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

type menuItem = {
    redirect: string,
    categories: string,
}

type Header = {
    firstItem: string,
    menuItem: menuItem[]
}

const Category: React.FC<Header> = ({ firstItem, menuItem }) => {
    const [category, setCategory] = useState<string>(firstItem)

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };
    const navigate = useNavigate()

    return (
        <>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        label="Category"
                        value={category}
                        labelId="demo-simple-select-label"
                        onChange={handleChange}
                    >
                        {menuItem.map((menu) => (
                            <MenuItem key={menu.categories} onClick={() => navigate(menu.redirect)} value={menu.categories}>{menu.categories}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    )
}

export default Category