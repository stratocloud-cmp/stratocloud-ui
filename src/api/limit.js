import request from '@/utils/request'


export const describeLimits = data => {
    return request({
        url: '/resource-service/describe-resource-usage-limits',
        method: 'post',
        data
    });
};

export const describeUsageTypes = data => {
    return request({
        url: '/resource-service/describe-usage-types',
        method: 'post',
        data
    });
};

export const createLimit = data => {
    return request({
        url: '/resource-service/create-resource-usage-limit',
        method: 'post',
        data
    });
};

export const updateLimit = data => {
    return request({
        url: '/resource-service/update-resource-usage-limit',
        method: 'post',
        data
    });
};

export const enableLimits = data => {
    return request({
        url: '/resource-service/enable-resource-usage-limits',
        method: 'post',
        data
    });
};

export const disableLimits = data => {
    return request({
        url: '/resource-service/disable-resource-usage-limits',
        method: 'post',
        data
    });
};

export const deleteLimits = data => {
    return request({
        url: '/resource-service/delete-resource-usage-limits',
        method: 'post',
        data
    });
};