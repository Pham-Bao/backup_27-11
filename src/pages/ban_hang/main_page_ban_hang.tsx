import { useState, useEffect } from 'react';
import { Grid, Box, Stack, Typography, ButtonGroup, Button } from '@mui/material';
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import TreeViewGroupProduct from '../../components/Treeview/ProductGroup';
import CustomersChecking from '../check_in/customer_checking';
import PageBanHang from './page_ban_hang';

import { ModelNhomHangHoa } from '../../services/product/dto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import GroupProductService from '../../services/product/GroupProductService';
import './style.css';
import { Guid } from 'guid-typescript';
import CheckInNew from './CheckInNew';
export default function MainPageBanHang() {
    const [activeTabProduct, setActiveTabProduc] = useState(false);
    const [nhomDichVu, setNhomDichVu] = useState<ModelNhomHangHoa[]>([]);
    const [nhomHangHoa, setNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [idNhomHang, setIdNhomHang] = useState('');

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const lstAll = [...list.items];
        setNhomDichVu(lstAll.filter((x) => !x.laNhomHangHoa));
        setNhomHangHoa(lstAll.filter((x) => x.laNhomHangHoa));
    };

    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };
    useEffect(() => {
        PageLoad();
    }, []);
    const choseNhomDichVu = (isEdit: boolean, item: any) => {
        setIdNhomHang(item.id);
    };
    const choseCustomer = (cus: any) => {
        setCusChosing((old: any) => {
            return {
                ...old,
                idCheckIn: cus.idCheckIn,
                idKhachHang: cus.idKhachHang,
                maKhachHang: cus.maKhachHang,
                tenKhachHang: cus.tenKhachHang,
                soDienThoai: cus.soDienThoai,
                tongTichDiem: cus.tongTichDiem
            };
        });
        setActiveTabProduc(true);
    };

    const [activeTab, setActiveTab] = useState(1);
    const handleTab = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };
    return (
        <>
            <Grid container padding={2} columnSpacing={2} rowSpacing={2}>
                <Grid item xs={3} sm={3} md={3} lg={12}>
                    <Stack display="column" spacing={3}>
                        <Stack direction="row">
                            {/* <SkipPrevious
                                className="btnToggleLeft"
                                onClick={() => setActiveTabProduc(false)}
                            />
                            <SkipNext
                                className="btnToggleRight"
                                onClick={() => setActiveTabProduc(true)}
                            /> */}
                            <ButtonGroup size="small">
                                <Button
                                    sx={{
                                        textTransform: 'unset',
                                        fontWeight: '400',
                                        color: activeTab == 1 ? '#fff' : '#999699',
                                        backgroundColor:
                                            activeTab == 1 ? '#7C3367!important' : '#F2EBF0',
                                        border: 'unset!important'
                                    }}
                                    onClick={() => handleTab(1)}
                                    className={activeTab === 1 ? 'active' : ''}
                                    variant={activeTab === 1 ? 'contained' : 'outlined'}>
                                    Checkin
                                </Button>
                                <Button
                                    sx={{
                                        textTransform: 'unset',
                                        fontWeight: '400',
                                        color: activeTab == 2 ? '#fff' : '#999699',
                                        border: 'unset!important',
                                        backgroundColor:
                                            activeTab == 2 ? '#7C3367!important' : '#F2EBF0'
                                    }}
                                    onClick={() => handleTab(2)}
                                    className={activeTab === 2 ? 'active' : ''}
                                    variant={activeTab === 2 ? 'contained' : 'outlined'}>
                                    Thanh toán
                                </Button>
                            </ButtonGroup>
                        </Stack>
                        {/* {activeTabProduct && (
                            <>
                                <Box>
                                    <Typography
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            paddingBottom: '12px'
                                        }}>
                                        Nhóm dịch vụ
                                    </Typography>
                                    <TreeViewGroupProduct
                                        dataNhomHang={nhomDichVu}
                                        clickTreeItem={choseNhomDichVu}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            paddingBottom: '12px'
                                        }}>
                                        Nhóm hàng hóa
                                    </Typography>
                                </Box>
                            </>
                        )} */}
                    </Stack>
                </Grid>
                {/* {!activeTabProduct && <CustomersChecking hanleChoseCustomer={choseCustomer} />}
                {activeTabProduct && (
                    <PageBanHang customerChosed={cusChosing} idNhomHang={idNhomHang} />
                )} */}
                {activeTab === 1 && <CheckInNew />}
                {activeTab === 2 && <PageBanHang />}
            </Grid>
        </>
    );
}
