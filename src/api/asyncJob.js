import request from '@/utils/request'

export const runAsyncJob = data => {
    return request({
        url: '/resource-service/run-async-job',
        method: 'post',
        data
    });
};

export const describeAsyncJob = data => {
    return request({
        url: '/resource-service/describe-async-jobs',
        method: 'post',
        data
    });
};