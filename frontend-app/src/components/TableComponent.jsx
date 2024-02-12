import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function TableComponent({ rows }) {
    return (
        <TableContainer component={Paper} sx={{
            width: '650px',
            maxWidth: '750px',
            minHeight: '400px',
            marginBottom: '30px',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'scroll',
        }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            fontFamily: 'cursive',
                            fontSize: '23px',
                            fontWeight: '700',
                            color: '#3498db'
                        }}>Resource Name</TableCell>
                        <TableCell align="right"
                            sx={{
                                fontFamily: 'cursive',
                                fontSize: '23px',
                                fontWeight: '700',
                                color: '#3498db'
                            }}
                        >Error</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                            }}
                        >
                            <TableCell component="th" scope="row" sx={{
                                fontFamily: 'monospace',
                                fontSize: '19px',
                            }}>
                                {row.name}
                            </TableCell>
                            <TableCell align="right" sx={{
                                fontFamily: 'monospace',
                                fontSize: '19px',
                                color: 'rebeccapurple'
                            }}>{row.error}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}