import request from '@/utils/request'

export const describeTagEntries = data => {
    return request({
        url: '/resource-service/describe-tag-entries',
        method: 'post',
        data
    });
};

export const describeTagValues = data => {
    return request({
        url: '/resource-service/describe-tag-values',
        method: 'post',
        data
    });
};

export const addTagValue = data => {
    return request({
        url: '/resource-service/add-tag-value',
        method: 'post',
        data
    });
};

export const removeTagValues = data => {
    return request({
        url: '/resource-service/remove-tag-values',
        method: 'post',
        data
    });
};

export const createTagEntry = data => {
    return request({
        url: '/resource-service/create-tag-entry',
        method: 'post',
        data
    });
};

export const updateTagEntry = data => {
    return request({
        url: '/resource-service/update-tag-entry',
        method: 'post',
        data
    });
};

export const deleteTagEntries = data => {
    return request({
        url: '/resource-service/delete-tag-entries',
        method: 'post',
        data
    });
};