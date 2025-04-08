import request from '@/utils/request'

export const describeJobs = data => {
    return request({
        url: '/order-service/describe-jobs',
        method: 'post',
        data
    });
};

export const createJob = data => {
    return request({
        url: '/order-service/create-job',
        method: 'post',
        data
    });
};

export const retryJob = data => {
    return request({
        url: '/order-service/retry-job',
        method: 'post',
        data
    });
};

export const describeJobDefinitions = data => {
    return request({
        url: '/order-service/describe-job-definitions',
        method: 'post',
        data
    });
};

export const changeJobDefinitionOrderRequirement = data => {
    return request({
        url: '/order-service/change-job-definition-order-requirement',
        method: 'post',
        data
    });
};


export const describeJobTriggers = data => {
    return request({
        url: '/order-service/describe-job-triggers',
        method: 'post',
        data
    });
};

export const updateJobTrigger = data => {
    return request({
        url: '/order-service/update-job-trigger',
        method: 'post',
        data
    });
};

export const enableJobTrigger = data => {
    return request({
        url: '/order-service/enable-job-trigger',
        method: 'post',
        data
    });
};

export const disableJobTrigger = data => {
    return request({
        url: '/order-service/disable-job-trigger',
        method: 'post',
        data
    });
};

export const triggerJobOnce = data => {
    return request({
        url: '/order-service/trigger-job-once',
        method: 'post',
        data
    });
};

