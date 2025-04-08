import request from '@/utils/request'

export const describeUsers = data => {
    return request({
        url: '/identity-service/describe-users',
        method: 'post',
        data
    });
};

export const unlockUsers = data => {
    return request({
        url: '/identity-service/unlock-users',
        method: 'post',
        data
    });
};

export const enableUsers = data => {
    return request({
        url: '/identity-service/enable-users',
        method: 'post',
        data
    });
};

export const disableUsers = data => {
    return request({
        url: '/identity-service/disable-users',
        method: 'post',
        data
    });
};

export const deleteUsers = data => {
    return request({
        url: '/identity-service/delete-users',
        method: 'post',
        data
    });
};


export const saveUser = data => {
    return request({
        url: '/identity-service/create-user',
        method: 'post',
        data
    });
};

export const updateUser = data => {
    return request({
        url: '/identity-service/update-user',
        method: 'post',
        data
    });
};

export const batchAssignRoleToUser = data => {
    return request({
        url: '/identity-service/batch-assign-role-to-user',
        method: 'post',
        data
    });
};

export const batchRemoveRoleFromUser = data => {
    return request({
        url: '/identity-service/batch-remove-role-from-user',
        method: 'post',
        data
    });
};


export const changePassword = data => {
    return request({
        url: '/identity-service/change-password',
        method: 'post',
        data
    });
};