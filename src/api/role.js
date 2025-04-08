import request from '@/utils/request'

export const describeRoles = data => {
    return request({
        url: '/identity-service/describe-roles',
        method: 'post',
        data
    });
};

export const createRole = data => {
    return request({
        url: '/identity-service/create-role',
        method: 'post',
        data
    });
};

export const updateRole = data => {
    return request({
        url: '/identity-service/update-role',
        method: 'post',
        data
    });
};

export const deleteRoles = data => {
    return request({
        url: '/identity-service/delete-roles',
        method: 'post',
        data
    });
};