import request from '@/utils/request'

export const describeResourceEvents = data => {
    return request({
        url: '/resource-service/describe-resource-events',
        method: 'post',
        data
    });
};
