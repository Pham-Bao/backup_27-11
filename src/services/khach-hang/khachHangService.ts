import { Guid } from 'guid-typescript';
import { PagedKhachHangResultRequestDto } from './dto/PagedKhachHangResultRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { KhachHangItemDto } from './dto/KhachHangItemDto';
import Cookies from 'js-cookie';
import http from '../httpService';
import { CreateOrEditKhachHangDto } from './dto/CreateOrEditKhachHangDto';
import { KhachHangDto } from './dto/KhachHangDto';
import Utils from '../../utils/utils';
import { FileDto, IFileDto } from '../dto/FileDto';

class KhachHangService {
    public async getAll(
        input: PagedKhachHangResultRequestDto
    ): Promise<PagedResultDto<KhachHangItemDto>> {
        const result = await http.post(`api/services/app/KhachHang/Search`, input);
        return result.data.result;
    }
    public async createOrEdit(input: CreateOrEditKhachHangDto): Promise<KhachHangDto> {
        const result = await http.post('api/services/app/KhachHang/CreateOrEdit', input);
        return result.data.result;
    }
    public async getDetail(id: Guid) {
        console.log(1);
    }
    public async getKhachHang(id: string): Promise<CreateOrEditKhachHangDto> {
        const result = await http.get(`api/services/app/KhachHang/GetKhachHang?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string) {
        const result = await http.post(`api/services/app/KhachHang/Delete?id=${id}`);
        return result.data.result;
    }
    public async exportDanhSach(input: PagedKhachHangResultRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/KhachHang/ExportDanhSach`, input);
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
        const result = await http.get(
            `api/services/app/KhachHang/CheckExistSoDienThoai?phone=${phone}&id=${id}`
        );
        return result.data.result;
    }
}
export default new KhachHangService();
