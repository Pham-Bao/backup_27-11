import { Col, Row, Space, Tabs, TabsProps } from 'antd';
import { Component, ReactNode } from 'react';
import CustomerScreen from '../customer';
import StoreDetail from './cua-hang';
import ChiNhanhScreen from './chi-nhanh';
import HoaHongNhanVienScreen from './hoa-hong-nhan-vien/chiet-khau-dich-vu';
import CaiDatHoaHongScreen from './hoa-hong-nhan-vien';
class SettingScreen extends Component {
    render(): ReactNode {
        return (
            <div className="container-fluid bg-white">
                <div className="page-header">
                    <Row align={'middle'} justify={'space-between'}>
                        <Col span={12}>
                            <div>
                                <div className="pt-2">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Cài đặt
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Cài đặt cửa hàng
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Cài đặt cửa hàng</h3>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-content pt-2">
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={'left'}
                        style={{ height: '100%' }}
                        items={[
                            {
                                label: 'Cài đặt cửa hàng',
                                key: '',
                                disabled: true
                            },
                            {
                                label: 'Chi tiết cửa hàng',
                                key: '1',
                                children: <StoreDetail />
                            },
                            {
                                label: 'Quản lý chi nhánh',
                                key: '2',
                                children: <ChiNhanhScreen />
                            },
                            {
                                label: 'Cài đặt booking',
                                key: '3',
                                children: `đây là chi tiết cửa hàng`
                            },
                            {
                                label: 'Hoa hồng nhân viên',
                                key: '4',
                                children: <CaiDatHoaHongScreen />
                            },
                            {
                                label: 'Phương thức thanh toán',
                                key: '5',
                                children: <CustomerScreen />
                            },
                            {
                                label: 'Mẫu hóa đơn',
                                key: '6',
                                children: `đây là chi tiết cửa hàng`
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}
export default SettingScreen;
