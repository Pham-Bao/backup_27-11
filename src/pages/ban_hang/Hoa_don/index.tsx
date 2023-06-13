import React from 'react';
import { useState } from 'react';
import { Grid, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as InIcon } from '../../../images/printer.svg';
import Avatar from '../../../images/xinh.png';
import TabInfo from './Tab_info';
import TabDiary from './Tab_diary';
import { ReactComponent as ArrowIcon } from '../../../images/arrow_back.svg';
import ModalWarning from './Modal_warning';
const HoaDon: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const Infomations = [
        { title: 'Mã hóa đơn', value: 'HD4545675' },
        {
            value: '30/06/2023  08:30',
            title: 'Ngày lập'
        },
        {
            title: 'Chi nhánh',
            value: 'Chi nhánh 1'
        },
        {
            title: 'Người tạo',
            value: 'Đinh Tuấn Tài'
        },
        {
            title: 'Nguời bán',
            value: 'Tài Đinh Tuấn'
        }
    ];
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: any, newValue: number) => {
        setActiveTab(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <Box role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </Box>
        );
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'calc(100vh - 70px)'
            }}>
            <ModalWarning open={openDialog} onClose={handleCloseDialog} />
            <Box padding="16px 2.2222222222222223vw ">
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs="auto">
                        <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                            Hóa đơn
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Box display="flex" gap="8px">
                            <Button
                                startIcon={<InIcon />}
                                variant="outlined"
                                sx={{
                                    bgcolor: '#fff!important',
                                    color: '#666466',
                                    borderColor: '#E6E1E6!important'
                                }}>
                                In
                            </Button>
                            <Button
                                startIcon={<UploadIcon />}
                                variant="outlined"
                                sx={{
                                    bgcolor: '#fff!important',
                                    color: '#666466',
                                    borderColor: '#E6E1E6!important'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#7C3367!important',
                                    color: '#fff'
                                }}>
                                Sao chép
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    container
                    sx={{
                        mt: '16px',
                        boxShadow: '0px 4px 20px 0px #AAA9B81A',
                        borderRadius: '12px',
                        padding: '24px 24px 0px 24px',
                        bgcolor: '#fff',
                        alignItems: 'center'
                    }}>
                    <Grid item xs={1.5}>
                        <Box
                            sx={{
                                borderRadius: '6px',
                                '& img': {
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'cover'
                                }
                            }}>
                            <img width={100} src={Avatar} alt="avatar" />
                        </Box>
                    </Grid>
                    <Grid item xs={10.5}>
                        <Box display="flex" gap="23px" mb="12px">
                            <Typography
                                variant="h4"
                                color="#3B4758"
                                fontWeight="700"
                                fontSize="24px">
                                Đinh Tuấn Tài
                            </Typography>
                            <Box
                                sx={{
                                    padding: '2px 3px',
                                    borderRadius: '100px',
                                    color: '#0DA678',
                                    bgcolor: '#CAFBEC',
                                    width: 'fit-content',
                                    fontSize: '12px',
                                    height: 'fit-content'
                                }}>
                                Hoàn thành
                            </Box>
                        </Box>
                        <Grid container>
                            {Infomations.map((item) => (
                                <Grid item xs={2.4} key={item.title.replace(/\s/g, '')}>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400">
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontSize="14px"
                                        color="#333233"
                                        marginTop="2px">
                                        {item.value}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid xs={12} item>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                borderTop: '1px solid #EEF0F4',
                                paddingTop: '16px',
                                marginTop: '20px',
                                '& .MuiTabs-flexContainer': {
                                    gap: '32px'
                                },
                                '& button': {
                                    textTransform: 'unset',
                                    color: '#999699',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    padding: '0',
                                    minWidth: 'unset',
                                    minHeight: 'unset'
                                },
                                '& .Mui-selected': {
                                    color: '#7C3367!important'
                                },
                                '& .MuiTabs-indicator': {
                                    bgcolor: '#7C3367'
                                }
                            }}>
                            <Tab label="Thông tin" />
                            <Tab label="Nhật ký thanh toán" />
                        </Tabs>
                    </Grid>
                </Grid>
                <Box sx={{ mt: '40px' }}>
                    <TabPanel value={activeTab} index={0}>
                        <TabInfo />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <TabDiary />
                    </TabPanel>
                </Box>
            </Box>
            <Box
                sx={{
                    bgcolor: '#fff',
                    width: '100%',
                    padding: '24px 32px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                <Box>
                    <Button
                        startIcon={<ArrowIcon />}
                        variant="outlined"
                        sx={{ color: '#3B4758', borderColor: '#3B4758!important' }}>
                        Đóng
                    </Button>
                </Box>
                <Box display="flex" gap="8px">
                    <Button
                        variant="outlined"
                        sx={{ borderColor: '#7C3367!important', color: '#4C4B4C' }}>
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#7C3367!important', color: '#fff' }}>
                        Lưu
                    </Button>
                    <Button
                        onClick={handleOpenDialog}
                        variant="contained"
                        sx={{ bgcolor: '#FF316A!important', color: '#fff' }}>
                        Hủy bỏ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
export default HoaDon;