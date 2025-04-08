import request from '@/utils/request'

export const describeUserGroups = data => {
    return request({
        url: '/identity-service/describe-groups',
        method: 'post',
        data
    });
};
