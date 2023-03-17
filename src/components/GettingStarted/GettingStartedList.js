import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import {useEffect, useState} from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddIcon from "@mui/icons-material/Add";
import CreateTeamDialog from "@/components/GettingStarted/CrudDialogs/CreateTeamDialog";
import useFetch, {HttpRequestMethods} from "@/hooks/useFetch";
import GettingStartedTable from "@/components/GettingStarted/GettingStartedTable/GettingStartedTable";
import GettingStartedListItem from "@/components/GettingStarted/GettingStartedListItem";
import CreateDeveloperDialog from "@/components/GettingStarted/CrudDialogs/CreateDeveloperDialog";


const GettingStartedListItems = {
    TEAMS: 'Teams',
    DEVELOPERS: 'Developers',
    ITERATIONS: 'Iterations',
}

const TeamsTableOrder = [
    {title: '', key: 'chevron'},
    {title: 'Name', key: 'name'},
    {title: 'Scrum Master', key: 'scrumMaster'},
    {title: 'Date Created', key: 'dateCreated'},
    {title: 'Actions', key: 'actions'},
]

const DevelopersTableOrder = [
    {title: 'Name', key: 'name'},
    {title: 'Domain', key: 'domain'},
    {title: 'Based In', key: 'basedIn'},
    {title: 'Date Created', key: 'dateCreated'},
    {title: 'Actions', key: 'actions'},
]

const GettingStartedList = () => {
    const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
    const [isAddDeveloperDialogOpen, setIsAddDeveloperDialogOpen] = useState(false);
    const [activeListItem, setActiveListItem] = useState('');
    const [itemID, setItemID] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [method, setMethod] = useState(null);
    const isTeamsActive = activeListItem === GettingStartedListItems.TEAMS
    const isDevelopersActive = activeListItem === GettingStartedListItems.DEVELOPERS
    const isIterationsActive = activeListItem === GettingStartedListItems.ITERATIONS
    const setActiveTabFromHash = () => {
        const tabValue = window.location.hash.substring(1); // remove the '#' symbol
        setActiveListItem(tabValue || GettingStartedListItems.TEAMS);
    };

    useEffect(() => {
        setActiveTabFromHash();
    }, []);

    const getHeadersAndTableOrder = () => {
        switch (activeListItem) {
            case GettingStartedListItems.TEAMS:
                return TeamsTableOrder;
            case GettingStartedListItems.DEVELOPERS:
                return DevelopersTableOrder;
            default:
                return null;
        }
    };

    const getIcon = () => {
        switch (activeListItem) {
            case GettingStartedListItems.TEAMS:
                return <GroupAddIcon/>;
            case GettingStartedListItems.DEVELOPERS:
                return <PersonAddAlt1Icon/>;
            case GettingStartedListItems.ITERATIONS:
                return <AddIcon/>;
            default:
                return null;
        }
    };

    const getAddOnClick = () => {
        if (isTeamsActive) setIsAddTeamDialogOpen(true)
        if (isDevelopersActive) setIsAddDeveloperDialogOpen(true)
    }

    const {data: teamsData, refetch: refetchTeams} = useFetch({
        url: `/api/teams/`,
        config: {isFetchOnLoad: true,}
    })

    const {data: developersData, refetch: refetchDevelopers} = useFetch({
        url: `/api/developers/`,
        config: {isFetchOnLoad: true,}
    })


    const {refetch: handleEditOrDelete} = useFetch({
        url: `/api/${activeListItem.toLowerCase()}`,
        method: HttpRequestMethods[method],
        options: {
            body: method === HttpRequestMethods.DELETE ? JSON.stringify({id: itemID}) : JSON.stringify(editItem)
        },
        config: {watch: method && itemID},
        callback: () => {
            setEditItem(null)
            setItemID(null)
            setMethod(null)
            closeDialogs()
            reloadData()
        }
    })

    const getData = () => {
        if (isTeamsActive) return teamsData?.teams;
        if (isDevelopersActive) return developersData?.developers;
        return [];
    };

    const reloadData = () => {
        refetchDevelopers()
        refetchTeams()
    }

    const closeDialogs = () => {
        if (isDevelopersActive) setIsAddDeveloperDialogOpen(false)
        if (isTeamsActive) setIsAddTeamDialogOpen(false)
    }

    const handleItemSubmit = (newValue) => {
        if (itemID) {
            setEditItem(newValue)
            setMethod(HttpRequestMethods.PUT)
        } else reloadData();
    }

    const getWhichEditModalToOpen = (id) => {
        setItemID(id);
        switch (activeListItem) {
            case GettingStartedListItems.DEVELOPERS:
                return setIsAddDeveloperDialogOpen(true);
            case GettingStartedListItems.TEAMS:
                return setIsAddTeamDialogOpen(true);
            case GettingStartedListItems.ITERATIONS:
                return setIsAddDeveloperDialogOpen(true);
            default:
                return null;
        }
    }

    return <Container sx={{display: 'flex', alignItems: 'flex-start'}}>
        <Paper sx={{mr: 2}}>
            <Box sx={{width: '100%', maxWidth: 360}}>
                <nav>
                    <List disablePadding>
                        <GettingStartedListItem
                            divider={true}
                            icon={<GroupsIcon/>}
                            text={GettingStartedListItems.TEAMS}
                            onClick={setActiveListItem}
                            isActive={isTeamsActive}
                        />
                        <GettingStartedListItem
                            divider={true}
                            icon={<PersonIcon/>}
                            text={GettingStartedListItems.DEVELOPERS}
                            onClick={setActiveListItem}
                            isActive={isDevelopersActive}
                        />
                        <GettingStartedListItem
                            icon={<WorkspacesIcon/>}
                            text={GettingStartedListItems.ITERATIONS}
                            onClick={setActiveListItem}
                            isActive={isIterationsActive}
                        />
                    </List>
                </nav>
            </Box>
        </Paper>

        <GettingStartedTable headersAndTableOrder={getHeadersAndTableOrder()}
                             data={getData()}
                             addIcon={getIcon()}
                             setItemId={setItemID}
                             setMethod={setMethod}
                             onAdd={() => getAddOnClick()}
                             handleItem={handleEditOrDelete}
                             editItem={getWhichEditModalToOpen}
                             developerArray={developersData?.developers}
        />

        <CreateDeveloperDialog
            key={itemID + 'd'}
            onClose={() => {
                if (itemID) setItemID(null)
                if (editItem) setEditItem(null)
                closeDialogs()
            }}
            editingItem={developersData?.developers?.filter(developer => developer._id === itemID)[0]}
            open={isAddDeveloperDialogOpen}
            onSubmit={handleItemSubmit}
        />

        <CreateTeamDialog
            key={itemID + 't'}
            onClose={() => {
                if (itemID) setItemID(null)
                closeDialogs()
            }}
            developerArray={developersData?.developers}
            editingItem={teamsData?.teams?.filter(team => team._id === itemID)[0]}
            open={isAddTeamDialogOpen}
            onSubmit={handleItemSubmit}
        />
    </Container>
}

export default GettingStartedList