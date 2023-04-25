import { Guid } from 'guid-typescript';

export interface KhachHangItemDto {
    id: Guid;
    tenKhachHang: string;
    soDienThoai: string;
    tenNhomKhach: string;
    gioiTinh: string;
    nhanVienPhuTrach: string;
    tongChiTieu: number;
    cuocHenGanNhat: Date;
    tenNguonKhach: string;
    tongTichDiem: number;
}
