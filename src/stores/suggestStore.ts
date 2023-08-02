import { makeAutoObservable } from 'mobx';
import { SuggestDichVuDto } from '../services/suggests/dto/SuggestDichVuDto';
import { SuggestNhanVienDichVuDto } from '../services/suggests/dto/SuggestNhanVienDichVuDto';
import SuggestService from '../services/suggests/SuggestService';
import { SuggestChucVuDto } from '../services/suggests/dto/SuggestChucVuDto';
import { SuggestNhomKhachDto } from '../services/suggests/dto/SuggestNhomKhachDto';
import { SuggestNhanSuDto } from '../services/suggests/dto/SuggestNhanSuDto';

class SuggestStore {
    suggestKyThuatVien!: SuggestNhanVienDichVuDto[];
    suggestDichVu!: SuggestDichVuDto[];
    suggestChucVu!: SuggestChucVuDto[];
    suggestNhomKhach!: SuggestNhomKhachDto[];
    suggestNhanVien!: SuggestNhanSuDto[];
    constructor() {
        makeAutoObservable(this);
    }
    async getSuggestKyThuatVien(idNhanVien?: string) {
        const data = await SuggestService.SuggestNhanVienLamDichVu(idNhanVien);
        this.suggestKyThuatVien = data;
    }
    async getSuggestNhanVien() {
        const data = await SuggestService.SuggestNhanSu();
        this.suggestNhanVien = data;
    }
    async getSuggestDichVu() {
        const data = await SuggestService.SuggestDichVu();
        this.suggestDichVu = data;
    }
    async getSuggestChucVu() {
        const data = await SuggestService.SuggestChucVu();
        this.suggestChucVu = data;
    }
    async getSuggestNhomKhach() {
        const data = await SuggestService.SuggestNhomKhach();
        this.suggestNhomKhach = data;
    }
}
export default new SuggestStore();
