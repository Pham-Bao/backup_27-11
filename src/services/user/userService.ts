import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from './dto/PagedUserResultRequestDto';
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';

class UserService {
    public async create(createUserInput: CreateOrUpdateUserInput) {
        const result = await http.post('api/services/app/User/Create', createUserInput);
        return result.data.result;
    }

    public async update(updateUserInput: UpdateUserInput) {
        const result = await http.post('api/services/app/User/UpdateUser', updateUserInput);
        return result.data.result;
    }

    public async delete(entityDto: number) {
        const result = await http.delete(`api/services/app/User/Delete?id=${entityDto}`);
        return result.data;
    }

    public async getRoles() {
        const result = await http.get('api/services/app/User/GetRoles');
        return result.data.result.items;
    }

    public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
        const result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
        return result.data;
    }

    public async get(entityDto: number): Promise<CreateOrUpdateUserInput> {
        const result = await http.get(`api/services/app/User/Get?Id=${entityDto}`);
        return result.data.result;
    }

    public async getAll(
        pagedFilterAndSortedRequest: PagedUserResultRequestDto
    ): Promise<PagedResultDto<GetAllUserOutput>> {
        const result = await http.get('api/services/app/User/GetAll', {
            params: pagedFilterAndSortedRequest
        });
        return result.data.result;
    }
}

export default new UserService();
