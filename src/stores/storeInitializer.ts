import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import roleStore from './roleStore';
export default function initializeStores() {
    return {
        authenticationStore: new AuthenticationStore(),
        roleStore: roleStore,
        tenantStore: new TenantStore(),
        userStore: new UserStore(),
        sessionStore: new SessionStore(),
        accountStore: new AccountStore()
    };
}
