import React from 'react';
import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';

const TableComponent = ({columns, rows, optionsSize}) => {

    return (
        <Box sx={{ width: '100%' }}>
            {/* <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: optionsSize,
                        },
                    },
                }}
                pageSizeOptions={[optionsSize]}
                checkboxSelection
                disableRowSelectionOnClick
            /> */}
        </Box>
    )

}

export default TableComponent;