import { Dialog, DialogActions, DialogTitle, DialogContentText, Button, DialogContent } from "@mui/material"

type Fn = () => void

type Alert = {
    open: boolean,
    handleClose: Fn
    actions: Fn
    title: string
    desc: string
}

const Alert: React.FC<Alert> = ({ open, handleClose, actions, title, desc }) => {
    return (
        <Dialog
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
                    {desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} variant="contained" color="error">Cancel</Button>
                <Button variant="contained" color="success" onClick={() => {
                    actions()
                    handleClose()
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Alert