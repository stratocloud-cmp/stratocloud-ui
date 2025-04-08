import request from '@/utils/request'

export const describeSoftwareDefinitions = data => {
    return request({
        url: '/resource-service/describe-software-definitions',
        method: 'post',
        data
    });
};

export const createSoftwareDefinition = data => {
    return request({
        url: '/resource-service/create-software-definition',
        method: 'post',
        data
    });
};

export const updateSoftwareDefinition = data => {
    return request({
        url: '/resource-service/update-software-definition',
        method: 'post',
        data
    });
};

export const deleteSoftwareDefinitions = data => {
    return request({
        url: '/resource-service/delete-software-definitions',
        method: 'post',
        data
    });
};

export const enableSoftwareDefinitions = data => {
    return request({
        url: '/resource-service/enable-software-definitions',
        method: 'post',
        data
    });
};

export const disableSoftwareDefinitions = data => {
    return request({
        url: '/resource-service/disable-software-definitions',
        method: 'post',
        data
    });
};