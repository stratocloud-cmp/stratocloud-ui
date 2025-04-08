import request from '@/utils/request'

export const describeIpPools = data => {
    return request({
        url: '/resource-service/describe-ip-pools',
        method: 'post',
        data
    });
};

export const describeIps = data => {
    return request({
        url: '/resource-service/describe-ips',
        method: 'post',
        data
    });
};

export const createIpPool = data => {
    return request({
        url: '/resource-service/create-ip-pool',
        method: 'post',
        data
    });
};

export const updateIpPool = data => {
    return request({
        url: '/resource-service/update-ip-pool',
        method: 'post',
        data
    });
};

export const deleteIpPools = data => {
    return request({
        url: '/resource-service/delete-ip-pools',
        method: 'post',
        data
    });
};

export const addIpRange = data => {
    return request({
        url: '/resource-service/add-ip-range',
        method: 'post',
        data
    });
};

export const removeIpRanges = data => {
    return request({
        url: '/resource-service/remove-ip-ranges',
        method: 'post',
        data
    });
};

export const excludeIps = data => {
    return request({
        url: '/resource-service/exclude-ips',
        method: 'post',
        data
    });
};

export const releaseIps = data => {
    return request({
        url: '/resource-service/release-ips',
        method: 'post',
        data
    });
};

export const updateAttachedNetworks = data => {
    return request({
        url: '/resource-service/update-ip-pool-attached-networks',
        method: 'post',
        data
    });
};