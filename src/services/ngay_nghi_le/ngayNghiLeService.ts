import { PagedRequestDto } from '../dto/pagedRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { NgayNghiLeDto } from './dto/NgayNghiLeDto';
import { CreateOrEditNgayNghiLeDto } from './dto/createOrEditNgayNghiLe';
class NgayNghiLeService {
    public async getAll(input: PagedRequestDto): Promise<PagedResultDto<NgayNghiLeDto>> {
        const result = await http.get('api/services/app/NgayNghiLe/GetAll', { params: input });
        return result.data.result;
    }
    public async getForEdit(id: string): Promise<CreateOrEditNgayNghiLeDto> {
        const result = await http.post(`api/services/app/NgayNghiLe/GetForEdit?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string) {
        const result = await http.post(`api/services/app/NgayNghiLe/Delete?id=${id}`);
        return result.data.result;
    }
    public async createOrEdit(input: CreateOrEditNgayNghiLeDto): Promise<NgayNghiLeDto> {
        const result = await http.post(`api/services/app/NgayNghiLe/CreateOrEdit`, input);
        return result.data.result;
    }
}
export default new NgayNghiLeService();
