/* eslint-disable @typescript-eslint/no-explicit-any */
import MainAppLayout from '../layouts/MainAppLayout';
import AnonymousLayout from '../layouts/AnonymousLayout';
import renderRoutes from './generate-routes';
// icon
import { BallotOutlined } from '@mui/icons-material';
import { IoCalendarOutline, IoStorefrontOutline } from 'react-icons/io5';

import { BsDot, BsPeople, BsPersonLock } from 'react-icons/bs';
import LoadableComponent from '../Loadable';
import { ReactNode } from 'react';
import { ReactComponent as HomeIcon2 } from '../../images/home-2.svg';
import { ReactComponent as CalendarIcon2 } from '../../images/calendarMenu.svg';
import { ReactComponent as ServicesIcon } from '../../images/serviceMenuIcon.svg';
import { ReactComponent as ShopIcon } from '../../images/shopMenu.svg';
import { ReactComponent as ClientIcon } from '../../images/personalcardIcon.svg';
import { ReactComponent as EmployeeIcon } from '../../images/employeeIcon.svg';
import { ReactComponent as ReportIcon } from '../../images/reportIcon.svg';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as AdminIcon } from '../../images/admin77.svg';
type RenderRouteProps = {
    layout: React.ElementType;
    name: string;
    routes: RouteProps[];
};
type RouteProps = {
    path: string;
    name: string;
    permission: string;
    title: string;
    icon: ReactNode;
    children: RouteProps[];
    showInMenu: boolean;
    isLayout: boolean;
    component: any;
};
export type AppRouteProps = {
    mainRoutes: RenderRouteProps[];
};

export const appRouters: AppRouteProps = {
    mainRoutes: [
        {
            layout: AnonymousLayout,
            name: 'AnonymousLayout',
            routes: [
                {
                    path: '/login',
                    name: 'login',
                    permission: '',
                    children: [],
                    title: 'Login',
                    icon: '',
                    component: LoadableComponent(() => import('../../pages/login')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/',
                    name: 'login',
                    permission: '',
                    children: [],
                    title: 'Login',
                    icon: '',
                    component: LoadableComponent(() => import('../../pages/login')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/register',
                    name: 'register',
                    permission: '',
                    children: [],
                    title: 'Register',
                    icon: null,
                    component: LoadableComponent(() => import('../../pages/register')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/forgot-password',
                    name: 'forgotPassword',
                    permission: '',
                    children: [],
                    title: 'Forgot password',
                    icon: null,
                    component: LoadableComponent(() => import('../../pages/Forgot_password')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/exception?:type',
                    permission: '',
                    title: 'exception',
                    icon: null,
                    name: 'exception',
                    showInMenu: false,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/Exception'))
                }
            ]
        },
        {
            layout: MainAppLayout,
            name: 'MainAppLayout',
            routes: [
                {
                    path: '/home',
                    name: 'home',
                    permission: '',
                    title: 'Home',
                    icon: null,
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew')),
                    children: [],
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/home',
                    name: 'dashboard',
                    permission: '',
                    title: 'Trang chủ',
                    icon: <HomeIcon2 width="20px" />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: '/lich-hens',
                    name: 'lich hen',
                    permission: '',
                    title: 'Lịch hẹn',
                    icon: <CalendarIcon2 width="20px" />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/lich-hen/'))
                },
                {
                    path: '/ban-hangs',
                    name: 'banhang',
                    permission: '',
                    title: 'Bán hàng',
                    icon: <ShopIcon width="20px" />,
                    children: [
                        {
                            path: '/page-ban-hang',
                            permission: '',
                            title: 'Thu ngân',
                            name: 'thungan',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            children: [],
                            showInMenu: false,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/main_page_ban_hang')
                            )
                        }
                    ],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/khach-hangs',
                    permission: '',
                    title: 'Khách hàng',
                    name: 'khachhang',
                    icon: <ClientIcon width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/customer/indexNew'))
                },
                {
                    path: '/dich-vus',
                    permission: '',
                    title: 'Dich vụ',
                    icon: <ServicesIcon width="20px" />,
                    name: 'dichvu',
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/product/pageProductNew'))
                },
                {
                    path: 'employee',
                    permission: '',
                    title: 'Nhân viên',
                    name: 'nhanvien',
                    icon: <EmployeeIcon width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/nhan-viens',
                            permission: '',
                            title: 'Quản lý nhân viên',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/employee'))
                        },
                        {
                            path: '/nghi-le-nhan-viens',
                            permission: '',
                            title: 'Thời gian nghỉ',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(
                                () => import('../../pages/employee/thoi-gian-nghi')
                            )
                        }
                    ],
                    component: null
                },
                {
                    path: '/bao-cao',
                    permission: '',
                    title: 'Báo cáo',
                    name: 'baocao',
                    icon: <ReportIcon width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: 'admin',
                    permission: 'Pages.Administration',
                    title: 'Quản trị',
                    icon: <AdminIcon width="20px" />,
                    name: 'QuanTri',
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/users',
                            permission: 'Pages.Administration.Users',
                            title: 'Users',
                            name: 'user',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            children: [],
                            showInMenu: true,
                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/user'))
                        },
                        {
                            path: '/roles',
                            permission: 'Pages.Administration.Roles',
                            title: 'Roles',
                            name: 'role',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/role'))
                        },
                        {
                            path: '/tenants',
                            permission: 'Pages.Tenants',
                            title: 'Tenants',
                            name: 'tenant',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            children: [],

                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/tenant/index'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/settings',
                    permission: 'Pages.CongTy',
                    title: 'Cài đặt',
                    name: 'caidat',
                    icon: <SettingIcon width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/settings/indexNew'))
                }
            ]
        }
    ]
};

function flattenRoutes(routes: RouteProps[], flatList: RouteProps[] = []) {
    routes.forEach((route) => {
        flatList.push(route);
        if (route.children) {
            flattenRoutes(route.children, flatList);
        }
    });
    return flatList;
}

export const flatRoutes = flattenRoutes(appRouters.mainRoutes.flatMap((r: any) => r.routes));
export const Routes = renderRoutes();
