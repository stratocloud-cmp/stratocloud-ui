import request from '@/utils/request'


export const createBlueprint = data => {
    return request({
        url: '/resource-service/create-blueprint',
        method: 'post',
        data
    });
};

export const deleteBlueprints = data => {
    return request({
        url: '/resource-service/delete-blueprints',
        method: 'post',
        data
    });
};

export const updateBlueprint = data => {
    return request({
        url: '/resource-service/update-blueprint',
        method: 'post',
        data
    });
};

export const describeBlueprints = data => {
    return request({
        url: '/resource-service/describe-blueprints',
        method: 'post',
        data
    });
};

export const generateCreateStacksCmd = data => {
    return request({
        url: '/resource-service/generate-create-stacks-cmd',
        method: 'post',
        data
    });
};