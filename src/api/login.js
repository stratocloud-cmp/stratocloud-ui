import request from '@/utils/request'

export const login = data => {
    return request({
        url: '/identity-service/login',
        method: 'post',
        data
    });
};