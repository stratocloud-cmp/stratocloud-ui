import request from '@/utils/request'

export const describeRules = data => {
    return request({
        url: '/identity-service/describe-rules',
        method: 'post',
        data
    });
};

export const createRule = data => {
    return request({
        url: '/identity-service/create-rule',
        method: 'post',
        data
    });
};

export const updateRule = data => {
    return request({
        url: '/identity-service/update-rule',
        method: 'post',
        data
    });
};

export const createNamingRule = data => {
    return request({
        url: '/identity-service/create-naming-rule',
        method: 'post',
        data
    });
};

export const updateNamingRule = data => {
    return request({
        url: '/identity-service/update-naming-rule',
        method: 'post',
        data
    });
};

export const deleteRules = data => {
    return request({
        url: '/identity-service/delete-rules',
        method: 'post',
        data
    });
};