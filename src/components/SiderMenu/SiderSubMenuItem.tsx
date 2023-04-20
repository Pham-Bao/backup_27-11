import React from 'react';
import SiderMenuItem from './SiderMenuItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import abpClient from '../abp-custom';
import { useLocation } from 'react-router-dom';
import './sider_menu.css';
import { Stack } from '@mui/material';
const SiderSubMenuItem = (MenuItem: any, lstPermission: string[]) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    const location = useLocation();
    if (abpClient.isGrandPermission(MenuItem.permission, lstPermission)) {
        return (
            <>
                <ListItemButton onClick={handleClick} className="active-menu-bg">
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                        className={
                            location.pathname === MenuItem.path ? 'active-menu-item' : 'menu-item'
                        }
                        style={{ width: '100%' }}>
                        <ListItemIcon
                            className={
                                location.pathname === MenuItem.path
                                    ? 'active-menu-item-icon'
                                    : 'menu-item-icon'
                            }>
                            {MenuItem.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={MenuItem.title}
                            className={
                                location.pathname === MenuItem.path
                                    ? 'active-menu-item-title'
                                    : 'menu-item-title'
                            }></ListItemText>
                    </Stack>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {MenuItem.children.map((menu: any) => {
                            if (menu.children.length > 0) {
                                return SiderSubMenuItem(menu.children, lstPermission);
                            }
                            return SiderMenuItem(menu, lstPermission);
                        })}
                    </List>
                </Collapse>
            </>
        );
    } else return null;
};

export default SiderSubMenuItem;
