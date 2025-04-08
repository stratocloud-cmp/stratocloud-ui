import request from '@/utils/request'

export const describeTenants = data => {
    return request({
        url: '/identity-service/describe-tenants',
        method: 'post',
        data
    });
};

export const describeTenantsTree = data => {
    return request({
        url: '/identity-service/describe-tenants-tree',
        method: 'post',
        data
    });
};

export const createTenant = data => {
    return request({
        url: '/identity-service/create-tenant',
        method: 'post',
        data
    });
};

export const updateTenant = data => {
    return request({
        url: '/identity-service/update-tenant',
        method: 'post',
        data
    });
};

export const disableTenants = data => {
    return request({
        url: '/identity-service/disable-tenants',
        method: 'post',
        data
    });
};

export const enableTenants = data => {
    return request({
        url: '/identity-service/enable-tenants',
        method: 'post',
        data
    });
};

export const deleteTenants = data => {
    return request({
        url: '/identity-service/delete-tenants',
        method: 'post',
        data
    });
};