import { Guid } from "guid-typescript";
export default interface CreateOrUpdateNhanSuDto{
    id: Guid,
    maNhanVien: string,
    tenNhanVien:string,
    diaChi:string,
    soDienThoai:string,
    cccd?: string,
    ngaySinh?: string,
    kieuNgaySinh:number,
    gioiTinh:number,
    ngayCap?: string,
    noiCap?: string,
    avatar?: string,
    idChucVu: string,
    ghiChu?: string
}