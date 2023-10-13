import { Guid } from 'guid-typescript';
import { PagedKhachHangResultRequestDto } from './dto/PagedKhachHangResultRequestDto';
import { KhachHangItemDto } from './dto/KhachHangItemDto';
import Cookies from 'js-cookie';
import http from '../httpService';
import { CreateOrEditKhachHangDto } from './dto/CreateOrEditKhachHangDto';
import { KhachHangDto } from './dto/KhachHangDto';
import Utils from '../../utils/utils';
import { FileDto, IFileDto } from '../dto/FileDto';
import utils from '../../utils/utils';
import { ExecuteResultDto } from '../dto/ExecuteResultDto';
import { FileUpload } from '../dto/FileUpload';
import QueryString from 'qs';
import { CreateOrEditNhomKhachDto } from './dto/CreateOrEditNhomKhachDto';
import { PagedRequestDto } from '../dto/pagedRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto';

class KhachHangService {
    public async getAll(input: PagedKhachHangResultRequestDto): Promise<PagedResultDto<KhachHangItemDto>> {
        const result = await http.post(`api/services/app/KhachHang/Search`, input);
        return result.data.result;
    }
    public async createNhomKhach(input: CreateOrEditNhomKhachDto) {
        const result = await http.post('api/services/app/NhomKhach/CreateOrEditNhomKhach', input);
        return result.data.result;
    }
    public async getForEditNhomKhach(id: string) {
        const result = await http.post(`api/services/app/NhomKhach/GetForEdit?id=${id}`);
        return result.data.result;
    }
    public async XoaNhomKhachHang(id: string) {
        const result = await http.get(`api/services/app/NhomKhach/Delete?id=${id}`);
        return result.data.result;
    }
    public async createOrEdit(input: CreateOrEditKhachHangDto): Promise<KhachHangDto> {
        const result = await http.post('api/services/app/KhachHang/CreateOrEdit', input);
        return result.data.result;
    }
    public async getDetail(id: string) {
        const response = await http.get(`api/services/app/KhachHang/GetKhachHangDetail?id=${id}`);
        return response.data.result;
    }
    public async getKhachHang(id: string): Promise<CreateOrEditKhachHangDto> {
        if (utils.checkNull(id) || id === Guid.EMPTY) {
            return {
                id: '',
                maKhachHang: 'KL',
                tenKhachHang: 'Khách lẻ'
            } as CreateOrEditKhachHangDto;
        }
        const result = await http.get(`api/services/app/KhachHang/GetKhachHang?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string) {
        const result = await http.post(`api/services/app/KhachHang/Delete?id=${id}`);
        return result.data.result;
    }
    public async DeleteMultipleCustomer(lstId: any) {
        const result = await http.post(`api/services/app/KhachHang/DeleteMultipleCustomer`, lstId);
        return result.data.success; // true/false
    }
    ChuyenNhomKhachHang = async (lstIdKhachHang: any, idNhomKhachNew: string) => {
        const xx = await http.post(
            `api/services/app/KhachHang/ChuyenNhomKhachHang?idNhomKhach=${idNhomKhachNew}`,
            lstIdKhachHang
        );
        return xx.data.success;
    };
    public async exportDanhSach(input: PagedKhachHangResultRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/KhachHang/ExportDanhSach`, input);
        return response.data.result;
    }
    public async exportSelectedDanhSach(input: Guid[]): Promise<IFileDto> {
        const response = await http.post(`api/services/app/KhachHang/ExporSelectedtDanhSach`, input);
        return response.data.result;
    }
    jqAutoCustomer = async (input: PagedKhachHangResultRequestDto) => {
        const result = await http.post(`api/services/app/KhachHang/JqAutoCustomer`, input);
        return result.data.result;
    };
    async checkExistSoDienThoai(phone: string, id: string | null = null) {
        if (Utils.checkNull(id)) {
            id = Guid.EMPTY;
        }
        const result = await http.get(`api/services/app/KhachHang/CheckExistSoDienThoai?phone=${phone}&id=${id}`);
        return result.data.result;
    }
    async GetKhachHang_noBooking(input: PagedKhachHangResultRequestDto) {
        const param = QueryString.stringify(input); // convert object to param string
        const result = await http.get(`api/services/app/KhachHang/GetKhachHang_noBooking?${param}`);
        return result.data.result;
    }
    async importKhachHang(input: FileUpload) {
        const response = await http.post('api/services/app/KhachHang/ImportFile_DanhMucKhachHang', input);
        return response.data.result;
    }
    async lichSuGiaoDich(idKhachHang: string, input: PagedRequestDto) {
        const response = await http.post(`api/services/app/KhachHang/LichSuGiaoDich?idKhachHang=${idKhachHang}`, input);
        return response.data.result;
    }
    async lichSuDatLich(idKhachHang: string, input: PagedRequestDto) {
        const response = await http.post(`api/services/app/KhachHang/LichSuDatLich?idKhachHang=${idKhachHang}`, input);
        return response.data.result;
    }
}
export default new KhachHangService();
