import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import TableComponent from './TableComponent';
import Typography from '@mui/material/Typography';
import GetAppIcon from '@mui/icons-material/GetApp';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import MoveUpIcon from '@mui/icons-material/MoveUp';

const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field: 'subject',
        headerName: 'Subject',
        sortable: false,
        width: 400,
        editable: true,
    },
    {
        field: 'priority',
        headerName: 'Priority',
        width: 150,
        editable: true,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 210,
        editable: true,
    },
    {
        field: 'ticketNumber',
        headerName: 'Ticket Number',
        description: 'Ticket Number of Zoho Ticket.',
        width: 160,
    },
    {
        field: 'createdTime',
        headerName: 'Created Time',
        width: 310,
        editable: true,
        valueGetter: (params) => new Date(params.row.createdTime),
    },
];

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#222',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));


const convertJsonToCsv = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

const downloadCsvFile = (csv) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'TicketsData.csv';
    link.click();
    window.URL.revokeObjectURL(link.href);
};

function downloadJsonFile(data) {
    const jsonStr = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'TicketsData.json';
    link.click();
    window.URL.revokeObjectURL(link.href);
}

function getElement(isLoading, tickets, columns) {
    if (isLoading) {
        return <CircularProgress />
    } else if (tickets.length > 0) {
        return <TableComponent columns={columns} rows={tickets} optionsSize={10} />
    } else {
        return <></>
    }
}




const ZohoTickets = () => {
    let [tickets, setTickets] = useState([]);
    let [isLoading, setIsLoading] = useState(false);
    let [limit, setLimit] = useState(100);

    async function getTickets(event) {
        event.stopPropagation();
        setIsLoading(true);
        let url = `${process.env.SERVER_BASE_ADDRESS}/zohoTickets?limit=${limit}`;

        try {
            let response = await axios.post(url);
            let data = response.data?.data;
            setTickets(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error.response);
            setIsLoading(false);
        }
    }

    async function downloadTicketsCSV() {
        let csvData = convertJsonToCsv(tickets);
        downloadCsvFile(csvData);
    }


    async function downloadTicketsJSON() {
        downloadJsonFile(tickets);
    }

    async function sendMigrationRequest(){
        let url = `${process.env.SERVER_BASE_ADDRESS}/migrateToTotango?limit=${limit}`;

        try{
            let response = await axios.post(url);
            console.log(response.data);
            alert(response.status);
        }catch(error){
            console.log(error.response);
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
                marginTop: '10px',
            }}>
                <input type="number" placeholder='ticket records limit' style={{
                    outline: 'none',
                    border: 'none',
                    background: 'transparent',
                    color: '#F3F3F3',
                    borderBottom: '1px solid #F1F1F1',
                    textAlign: 'center',
                }}
                    onInput={(event) => setLimit(parseInt(event.currentTarget.value))}
                />
                <div onClick={getTickets} style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}>
                    <Typography sx={{ color: '#ce93d8' }}>Get Tickets</Typography>
                    <IconButton aria-label="Transfer" color="secondary">
                        <YoutubeSearchedForIcon sx={{
                            fontSize: '31px',
                        }} />
                    </IconButton>
                </div>
                <div onClick={sendMigrationRequest} style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}>
                    <Typography sx={{ color: '#ce93d8' }}>{"To Totango"}</Typography>
                    <IconButton aria-label="Transfer" color="secondary">
                        <MoveUpIcon sx={{
                            fontSize: '31px',
                        }} />
                    </IconButton>
                </div>
                <ButtonGroup>
                    <HtmlTooltip 
                        title={
                            <Typography sx={{
                                fontFamily: 'cursive',
                                fontSize: '13px',
                                color: '#F3F3F3',
                                background: '#222',
                            }}>Download Tickets data in <strong style={{ color: 'orange', background: '#111' }}>C</strong><strong style={{background: '#111'}}>S</strong><strong style={{ color: 'lightgreen', background: '#111' }}>V</strong>&nbsp;format</Typography>
                        }
                    >
                        <IconButton aria-label="Download" color="secondary" onClick={downloadTicketsCSV}>
                            <GetAppIcon sx={{
                                fontSize: '31px',
                            }} />
                        </IconButton>
                    </HtmlTooltip>

                    <HtmlTooltip
                        title={
                            <Typography sx={{
                                fontFamily: 'cursive',
                                fontSize: '13px',
                                color: '#F3F3F3',
                                background: '#222',
                            }}>Download Tickets data in <strong style={{ color: 'orange', background: '#111' }}>J</strong><strong style={{color: '#06038D', background: '#111'}}>S</strong><strong style={{background: '#111'}}>O</strong><strong style={{ color: 'lightgreen', background: '#111' }}>N</strong>&nbsp;format</Typography>
                        }
                    >
                        <IconButton aria-label="Download" color="secondary" onClick={downloadTicketsJSON}>
                            <GetAppIcon sx={{
                                fontSize: '31px',
                            }} />
                        </IconButton>
                    </HtmlTooltip>
                </ButtonGroup>
            </div>
            <div style={{margin: '20px 0'}}></div>
            {getElement(isLoading, tickets, columns)}
        </div>
    );
}

export default ZohoTickets;
