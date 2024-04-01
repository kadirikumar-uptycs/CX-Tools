import React from 'react';
import { useRouteError } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    hieght: '400px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ErrorPage() {
    let error = useRouteError();
    console.log("errorpage := " + error);
    console.log(typeof error);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 900,
                },
            }}
        >
            <Fade in={true}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Error Occured!
                    </Typography>
                    <Divider/>
                    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        {error.toString()}
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
}