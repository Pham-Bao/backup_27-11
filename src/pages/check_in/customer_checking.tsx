import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import { Add, Menu, CalendarMonth, MoreHoriz, QueryBuilder } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import { PropModal } from '../../utils/PropParentToChild';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';

import '../../App.css';
import { Guid } from 'guid-typescript';
import Utils from '../../utils/utils';
import CheckinService from '../../services/check_in/CheckinService';
import ModelNhanVienThucHien from '../nhan_vien_thuc_hien/modelNhanVienThucHien';
const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: '#7C3367'
                }
            }
        }
    }
});

export default function CustomersChecking({ hanleChoseCustomer }: any) {
    const history = useNavigate();

    const [cusChecking, setCusChecking] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );
    const [listCusChecking, setListCusChecking] = useState<PageKhachHangCheckInDto[]>([]);

    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const GetListCustomerChecking = async () => {
        const input = { keyword: '', SkipCount: 0, MaxResultCount: 50 };
        const list = await CheckinService.GetListCustomerChecking(input);
        setListCusChecking(list);
    };

    const PageLoad = () => {
        GetListCustomerChecking();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const saveCheckInOK = (dataCheckIn: any) => {
        console.log('saveCheckInOK ', dataCheckIn);

        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn.id,
            idCheckIn: dataCheckIn.idCheckIn,
            maKhachHang: dataCheckIn.maKhachHang,
            tenKhachHang: dataCheckIn.tenKhachHang,
            soDienThoai: dataCheckIn.soDienThoai,
            tongTichDiem: dataCheckIn.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn
        });
        console.log('cusChecking ', cusChecking);
        setListCusChecking([...listCusChecking, cusChecking]);

        // // save cache checkin
        // const lcCheckIn = localStorage.getItem('lcCusCheckIn');
        // let arr = [];
        // if (!Utils.checkNull(lcCheckIn)) {
        //     arr = JSON.parse(lcCheckIn ?? '');
        // }
        // // remove & add again
        // arr = arr.filter((x: any) => x.idCheckIn !== idCheckin);
        // arr.push(cusChecking);
        // localStorage.setItem('lcCusCheckIn', JSON.stringify(arr));
    };

    const handleClickCustomer = (item: any) => {
        setCusChecking((old: any) => {
            return {
                ...old,
                idKhachHang: item.id,
                maKhachHang: item.maKhachHang,
                tenKhachHang: item.tenKhachHang,
                soDienThoai: item.soDienThoai,
                tongTichDiem: item.tongTichDiem
            };
        });
        hanleChoseCustomer(item);
    };
    return (
        <>
            <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            <ModelNhanVienThucHien />
            <Grid item xs={9} sm={9} md={9} lg={10} display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={1}>
                    <Menu className="btnIcon" />
                    <CalendarMonth className="btnIcon" />
                    <Button
                        variant="contained"
                        className="btnIconText"
                        startIcon={<Add />}
                        sx={{ bgcolor: '#7c3367' }}
                        onClick={() => {
                            setTriggerAddCheckIn({ ...triggerAddCheckIn, isShow: true });
                        }}>
                        Thêm khách
                    </Button>
                </Stack>
            </Grid>
            {/* start */}
            {listCusChecking.map((item: any, index: any) => (
                <Grid
                    key={index}
                    item
                    xs={4}
                    sm={3}
                    md={2}
                    lg={2}
                    onClick={() => {
                        handleClickCustomer(item);
                    }}>
                    <Grid container border={1} borderColor="red" className="infor-cus" padding={2}>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={10} lg={11}>
                                <Stack direction="row" spacing={1}>
                                    <ThemeProvider theme={shortNameCus}>
                                        <Button variant="outlined">TM</Button>
                                    </ThemeProvider>
                                    <Stack>
                                        <Typography className="cusname">
                                            {item.tenKhachHang}
                                        </Typography>
                                        <Typography className="cusphone" sx={{ color: '#acaca5' }}>
                                            {item.soDienThoai}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={1}>
                                <MoreHoriz />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">Điểm tích lũy:</Typography>
                                    <Typography className="cusname">{item.tongTichDiem}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={9} lg={9}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">{item.dateCheckIn}</Typography>
                                    <Box>
                                        <QueryBuilder
                                            style={{ fontSize: '14px', marginTop: '-5px' }}
                                        />
                                    </Box>
                                    <Typography className="cusname">{item.timeCheckIn}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} style={{ textAlign: 'right' }}>
                                <Typography className="cusstatus" sx={{ color: '#a1a103' }}>
                                    {item.txtTrangThaiCheckIn}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ))}

            {/* end */}
        </>
    );
}
