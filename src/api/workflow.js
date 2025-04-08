import request from '@/utils/request'

export const createWorkflow = data => {
    return request({
        url: '/order-service/create-workflow',
        method: 'post',
        data
    });
};

export const updateWorkflow = data => {
    return request({
        url: '/order-service/update-workflow',
        method: 'post',
        data
    });
};

export const describeWorkflows = data => {
    return request({
        url: '/order-service/describe-workflows',
        method: 'post',
        data
    });
};

export const deleteWorkflows = data => {
    return request({
        url: '/order-service/delete-workflows',
        method: 'post',
        data
    });
};

export const describeNodeTypes = data => {
    return request({
        url: '/order-service/describe-node-types',
        method: 'post',
        data
    });
};