import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { CreateOrEditLichLamViecDto } from './dto/CreateOrEditLichLamViecDto';
import { LichLamViecDto } from './dto/LichLamViecDto';
import { LichLamViecNhanVienDto } from './dto/LichLamViecNhanVienDto';
import { PagedRequestLichLamViecDto } from './dto/PagedRequsetLichLamViec';

class LichLamViecService {
    public async getAllLichLamViecWeek(
        input: PagedRequestLichLamViecDto
    ): Promise<PagedResultDto<LichLamViecNhanVienDto>> {
        const response = await http.get('api/services/app/LichLamViec/GetAllLichLamViecWeek', {
            params: input
        });
        return response.data.result;
    }
    public async createOrEditLichLamViec(input: CreateOrEditLichLamViecDto): Promise<boolean> {
        const response = await http.post('api/services/app/LichLamViec/CReateOrEdit', input);
        return response.data.success;
    }
}
export default new LichLamViecService();
