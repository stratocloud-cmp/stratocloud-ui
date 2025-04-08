import request from '@/utils/request'


export const describeStacks = data => {
    return request({
        url: '/resource-service/describe-resource-stacks',
        method: 'post',
        data
    });
};

export const updateStackBasics = data => {
    return request({
        url: '/resource-service/update-stack-basics',
        method: 'post',
        data
    });
};


export const dropStacks = data => {
    return request({
        url: '/resource-service/drop-resource-stacks',
        method: 'post',
        data
    });
};