import request from '@/utils/request'

export const describeScriptDefinitions = data => {
    return request({
        url: '/resource-service/describe-script-definitions',
        method: 'post',
        data
    });
};

export const createScriptDefinition = data => {
    return request({
        url: '/resource-service/create-script-definition',
        method: 'post',
        data
    });
};

export const updateScriptDefinition = data => {
    return request({
        url: '/resource-service/update-script-definition',
        method: 'post',
        data
    });
};

export const deleteScriptDefinitions = data => {
    return request({
        url: '/resource-service/delete-script-definitions',
        method: 'post',
        data
    });
};

export const enableScriptDefinitions = data => {
    return request({
        url: '/resource-service/enable-script-definitions',
        method: 'post',
        data
    });
};

export const disableScriptDefinitions = data => {
    return request({
        url: '/resource-service/disable-script-definitions',
        method: 'post',
        data
    });
};