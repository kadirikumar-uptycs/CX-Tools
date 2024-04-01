import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';


const style = {
    width: 400,
    bgcolor: '#ccc',
    border: '1px solid #ccc',
    boxShadow: 24,
    backgroundColor: '#d3d2d2',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '3px',

};

export default function ModalComponent({ show, title, body, closeModal, titleColor }) {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={show}
            onClose={closeModal}
            closeAfterTransition
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Slide in={show} direction='down'>
                <div style={style}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{
                            color: titleColor,
                            marginLeft: '20px',
                        }}>
                            {title}
                        </Typography>
                        <span style={{
                            color: '#010101',
                            fontSize: '31px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }} onClick={closeModal}>X</span>
                    </div>
                    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        {body}
                    </Typography>
                </div>
            </Slide>
        </Modal>
    );
}
