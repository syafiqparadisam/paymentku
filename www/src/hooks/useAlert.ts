import { useState } from "react"

const useAlert = () => {
    const [open, setOpen] = useState<boolean>(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    return { open, handleClose, handleOpen }
}

export default useAlert