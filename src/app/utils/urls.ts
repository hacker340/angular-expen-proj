import { environment } from 'src/environments/environment';

export class Urls {
    static SETTINGS_API = environment.hostV1 + '/setting/api/settings';
    static EXPENSE_API = environment.hostV1 + '/item/api/items';
    static USR_API = environment.hostV1 + '/user/api/users';
    static CATEGORY_API = environment.hostV1 + '/category/api/categories';


    // tslint:disable-next-line:eofline
}