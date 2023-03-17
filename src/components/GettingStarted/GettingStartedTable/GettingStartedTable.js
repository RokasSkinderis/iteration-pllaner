import {
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {getFormattedDate} from "@/utils/dateFormat";
import {HttpRequestMethods} from "@/hooks/useFetch";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useState} from "react";
import {Sheet, Typography} from "@mui/joy";
import {sortComparator} from "@/components/GettingStarted/GettingStartedTable/gettingStartedTableUtils";

const GettingStartedTable = ({
                                 headersAndTableOrder,
                                 data,
                                 addIcon,
                                 onAdd,
                                 handleItem,
                                 setMethod,
                                 setItemId,
                                 editItem,
                                 developerArray
                             }) => {
    const [rowOpen, setRowOpen] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('')
    const hasExpandableRows = headersAndTableOrder?.some(entry => Object.values(entry).includes('chevron'));
    const lastCellStyling = (index) => index === headersAndTableOrder.length - 1 ? 'right' : 'left'

    const sortHandler = (key) => {
        setOrder(order === 'asc' ? 'desc' : 'asc');
        setOrderBy(key);

        if (data) data.sort((a, b) => sortComparator(a, b, key, order))
    }

    const createHeaders = () => headersAndTableOrder?.map((header, index) => <TableCell
        sortDirection={orderBy === header.key ? order : false}
        key={index + 'h'}
        sx={{fontWeight: 'bold'}}
        align={lastCellStyling(index)}>
        {header.key !== 'actions' && header.title ? <TableSortLabel
            active={orderBy === header.key}
            direction={order}
            onClick={() => sortHandler(header.key)}
        >
            {header.title}
        </TableSortLabel> : header.title}

    </TableCell>) || []


    const handleEntryConfiguration = (id, method) => {
        setItemId(id)
        setMethod(method)
        handleItem()
    }

    const createExpandRow = (entry, index) => {
        return <TableRow key={index + 'e'}>
            <TableCell style={{height: 0, padding: 0}} colSpan={headersAndTableOrder.length}>
                {rowOpen.includes(index) && (
                    <Sheet
                        variant="soft"
                        sx={{p: 1, pl: 3, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)'}}
                    >
                        <Typography level="h6" component="div">
                            Developers
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="right">Domain</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="right">Based In</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entry.developers.length === 0 && <TableRow>
                                    <TableCell>No developers in team</TableCell>
                                </TableRow>}
                                {developerArray.filter((developer) => entry.developers.includes(developer._id)).map((entry, developerIndex) =>
                                    <TableRow key={developerIndex}>
                                        <TableCell>{entry.name}</TableCell>
                                        <TableCell align="right">{entry.domain}</TableCell>
                                        <TableCell align="right">{entry.basedIn}</TableCell>
                                    </TableRow>)
                                }
                            </TableBody>
                        </Table>
                    </Sheet>
                )}
            </TableCell>
        </TableRow>
    }

    const createCells = (entry, index) => {
        return headersAndTableOrder.map((cell, cellIndex) => {
            const isExpandable = cell.key === 'chevron'
            const isDate = cell.key === 'dateCreated'
            const isArray = cell.key === 'developers'
            const isActions = cell.key === 'actions'
            const isStandardCell = !isDate && !isArray && !isActions
            const toggleExpandedRow = () => rowOpen.includes(index)
                ? setRowOpen(rowOpen.filter(i => i !== index))
                : setRowOpen([...rowOpen, index])

            return <TableCell
                key={cellIndex}>
                {isExpandable && <IconButton onClick={() => toggleExpandedRow()}>
                    {rowOpen.includes(index) ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                </IconButton>}
                {isStandardCell && entry[cell.key]}
                {isDate && getFormattedDate(entry[cell.key])}
                {isArray && entry[cell.key].join(', ')}
                {cell.key === 'actions' && <Stack direction="row" sx={{justifyContent: 'flex-end'}}>
                    <IconButton size="small"
                                onClick={() => editItem(entry._id)}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton size="small" sx={{mr: -1}}
                                onClick={() => handleEntryConfiguration(entry._id, HttpRequestMethods.DELETE)}>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>}
            </TableCell>
        })
    }

    const createRows = () => {
        if (!data || data.length === 0) return <TableRow>
            <TableCell colSpan={headersAndTableOrder?.length} align="center">
                No data
            </TableCell>
        </TableRow>

        return data.map((entry, index) => {
            return <>
                <TableRow
                    key={index + 'r'}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                    {createCells(entry, index)}
                </TableRow>
                {hasExpandableRows && createExpandRow(entry, index)}
            </>
        })
    }

    return <TableContainer component={Paper}>
        <IconButton aria-label="Add" sx={{ml: 'calc(100% - 40px)'}} onClick={onAdd}>
            {addIcon}
        </IconButton>
        <Table size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    {createHeaders()}
                </TableRow>
            </TableHead>
            <TableBody>
                {createRows()}
            </TableBody>
        </Table>
    </TableContainer>
}

export default GettingStartedTable