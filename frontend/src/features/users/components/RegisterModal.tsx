import {type FC} from "react";
import {Box, Button, Modal, Typography} from "@mui/material";
import Register from "../Register.tsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface Props {
    handleOpen: () => void;
    handleClose: () => void;
    open: boolean;
}

const RegisterModal: FC<Props> = ({handleClose, handleOpen, open}) => {

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h3">
                        Register first
                    </Typography>
                    <Box>
                        <Register/>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default RegisterModal;