import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/joy/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/joy/IconButton';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ReportIcon from '@mui/icons-material/Report';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import './ShowErrors.css';


export default function ShowErrors({ details }) {

    const [open, setOpen] = useState(false)

    function ListView(list) {
        return (
            <ul>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    }

    return (
        <div>
            <Typography
                color='danger'
                startDecorator={
                    <IconButton
                        color='danger'
                        onClick={() => setOpen(true)}
                    >
                        <ReportIcon />
                    </IconButton>
                }
                sx={{
                    position: 'relative',
                    top: '100px',
                }}
            >{`${details?.failed} out of ${details?.total} failed`}
            </Typography>
            <React.Fragment>
                <Drawer
                    anchor='bottom'
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <div className='nav-bar'>
                        <span className='drawer-heading'>Error occurred while migrating some resources</span>
                    </div>

                    <div className='table'>
                        <div className="row row-heading">
                            <div className="col">Resource Name</div>
                            <div className="col">Error</div>
                            <hr />
                        </div>
                        {details?.errors?.map((row, index) => (
                            <div className="row" key={row?.name}>
                                <div className="col">{index + 1}. {row.name}</div>
                                <div className="col col-2">
                                    {
                                        Array.isArray(row?.error) ?
                                            ListView(row?.error) : row?.error
                                    }
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                    <div className='footer'>
                        <div className='errorStats'>
                            <ReportProblemIcon color='error' />
                            <span className='count'>{details?.failed}</span>
                            <span className='slash'>/</span>
                            <span className='count'>{details?.total}</span>
                            <span className='status'>Failed</span>
                        </div>
                        <Tooltip title='Close' color='primary'>
                            <Button variant="contained" startIcon={<CloseFullscreenIcon />} onClick={() => setOpen(false)} sx={{
                                borderRadius: '0',
                                height: '60px',
                                color: 'var(--bg-color)',
                                background: 'var(--primary-color)',
                                '&:hover': {
                                    color: 'var(--bg-color)',
                                    background: 'var(--primary-color)',
                                    opacity: 0.9
                                }
                            }}>
                                CLOSE
                            </Button>
                        </Tooltip>
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    );
}