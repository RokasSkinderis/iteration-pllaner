import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {useRouter} from "next/router";

const GettingStartedListItem = ({icon, text, isActive, divider, onClick}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/#${text}`)
        onClick(text)
    };

    return <ListItem
        disablePadding divider={divider}
        selected={isActive}
        onClick={handleClick}
    >
        <ListItemButton>
            <ListItemAvatar>
                <Avatar>
                    {icon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={text}/>
        </ListItemButton>
    </ListItem>
}

export default GettingStartedListItem