import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import useFetch, {HttpRequestMethods} from "@/hooks/useFetch";

const CreateTeamDialog = ({onClose, open, developerArray, onSubmit, editingItem}) => {
    const [name, setName] = useState(editingItem?.name || '')
    const [developers, setDevelopers] = useState(editingItem?.developers || [])
    const [scrumMaster, setScrumMaster] = useState(editingItem?.scrumMaster || '')
    const [editItem, setEditItem] = useState(null)

    const {data, refetch} = useFetch({
        url: '/api/teams',
        method: HttpRequestMethods.POST,
        options: {
            body: JSON.stringify({name, developers, scrumMaster})
        },
        config: {
            enabled: false,
        }
    })

    useEffect(() => {
        if (data && data?.success) {
            onSubmit()
            onClose()
            setName('')
            setDevelopers([])
            setScrumMaster('')
        }

        if (editItem) {
            onSubmit(editItem)
        }
    }, [data, editItem])


    if (!open) return

    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>Create a new Team!</DialogTitle>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'column', minWidth: 380}}>
            <TextField label={'Name'} type="text" variant="standard" value={name} sx={{mb: 2}}
                       onInput={(e) => setName(e.target.value)}/>

            <TextField label={'Scrum master'} type="text" variant="standard" value={scrumMaster} sx={{mb: 2}}
                       onInput={(e) => setScrumMaster(e.target.value)}/>


            <FormControl variant="standard" fullWidth sx={{mb: 2}}>
                <InputLabel>Developers</InputLabel>
                <Select
                    value={developers}
                    label="Developers"
                    multiple
                    renderValue={(selected) => developerArray.filter(dev => selected.includes(dev._id))
                        .map(item => item.name).join(', ')}
                    onChange={(e) => setDevelopers(e.target.value)}
                >
                    {developerArray.map((developer, index) => <MenuItem
                        value={developer._id}
                        key={index + 'd'}>
                        <Checkbox checked={developers.includes(developer._id)}/>
                        <ListItemText primary={developer.name}/>
                    </MenuItem>)}
                </Select>
            </FormControl>

            <Button sx={{mt: 2}} variant="contained"
                    onClick={() => editingItem ? setEditItem({
                        ...editingItem,
                        name,
                        scrumMaster,
                        developers
                    }) : refetch()}>
                {editingItem ? 'Edit' : 'Create'} Team
            </Button>
        </Box>

    </Dialog>
}

export default CreateTeamDialog;