import request from '@/utils/request'

export const describeAccounts = data => {
    return request({
        url: '/resource-service/describe-external-accounts',
        method: 'post',
        data
    });
};

export const createExternalAccount = data => {
    return request({
        url: '/resource-service/create-external-account',
        method: 'post',
        data
    });
};

export const updateExternalAccount = data => {
    return request({
        url: '/resource-service/update-external-account',
        method: 'post',
        data
    });
};

export const enableExternalAccounts = data => {
    return request({
        url: '/resource-service/enable-external-accounts',
        method: 'post',
        data
    });
};

export const disableExternalAccounts = data => {
    return request({
        url: '/resource-service/disable-external-accounts',
        method: 'post',
        data
    });
};

export const deleteExternalAccounts = data => {
    return request({
        url: '/resource-service/delete-external-accounts',
        method: 'post',
        data
    });
};