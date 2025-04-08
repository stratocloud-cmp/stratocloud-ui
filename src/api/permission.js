import request from '@/utils/request'

export const describePermissions = data => {
    return request({
        url: '/identity-service/describe-permissions',
        method: 'post',
        data
    });
};

export const addPermissions = data => {
    return request({
        url: '/identity-service/add-permissions-to-role',
        method: 'post',
        data
    });
};

export const removePermissions = data => {
    return request({
        url: '/identity-service/remove-permissions-from-role',
        method: 'post',
        data
    });
};