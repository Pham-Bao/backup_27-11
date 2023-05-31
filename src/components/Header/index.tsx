// import { Avatar, Badge, Col, Dropdown, Layout, Menu, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import avatar from '../../images/user.png';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    HomeOutlined,
    DownOutlined,
    BellOutlined,
    MessageOutlined
} from '@ant-design/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Menu,
    Stack,
    Button,
    Badge,
    Container,
    Avatar,
    IconButton,
    TextareaAutosize,
    ButtonGroup,
    Breadcrumbs,
    Dialog
} from '@mui/material';
import './header.css';
// import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MessageIcon from '../../images/message-question.svg';
import NotificationIcon from '../../images/notification.svg';
import { ReactComponent as ToggleIcon } from '../../images/toggleIcon.svg';
import http from '../../services/httpService';
import Cookies from 'js-cookie';
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggle }, props: HeaderProps) => {
    const { onClick } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const defaultPermission: string[] = [];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    useEffect(() => {
        // Call API to get list of permissions here
        // Example:
        const userId = Cookies.get('userId');
        const token = Cookies.get('accessToken');
        const encryptedAccessToken = Cookies.get('encryptedAccessToken');
        http.post(`api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`, {
            headers: {
                accept: 'text/plain',
                Authorization: 'Bearer ' + token,
                'X-XSRF-TOKEN': encryptedAccessToken
            }
        })
            .then((response) => {
                setListPermission(response.data.result['permissions']);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <Box
            display="flex"
            className="header"
            // style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        >
            {' '}
            <Grid container className={'header-container'} justifyContent="space-between">
                <Grid item sx={{ textAlign: 'left', display: 'flex' }}>
                    <Button
                        sx={{
                            minWidth: 'unset!important',
                            marginLeft: '32px',
                            '& svg': {
                                transform: collapsed ? 'rotate(0deg)' : 'rotate(-180deg)',
                                transition: '.4s'
                            }
                        }}
                        onClick={toggle}>
                        <ToggleIcon />
                    </Button>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }}>
                    <Box display="flex" sx={{ marginRight: '30px', alignItems: 'center' }}>
                        <Badge style={{ margin: '0px 8px 0px 8px' }}>
                            <Button
                                sx={{
                                    minWidth: 'unset!important'
                                }}>
                                <img src={MessageIcon} alt="Message" />
                            </Button>
                        </Badge>
                        <Badge style={{ margin: '0px 8px 0px 8px' }} color="error">
                            <Button sx={{ minWidth: 'unset!important' }}>
                                <img src={NotificationIcon} alt="notification" />
                            </Button>
                        </Badge>
                        <div style={{ marginLeft: '32px', marginRight: 8 }}>
                            <div className="store-name">Nail Spa</div>
                            <div className="branch-name">Hà nội</div>
                        </div>
                        <Button
                            id="btnAuthor"
                            aria-controls={open ? 'author' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}>
                            <Avatar src={avatar} sx={{ height: 36, width: 36 }} alt={'profile'} />
                        </Button>

                        <Menu
                            open={open}
                            id="author"
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'btnAuthor'
                            }}>
                            <MenuItem onClick={handleClose}>
                                <Link
                                    to="/login"
                                    onClick={() => {
                                        Object.keys(Cookies.get()).forEach((cookieName) => {
                                            Cookies.remove(cookieName);
                                        });
                                    }}>
                                    <LogoutIcon />
                                    <span> Logout </span>
                                </Link>
                            </MenuItem>
                        </Menu>
                        {!open && <ExpandMoreIcon />}
                        {open && <ExpandLessIcon />}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default Header;
