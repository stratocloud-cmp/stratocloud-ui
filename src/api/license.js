import request from '@/utils/request'

export const uploadLicense = data => {
    return request({
        url: '/identity-service/upload-license',
        method: 'post',
        data
    });
};
