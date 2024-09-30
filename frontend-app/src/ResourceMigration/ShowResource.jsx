import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.min.css';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import IconButton from '@mui/joy/IconButton';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grow from '@mui/material/Grow';
import { Stack, Tooltip, Typography } from '@mui/joy';

export default function ShowResource({ resource }) {
    let [open, setOpen] = useState(false);


    const handleOpen = async () => {
        setOpen(true);
        const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await wait(10);
        Prism.highlightAll();
    }


    return (
        <>
            <IconButton color='primary' onClick={handleOpen}>
                <ZoomOutMapIcon />
            </IconButton>
            <Transition in={open} timeout={700}>
                {(state) => (
                    <Modal
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={[
                            state === 'exited'
                                ? { visibility: 'hidden' }
                                : { visibility: 'visible' },
                        ]}
                    >
                        <Grow in={open} timeout={500}>
                            <ModalDialog
                                sx={{
                                    opacity: 0,
                                    transition: `opacity 300ms`,
                                    ...{
                                        entering: { opacity: 1 },
                                        entered: { opacity: 1 },
                                    }[state],
                                    translate: '-50% -50%',
                                }}
                            >
                                <DialogTitle>
                                    <Stack
                                        direction='row'
                                        justifyContent='space-between'
                                        sx={{
                                            width: '100%',
                                            marginBottom: '4px',
                                            paddingRight: '10px'
                                        }}
                                    >
                                        <Typography>{resource?.name || 'Resource Name'}</Typography>
                                        <Tooltip
                                            title='close'
                                            arrow
                                            placement='bottom'
                                            color='danger'
                                            variant='outlined'
                                        >
                                            <IconButton color='danger' sx={{ scale: 1.3 }} onClick={() => setOpen(false)}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </DialogTitle>
                                <DialogContent>
                                    <pre
                                        style={{
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                            whiteSpace: 'pre-line',
                                            fontSize: '13px',
                                            margin: 0,
                                            scrollbarWidth: 'thin'
                                        }}
                                    >
                                        <code className='language-json'>{JSON.stringify(resource, null, 4)}</code>
                                    </pre>
                                </DialogContent>

                            </ModalDialog>
                        </Grow>
                    </Modal>
                )}
            </Transition>
        </>
    );
}