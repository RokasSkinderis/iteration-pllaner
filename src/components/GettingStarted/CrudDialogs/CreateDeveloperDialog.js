import {useEffect, useState} from "react";
import {Box, Button, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import useFetch, {HttpRequestMethods} from "@/hooks/useFetch";

const domainValues = ['Frontend', 'Hybris', 'FirstSpirit', 'DevOps', 'Full Stack']
const basedInValues = ['Germany', 'Lithuania', 'Spain']

const CreateDeveloperDialog = ({onClose, open, onSubmit, editingItem}) => {
    const [name, setName] = useState(editingItem?.name || '')
    const [domain, setDomain] = useState(editingItem?.domain || '')
    const [basedIn, setBasedIn] = useState(editingItem?.basedIn || '')
    const [editItem, setEditItem] = useState(null)


    const {data, refetch} = useFetch({
        url: '/api/developers',
        method: HttpRequestMethods.POST,
        options: {
            body: JSON.stringify({name, domain, basedIn})
        },
        config: {
            enabled: false,
        }
    })

    useEffect(() => {
        if (data && data?.success) {
            onSubmit()
            setName('')
            setDomain('')
            setBasedIn('')
            onClose()
        }

        if (editItem) {
            onSubmit(editItem)
        }
    }, [data, editItem])

    if (!open) return

    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>{editingItem ? 'Edit' : 'Create'}</DialogTitle>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'column', minWidth: 380}}>
            <TextField label={'Name'} type="text" variant="standard" value={name} sx={{mb: 2}}
                       onInput={(e) => setName(e.target.value)}/>


            <FormControl variant="standard" fullWidth sx={{mb: 2}}>
                <InputLabel>Domain</InputLabel>
                <Select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                >
                    {domainValues.map((value, index) => <MenuItem value={value} key={index}>{value}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{mb: 2}}>
                <InputLabel>Based in</InputLabel>
                <Select
                    value={basedIn}
                    onChange={(e) => setBasedIn(e.target.value)}
                >
                    {basedInValues.map((value, index) => <MenuItem value={value} key={index}>{value}</MenuItem>)}
                </Select>
            </FormControl>

            <Button sx={{mt: 2}} variant="contained"
                    onClick={() => editingItem ? setEditItem({...editingItem, name, domain, basedIn}) : refetch()}>
                {editingItem ? 'Edit' : 'Create'} Developer
            </Button>
        </Box>

    </Dialog>
}

export default CreateDeveloperDialog;