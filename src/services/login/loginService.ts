import { Api, Cookie } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginModel from '../../models/Login/loginModel';
import qs from 'qs';
const http = axios.create({
    baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    timeout: 30000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            encode: false
        });
    }
});
class LoginService {
    public async CheckTenant(tenantName: string) {
        if (tenantName == null || tenantName === '') {
            tenantName = 'default';
        }
        const result = await http.post('api/services/app/Account/IsTenantAvailable', {
            tenancyName: tenantName
        });
        let tenantId = result.data.result['tenantId'];
        if (tenantId == null) {
            tenantId = 0;
        }
        Cookies.set('TenantId', tenantId);
        return result.data.result;
    }

    async Login(loginModel: LoginModel): Promise<boolean> {
        this.CheckTenant(loginModel.tenancyName);
        const requestBody = {
            userNameOrEmailAddress: loginModel.userNameOrEmailAddress,
            password: loginModel.password,
            rememberClient: loginModel.rememberMe
        };
        let result = false;
        const tenantId = Cookies.get('TenantId');
        if (tenantId?.toString() !== '0') {
            const apiResult = await http.post('/api/TokenAuth/Authenticate', requestBody, {
                headers: {
                    'Abp.TenantId': tenantId === '1' ? '' : tenantId,
                    'Content-Type': 'application/json'
                }
            });
            if (apiResult.status === 200) {
                if (apiResult.data.success === true) {
                    Cookies.set('accessToken', apiResult.data.result['accessToken'], {
                        expires: 1 / 48
                    });
                    Cookies.set(
                        'encryptedAccessToken',
                        apiResult.data.result['encryptedAccessToken']
                    );
                    Cookies.set('expireInSeconds', apiResult.data.result['expireInSeconds'], {
                        expires: 1 / 48
                    });
                    Cookies.set('userId', apiResult.data.result['userId']);
                    Cookies.set('isLogin', 'true');
                    result = apiResult.data.success;
                }
            }
        }
        return result;
    }
}
export default new LoginService();
