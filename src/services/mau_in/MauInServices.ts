import http from '../httpService';
import { MauInDto } from './MauInDto';

class MauInServices {
    GetFileMauIn = async (fileName: string) => {
        const xx = await http
            .get(`api/services/app/MauIn/GetFileMauIn?file=${fileName}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetContentMauInMacDinh = async (type = 1, tenMauIn = '') => {
        const xx = await http
            .get(`api/services/app/MauIn/GetContentMauInMacDinh?type=${type}&tenMauIn=${tenMauIn}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    InsertMauIn = async (input: MauInDto) => {
        const xx = await http
            .post(`api/services/app/MauIn/InsertMauIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdatetMauIn = async (input: MauInDto) => {
        const xx = await http
            .post(`api/services/app/MauIn/UpdatetMauIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
}

export default new MauInServices();
