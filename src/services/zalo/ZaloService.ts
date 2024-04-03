import axios from 'axios';
import {
    IInforUserZOA,
    IMemberZOA,
    ITemplateZNS,
    IZaloDataSend,
    IZalo_InforHoaDon,
    InforZOA,
    ZaloAuthorizationDto
} from './zalo_dto';
import http from '../httpService';
import { format } from 'date-fns';
import utils from '../../utils/utils';
import uploadFileService from '../uploadFileService';
import { CustomerSMSDto } from '../sms/gui_tin_nhan/gui_tin_nhan_dto';
import { LoaiTin } from '../../lib/appconst';
import { IZaloTemplate } from './ZaloTemplateDto';

class ZaloService {
    GuitinTuVan_fromDB = async (input: CustomerSMSDto, access_token = '') => {
        const result = await http.post(
            `api/services/app/ZaloAuthorization/GuiTinTuVan?accessToken=${access_token}`,
            input
        );
        return result.data.result;
    };
    GuiTinGiaoDich_fromDataDB = async (input: CustomerSMSDto, access_token = '', idLoaiTin = LoaiTin.TIN_SINH_NHAT) => {
        const result = await http.post(
            `api/services/app/ZaloAuthorization/GuiTinGiaoDich_fromDataDB?accessToken=${access_token}&idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    GuiTinGiaoDich = async (input: CustomerSMSDto, access_token = '') => {
        const result = await http.post(
            `api/services/app/ZaloAuthorization/GuiTinGiaoDich?accessToken=${access_token}`,
            input
        );
        return result.data.result;
    };
    SendMessageToUser = async (access_token = '') => {
        const result = await http.post(
            `api/services/app/ZaloAuthorization/SendMessageToUser?accessToken=${access_token}`
        );
        return result.data.result;
    };
    Zalo_GetInforHoaDon = async (arrIdHoaDon: string[]): Promise<IZalo_InforHoaDon[] | null> => {
        if (arrIdHoaDon.length == 0) return null;
        const result = await http.post('api/services/app/HoaDon/Zalo_GetInforHoaDon?arrIdHoaDon=', arrIdHoaDon);
        return result.data.result;
    };
    CreateCodeVerifier_andCodeChallenge = async (): Promise<ZaloAuthorizationDto> => {
        // use c#
        const result = await http.get(`api/services/app/ZaloAuthorization/CreateCodeVerifier_andCodeChallenge`);
        return result.data.result;
    };
    GenerateCodeVerifier = () => {
        /**
         * This function generates a random code verifier for PKCE (Proof Key for Code Exchange).
         * It generates a random string of 43 characters using the characters A-Z, a-z, 0-9, "-", and "_".
         *
         * Returns:
         * string: The generated code verifier
         */
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
        let codeVerifier = '';

        for (let i = 0; i < 43; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            codeVerifier += characters[randomIndex];
        }

        return codeVerifier;
    };

    CreateCodeVerifier = (): string => {
        // Tạo một chuỗi ngẫu nhiên có độ dài 40 byte
        let array = new Uint8Array(40);
        array = globalThis.crypto.getRandomValues(array);
        // fromCharCode: chuyen thanh ky tu Unicode
        const xx = String.fromCharCode.apply(null, Array.from(array));
        return this.base64URLEncode(xx);
    };
    base64URLEncode = (str: string): string => {
        const b64 = btoa(str);
        const encoded = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return encoded;
    };
    sha256 = async (input: string): Promise<string> => {
        const encodedInput = new TextEncoder().encode(input);
        const hashedArrayBuffer = await globalThis.crypto.subtle.digest('SHA-256', encodedInput);
        const hashedString = Array.prototype.map
            .call(new Uint8Array(hashedArrayBuffer), (x) => ('00' + x.toString(16)).slice(-2))
            .join('');
        return hashedString;
    };
    GenerateCodeChallenge = async (code_verifier: string) => {
        // hàm này chỉ áp dụng cho https
        // nên đã viết thêm hàm cho code verifier + challenge trong c#
        const hashArray = await globalThis.crypto.subtle.digest(
            { name: 'SHA-256' },
            new TextEncoder().encode(code_verifier)
        );
        const uIntArray = new Uint8Array(hashArray);
        const numberArray = Array.from(uIntArray);
        const hashString = String.fromCharCode.apply(null, numberArray);
        return this.base64URLEncode(hashString);
    };

    GetNewAccessToken_fromRefreshToken = async (refresh_token = '') => {
        const param = {
            refresh_token: refresh_token,
            app_id: process.env.REACT_APP_ZALO_APP_ID,
            grant_type: 'refresh_token'
        };
        const xx = await axios.post(`https://oauth.zaloapp.com/v4/oa/access_token`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                secret_key: process.env.REACT_APP_ZALO_APP_SECRET
            }
        });
        console.log(xx);
        return xx.data;
    };
    GetInfor_ZaloOfficialAccount = async (access_token = ''): Promise<InforZOA> => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getoa`, {
            headers: {
                access_token: access_token
            }
        });
        if (xx.data.error === 0) {
            const dataOA = xx.data.data;
            return {
                oaid: dataOA?.oaid,
                name: dataOA?.name,
                description: xx.data.description,
                oa_alias: dataOA?.oa_alias,
                oa_type: dataOA?.oa_type,
                num_follower: dataOA?.num_follower,
                avatar: dataOA?.avatar,
                package_valid_through_date: dataOA?.package_valid_through_date,
                package_auto_renew_date: dataOA?.package_auto_renew_date,
                linked_ZCA: dataOA?.linked_ZCA
            } as InforZOA;
        }
        return {} as InforZOA;
    };
    GetAccessToken_fromAuthorizationCode = async (athorization_code = '', code_verifier = '') => {
        const param = {
            code: athorization_code,
            app_id: process.env.REACT_APP_ZALO_APP_ID,
            code_verifier: code_verifier,
            grant_type: 'authorization_code'
        };
        const xx = await axios.post(`https://oauth.zaloapp.com/v4/oa/access_token`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                secret_key: process.env.REACT_APP_ZALO_APP_SECRET
            }
        });
        console.log('GetAccessToken_fromAuthorizationCode ', xx, param);
        return {
            access_token: xx.data.access_token,
            refresh_token: xx.data.refresh_token,
            expires_in: xx.data.expires_in
        };
    };
    // danh sách các mẫu template
    GetList_TempFromZNS = async (access_token: string): Promise<ITemplateZNS[]> => {
        const result = await axios.get(`https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=2`, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        return result.data.data;
    };
    GetZNSTemplate_byId = async (access_token: string, zns_template_id = '320131') => {
        const result = await axios.get(
            `https://business.openapi.zalo.me/template/info?template_id=${zns_template_id}`,
            {
                headers: {
                    access_token: access_token,
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data.data;
    };
    AssignData_toZNSTemplete = async (
        access_token: string,
        zns_template_id = '320131',
        dataSend: IZaloDataSend = {} as IZaloDataSend
    ) => {
        const dataTemp = await this.GetZNSTemplate_byId(access_token, zns_template_id);
        const tempdata: any = {};
        for (let i = 0; i < dataTemp?.listParams?.length; i++) {
            const key = dataTemp?.listParams[i]?.name;
            tempdata[key] = '';

            switch (key) {
                case 'TenKhachHang':
                    tempdata[key] = dataSend?.tenKhachHang ?? 'nhuongdt';
                    break;
                case 'SoDienThoai':
                    tempdata[key] = dataSend?.soDienThoai ?? 'nhuongdt';
                    break;
                case 'MaHoaDon':
                    tempdata[key] = dataSend?.maHoaDon ?? 'HD001';
                    break;
                case 'NgayLapHoaDon':
                    tempdata[key] = dataSend?.ngayLapHoaDon ?? '15:00 20/03/2024';
                    break;
                case 'TongTienHang':
                    tempdata[key] = new Intl.NumberFormat('vi-VN').format(dataSend?.tongTienHang ?? 0) ?? '5.000.000';
                    break;
                case 'BookingDate':
                    tempdata[key] = dataSend?.bookingDate ?? '15:45 19/03/2024';
                    break;
                case 'TenDichVu':
                    tempdata[key] = dataSend?.tenDichVu ?? 'Nhuộm + gội test';
                    break;
                case 'TenChiNhanh':
                    tempdata[key] = dataSend?.tenChiNhanh ?? '31 Lê Văn Lương';
                    break;
                case 'DiaChiCuaHang':
                    tempdata[key] = dataSend?.diaChiChiNhanh ?? '31 Lê Văn Lương';
                    break;
            }
        }
        return tempdata;
    };
    DevMode_GuiTinNhanGiaoDich_ByTempId = async (
        access_token: string,
        zns_template_id = '320131',
        dataSend: IZaloDataSend = {} as IZaloDataSend
    ) => {
        // lấy mẫu zns
        const tempdata = await this.AssignData_toZNSTemplete(access_token, zns_template_id, dataSend);
        const param = {
            // mode: 'development',
            phone: dataSend?.soDienThoai,
            template_id: zns_template_id,
            template_data: tempdata
        };
        const result = await axios.post(`https://business.openapi.zalo.me/message/template`, param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('DevMode_GuiTinNhan_ByTempId', result.data);
        return {
            msg_id: result.data.msg_id,
            sent_time: result.data.sent_time,
            error: result.data.error
        };
    };
    // TODO HASHPHONE
    GuiTinNhan_HasPhone = async (access_token: string, zns_template_id = '320131') => {
        const tempdata = await this.AssignData_toZNSTemplete(access_token, zns_template_id);
        const hasPhone = await this.sha256('+84355599770');
        console.log('hasphobne ', hasPhone);
        const param = {
            phone: hasPhone,
            template_id: zns_template_id,
            template_data: tempdata
        };
        const result = await axios.post(`https://business.openapi.zalo.me/message/template/hashphone`, param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('GuiTinNhan_HasPhone', result.data);
    };

    GuiTinNhanGiaoDich_WithMyTemp = async (
        access_token: string,
        user_id: string,
        dataSend: IZaloDataSend = {} as IZaloDataSend
    ) => {
        const param = {
            recipient: {
                user_id: user_id
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'transaction_transaction',
                        language: 'VI',
                        elements: [
                            { type: 'banner', image_url: dataSend?.logoChiNhanh },
                            { type: 'header', content: 'Thông báo giao dịch' },
                            {
                                type: 'text',
                                content: `Xin chào ${dataSend?.tenKhachHang}, cảm ơn bạn đã mua hàng tại cửa hàng. Chúng tôi đã ghi nhận thanh toán của bạn với chi tiết như sau:`
                            },
                            {
                                type: 'table',
                                content: [
                                    { key: 'Mã đơn', value: dataSend?.maHoaDon },
                                    {
                                        key: 'Ngày mua hàng',
                                        value: format(
                                            new Date(dataSend?.ngayLapHoaDon ?? new Date()),
                                            'HH:mm dd/MM/yyyy'
                                        )
                                    },
                                    {
                                        key: 'Tổng tiền',
                                        value: new Intl.NumberFormat('vi-VN').format(dataSend?.tongTienHang ?? 0)
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            {
                                type: 'oa.open.url',
                                // type: 'oa.query.show',
                                title: 'Xem chi tiết đơn hàng',
                                // payload: 'ABC'
                                payload: {
                                    url: `${process.env.REACT_APP_APP_BASE_URL}/giao-dich-thanh-toan`
                                }
                            }
                        ]
                    }
                }
            }
        };
        console.log('GuiTinNhanGiaoDich_WithMyTemp ', param);

        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/transaction', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('zalo test ', result.data);
        return result.data;
    };
    GuiTinNhanXacNhanLichHen_WithMyTemp = async (
        access_token: string,
        user_id: string,
        dataSend: IZaloDataSend = {} as IZaloDataSend
    ) => {
        let tableContent = [
            { key: 'Mã đặt lịch', value: dataSend?.soDienThoai },
            { key: 'Tên khách hàng', value: dataSend?.tenKhachHang },
            {
                key: 'Ngày đặt',
                value: format(new Date(dataSend?.bookingDate ?? new Date()), 'HH:mm dd/MM/yyyy')
            },
            { key: 'Tên dịch vụ', value: dataSend?.tenDichVu },
            { key: 'Địa chỉ cơ sở', value: dataSend?.diaChiChiNhanh }
        ];
        // chỉ lấy nếu có giá trị
        tableContent = tableContent?.filter((x) => !utils.checkNull(x.value));

        const param = {
            recipient: {
                user_id: user_id
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'transaction_booking',
                        language: 'VI',
                        elements: [
                            { type: 'banner', image_url: dataSend?.logoChiNhanh },
                            { type: 'header', content: 'Xác nhận lịch hẹn' },
                            {
                                type: 'text',
                                content: `Cảm ơn quý khách đã đặt lịch sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận với chi tiết như sau`
                            },
                            {
                                type: 'table',
                                content: tableContent
                            }
                        ],
                        buttons: [
                            {
                                type: 'oa.open.phone',
                                title: 'Liên hệ CSKH',
                                payload: {
                                    phone_code: dataSend?.sdtChiNhanh
                                }
                            }
                        ]
                    }
                }
            }
        };
        console.log('GuiTinNhanXacNhanLichHen_WithMyTemp ', param);

        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/transaction', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('zalo test ', result.data);
        return result.data;
    };
    GuiTinNhanChucMungSinhNhat_WithMyTemp = async (
        access_token: string,
        user_id: string,
        dataSend: IZaloDataSend = {} as IZaloDataSend
    ) => {
        const param = {
            recipient: {
                user_id: user_id
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'promotion',
                        language: 'VI',
                        elements: [
                            { type: 'header', content: '💥💥Happy Birthday💥💥' },
                            {
                                type: 'text',
                                content: ` ${dataSend?.tenChiNhanh} kính chúc ${dataSend?.tenKhachHang} có một ngày sinh nhật ý nghĩa bên người thân và gia đình`
                            }
                        ]
                    }
                }
            }
        };
        console.log('GuiTinNhanChucMungSinhNhat_WithMyTemp ', param);

        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/promotion', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('zalo test ', result.data);
        return result.data;
    };
    GetDanhSach_KhachHang_QuanTamOA = async (access_token: string) => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getfollowers?data={"offset":0,"count":50}`, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        if (xx.data.error == 0) {
            return xx.data.data;
        }
        return {
            total: 0,
            followers: []
        };
    };
    GetInforUser_ofOA = async (access_token: string, user_id: string): Promise<IInforUserZOA | null> => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getprofile?data={"user_id":"${user_id}"}`, {
            headers: {
                access_token: access_token
            }
        });
        if (xx.data.error === 0) {
            return xx.data.data;
        }
        return null;
    };
    async ZaloWebhook_UserSendMessage() {
        const res = await http.get(`/api/zalo/webhook/user-send-message`);
        return res.data;
    }
    GuiTinTuVan = async (access_token: string, userId = '1311392252375682231', noiDungTin = '') => {
        const param = {
            recipient: {
                user_id: userId
            },
            message: {
                text: noiDungTin
            }
        };
        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        return result.data;
    };
    NguoiDung_ChiaSeThongTin_ChoOA = async (
        accountZOA: InforZOA,
        access_token: string,
        userId = '6441788310775550433'
    ) => {
        const param = {
            recipient: {
                user_id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'request_user_info',
                        elements: [
                            {
                                title: `Chào mừng bạn đến với ${accountZOA?.name} trên Zalo`,
                                subtitle: 'Đăng ký thành viên để nhận thông tin ưu đãi hấp dẫn',
                                image_url: uploadFileService.GoogleApi_NewLink(
                                    'https://drive.google.com/uc?export=view&id=1TDXeqE458lvu9DJXFg85FtBEuC_1OHUw'
                                )
                            }
                        ]
                    }
                }
            }
        };
        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('NguoiDung_ChiaSeThongTin_ChoOA ', result);
    };

    /// Db
    Innit_orGetToken = async (): Promise<ZaloAuthorizationDto> => {
        const xx = await http.get(`api/services/app/ZaloAuthorization/Innit_orGetToken`);
        return xx.data.result;
    };
    InsertCodeVerifier = async (input: ZaloAuthorizationDto): Promise<ZaloAuthorizationDto> => {
        console.log('InsertCodeVerifier ', input);
        const result = await http.post(`api/services/app/ZaloAuthorization/Insert`, input);
        return result.data.result;
    };
    UpdateZaloToken = async (input: ZaloAuthorizationDto): Promise<ZaloAuthorizationDto> => {
        console.log('UpdateZaloToken ', input);
        const result = await http.post(`api/services/app/ZaloAuthorization/Update`, input);
        return result.data.result;
    };
    XoaKetNoi = async (id: string): Promise<string> => {
        const result = await http.get(`api/services/app/ZaloAuthorization/XoaKetNoi?id=${id}`);
        return result.data.result;
    };

    DangKyThanhVienZOA = async (input: IMemberZOA): Promise<IMemberZOA> => {
        const result = await http.post(`api/services/app/Zalo_KhachHangThanhVien/DangKyThanhVienZOA`, input);
        return result.data.result;
    };
    GetId_fromZOAUserId = async (zoaUserId: string): Promise<string | null> => {
        if (utils.checkNull(zoaUserId)) {
            return null;
        }
        const result = await http.get(
            `api/services/app/Zalo_KhachHangThanhVien/GetId_fromZOAUserId?zaloUserId=${zoaUserId}`
        );
        return result.data.result;
    };
    GetZaloTemplate_byId = async (idTemp: string): Promise<IZaloTemplate | null> => {
        const result = await http.get(`api/services/app/Zalo_Template/GetZaloTemplate_byId?id=${idTemp}`);
        return result.data.result;
    };
    XoaMauTinZalo = async (idTemp: string): Promise<boolean> => {
        const result = await http.get(`api/services/app/Zalo_Template/XoaMauTinZalo?idTemp=${idTemp}`);
        return result.data.result;
    };
    GetAllZaloTemplate_fromDB = async (): Promise<IZaloTemplate[]> => {
        const result = await http.get(`api/services/app/Zalo_Template/GetAllZaloTemplate_fromDB`);
        return result.data.result;
    };

    InnitData_TempZalo = async (): Promise<IZaloTemplate[]> => {
        const result = await http.get(`api/services/app/Zalo_Template/InnitData_TempZalo`);
        return result.data.result;
    };
    InsertMauTinZalo = async (input: IZaloTemplate): Promise<IZaloTemplate> => {
        const result = await http.post(`api/services/app/Zalo_Template/InsertMauTinZalo`, input);
        return result.data.result;
    };
    UpdateMauTinZalo = async (input: IZaloTemplate): Promise<IZaloTemplate> => {
        const result = await http.post(`api/services/app/Zalo_Template/UpdateMauTinZalo`, input);
        return result.data.result;
    };
}

export default new ZaloService();
