import { Guid } from 'guid-typescript';
import HoaDonChiTietDto from './HoaDonChiTietDto';

export default class PageHoaDonChiTietDto extends HoaDonChiTietDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
    giaNhap? = 0;
    idNhomHangHoa = null;
    idHangHoa? = null;

    constructor({
        id = Guid.create().toString(),
        maHangHoa = '',
        tenHangHoa = '',
        giaBan = 0,
        giaNhap = 0,
        idNhomHangHoa = null,
        idHangHoa = null,
        idDonViQuyDoi = null,
        soLuong = 1
    }) {
        super({
            id: id,
            idDonViQuyDoi: idDonViQuyDoi,
            soLuong: soLuong,
            donGiaTruocCK: giaBan
        });
        this.maHangHoa = maHangHoa;
        this.tenHangHoa = tenHangHoa;
        this.giaBan = giaBan;
        this.giaNhap = giaNhap;
        this.idNhomHangHoa = idNhomHangHoa;
        this.idHangHoa = idHangHoa;
    }
}
