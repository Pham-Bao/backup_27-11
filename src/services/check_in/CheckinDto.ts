import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import { format } from 'date-fns';
import { TrangThaiCheckin } from '../../lib/appconst';

export class KHCheckInDto {
    id = '';
    idKhachHang = '';
    idChiNhanh = '';
    dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    ghiChu = '';
    trangThai = TrangThaiCheckin.WAITING; // default
    constructor({
        id = Guid.EMPTY,
        idKhachHang = '',
        idChiNhanh = '',
        dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        trangThai = TrangThaiCheckin.WAITING
    }) {
        this.id = id;
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.dateTimeCheckIn = dateTimeCheckIn;
        this.trangThai = trangThai;
    }
}

export interface ICheckInHoaDonto {
    idCheckIn: string;
    idHoaDon: string;
    idBooking: string | null;
}

export class PageKhachHangCheckInDto {
    idKhachHang: string | null = null;
    idChiNhanh = null;
    idCheckIn = Guid.EMPTY;
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    avatar = '';
    tongTichDiem = 0;
    dateTimeCheckIn = new Date().toLocaleString();
    ghiChu? = '';
    trangThaiCheckIn = 1;
    txtTrangThaiCheckIn? = '';
    tongThanhToan = 0; // mục đích để chỉ lấy ra ở DS khách hàng checking (get TongThanhToan from cache hoadon)

    constructor({
        idKhachHang = Guid.EMPTY,
        idChiNhanh = null,
        idCheckIn = Guid.EMPTY,
        dateTimeCheckIn = new Date().toLocaleString(),
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        ghiChu = '',
        txtTrangThaiCheckIn = 'Đang chờ'
    }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idCheckIn = idCheckIn;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.dateTimeCheckIn = dateTimeCheckIn.toLocaleString();
        this.ghiChu = ghiChu;
        this.txtTrangThaiCheckIn = txtTrangThaiCheckIn;
    }
    get dateCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'dd/MM/yyyy');
    }
    get timeCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'hh:mm a');
    }
    get tenKhach_KiTuDau() {
        return utils.getFirstLetter(this.tenKhachHang);
    }
}
