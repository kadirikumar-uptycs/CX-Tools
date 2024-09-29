import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';


function labelDisplayedRows({ from, to, count }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function descendingComparator(a, b, orderBy) {
    let type = typeof a[orderBy];
    let A = (type === 'object') ? (a[orderBy]['content']) : a[orderBy];
    let B = (type === 'object') ? (b[orderBy]['content']) : b[orderBy];
    if (B < A) {
        return -1;
    }
    if (B > A) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headCells } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    let totalColumns = headCells ? headCells.length : 1;

    return (
        <thead>
            <tr>
                {headCells.map((headCell, index) => {
                    const active = orderBy === headCell.id;
                    return (
                        <th
                            key={headCell.id}
                            aria-sort={
                                active ? { asc: 'ascending', desc: 'descending' }[order] : undefined
                            }
                            style={{
                                width: `${100 / totalColumns}%`,
                                paddingLeft: (!index) ? '20px' : '10px'
                            }}
                        >
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <Link
                                underline="none"
                                color="neutral"
                                textColor={active ? 'primary.plainColor' : undefined}
                                component="button"
                                onClick={headCell.disableSorting ? undefined : createSortHandler(headCell.id)}
                                fontWeight="lg"
                                endDecorator={!headCell.disableSorting && <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />}
                                sx={{
                                    '& svg': {
                                        transition: '0.2s',
                                        transform:
                                            active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    },
                                    '&:hover': { '& svg': { opacity: 1 } },
                                    cursor: (headCell.disableSorting) ? 'text' : 'pointer'
                                }}
                            >
                                {headCell.label}
                                {active ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </Link>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string,
    rowCount: PropTypes.number.isRequired,
    headCells: PropTypes.arrayOf(PropTypes.object),
};

function EnhancedTableToolbar({ toolBarParams }) {
    const { title, styles } = toolBarParams;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                borderTopLeftRadius: 'var(--unstable_actionRadius)',
                borderTopRightRadius: 'var(--unstable_actionRadius)',
            }}
        >
            <Typography
                level="body-lg"
                sx={{ flex: '1 1 100%', ...styles }}
                id="tableTitle"
                component="div"
            >
                {/* {variant === 'rejection' ? 'Rejected' : 'Approved'} Leave Applications */}
                {title}

            </Typography>
            <Tooltip title="Table View">
                <IconButton size="sm" variant="outlined" color="neutral">
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

EnhancedTableToolbar.propTypes = {
    toolBarParams: PropTypes.object
};

export default function TableSortAndSelection({ headCells, rows, toolBarParams }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);



    const handleRequestSort = (_, property) => {
        const isAsc = orderBy === property && order === 'asc';
        const isDesc = orderBy === property && order === 'desc';
        if (isAsc) {
            setOrder('desc');
            setOrderBy(property);
        } else if (isDesc) {
            setOrder(null);
            setOrderBy(null);
        } else {
            setOrder('asc');
            setOrderBy(property);
        }
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        setRowsPerPage(parseInt(newValue.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (rows.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? rows.length
            : Math.min(rows.length, (page + 1) * rowsPerPage);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Sheet
            variant="outlined"
            sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
        >
            <EnhancedTableToolbar toolBarParams={toolBarParams} />
            <Table
                aria-labelledby="tableTitle"
                hoverRow
                stripe="odd"
                sx={{
                    '--TableCell-headBackground': 'transparent',
                    '--TableCell-selectedBackground': (theme) =>
                        theme.vars.palette.success.softBg,
                    '& thead th::nth-of-type(1)': {
                        width: '40px',
                    },
                    '& thead th::nth-of-type(2)': {
                        width: '30px',
                    },
                    '& tr > *::nth-of-type(n+3)': { textAlign: 'right' },
                }}
            >
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    headCells={headCells}
                />
                <tbody>
                    {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, row_index) => {
                            return (
                                <tr
                                    tabIndex={-1}
                                    key={row_index}
                                >
                                    {
                                        headCells.map((column, col_index) => {
                                            let column_Data = row[column.id];
                                            let cellData = (column.type === 'object') ? column_Data.data : column_Data;
                                            let toolTipInfo = (column.type === 'object') ? column_Data.content : column_Data;
                                            return (
                                                <Tooltip title={column.disableToolTip ? '' : toolTipInfo} placement="top-start" key={row_index + '' + col_index}>
                                                    {
                                                        col_index === 0 ? (
                                                            <th
                                                                scope="row"
                                                                style={{
                                                                    paddingLeft: '20px',
                                                                }}
                                                            >
                                                                {(column.showNumberCommas) ? numberWithCommas(cellData) : cellData}
                                                            </th>) : (
                                                            <td style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {(column.showNumberCommas) ? numberWithCommas(cellData) : cellData}
                                                            </td>
                                                        )
                                                    }
                                                </Tooltip>
                                            )
                                        })
                                    }
                                </tr>
                            );
                        })}
                    {emptyRows > 0 && (
                        <tr
                            style={{
                                height: `calc(${emptyRows} * 40px)`,
                                '--TableRow-hoverBackground': 'transparent',
                            }}
                        >
                            <td colSpan={headCells.length} aria-hidden />
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={headCells.length}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <FormControl orientation="horizontal" size="sm">
                                    <FormLabel>Rows per page:</FormLabel>
                                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                                        <Option value={7}>7</Option>
                                        <Option value={10}>10</Option>
                                        <Option value={25}>25</Option>
                                    </Select>
                                </FormControl>
                                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                                    {labelDisplayedRows({
                                        from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                                        to: getLabelDisplayedRowsTo(),
                                        count: rows.length === -1 ? -1 : rows.length,
                                    })}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="sm"
                                        color="neutral"
                                        variant="outlined"
                                        disabled={page === 0}
                                        onClick={() => handleChangePage(page - 1)}
                                        sx={{ bgcolor: 'background.surface' }}
                                    >
                                        <KeyboardArrowLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        size="sm"
                                        color="neutral"
                                        variant="outlined"
                                        disabled={
                                            rows.length !== -1
                                                ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                                                : false
                                        }
                                        onClick={() => handleChangePage(page + 1)}
                                        sx={{ bgcolor: 'background.surface' }}
                                    >
                                        <KeyboardArrowRightIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Sheet>
    );
}