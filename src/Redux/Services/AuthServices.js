import { Constants } from '../../Config';
import { Tools } from '../../Helpers';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
    ? Constants.BASE_URL.DEV
    : Constants.BASE_URL.PROD;

export default {
    Login: (params) => {
        console.log("params --->>", params);
        let header = {
            'Accept': 'multipart/form-data',
        };
        return fetch(`${BASE_URL}api/login`, {
            method: 'POST',
            body: params,
        })
            .then((response) => Ajax.handleResponse(response))
            .then((data) => { return data });
    },
    Logout: (params) => {
        let header = {
            'Accept': 'multipart/form-data',
        };
        console.log("Headerr", header)
        return fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            body: params,
        })
            .then((response) => Ajax.handleResponse(response))
            .then((data) => { return data });
    },
};
