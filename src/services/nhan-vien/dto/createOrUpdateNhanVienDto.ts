export interface CreateOrUpdateNhanSuDto {
    id: string;
    maNhanVien: string;
    ho: string;
    tenLot: string;
    tenNhanVien: string;
    diaChi: string;
    soDienThoai: string;
    cccd?: string;
    ngaySinh?: string;
    kieuNgaySinh?: number;
    gioiTinh: number;
    ngayCap?: string;
    noiCap?: string;
    avatar?: string;
    idChucVu: string;
    idChiNhanh?: string;
    ghiChu?: string;
}
