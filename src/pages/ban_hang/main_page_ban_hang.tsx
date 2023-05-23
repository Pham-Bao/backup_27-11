import { useState } from 'react';
import { Grid, ButtonGroup, Button } from '@mui/material';
import CheckInNew from './CheckInNew';
import PageBanHang from './PageBanHangNew';

import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import './style.css';
import { Guid } from 'guid-typescript';

export default function MainPageBanHang() {
    const [activeTab, setActiveTab] = useState(1);

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );

    const handleTab = (tabIndex: number) => {
        setActiveTab(tabIndex);
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
        setActiveTab(2);
    };

    return (
        <>
            <Grid container padding={2} columnSpacing={2} rowSpacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                    <ButtonGroup>
                        <Button
                            sx={{
                                textTransform: 'unset',

                                color: activeTab == 1 ? '#fff' : '#999699',
                                backgroundColor: activeTab == 1 ? '#7C3367!important' : '#F2EBF0',
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

                                color: activeTab == 2 ? '#fff' : '#999699',
                                border: 'unset!important',
                                backgroundColor: activeTab == 2 ? '#7C3367!important' : '#F2EBF0'
                            }}
                            onClick={() => handleTab(2)}
                            className={activeTab === 2 ? 'active' : ''}
                            variant={activeTab === 2 ? 'contained' : 'outlined'}>
                            Thanh toán
                        </Button>
                    </ButtonGroup>
                </Grid>
                {activeTab === 1 && <CheckInNew hanleChoseCustomer={choseCustomer} />}
                {activeTab === 2 && <PageBanHang customerChosed={cusChosing} />}
            </Grid>
        </>
    );
}
