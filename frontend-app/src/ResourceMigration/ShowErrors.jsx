import React from 'react';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Button from '@mui/material/Button';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import './ShowErrors.css';

export default function ShowErrors({ open, handleClose, details }) {

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
            <React.Fragment>
                <Drawer
                    anchor='bottom'
                    open={open}
                    onClose={handleClose}
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
                                <div className="col">{index+1}. {row.name}</div>
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
                            <Button variant="contained" startIcon={<CloseFullscreenIcon />} onClick={handleClose} sx={{
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