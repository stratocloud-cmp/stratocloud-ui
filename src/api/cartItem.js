import request from '@/utils/request.js'

export const describeCartItems = data => {
    return request({
        url: '/resource-service/describe-cart-items',
        method: 'post',
        data
    });
};

export const describeAllCartItems = data => {
    return request({
        url: '/resource-service/describe-all-cart-items',
        method: 'post',
        data
    });
};

export const createCartItem = data => {
    return request({
        url: '/resource-service/create-cart-item',
        method: 'post',
        data
    });
};

export const updateCartItem = data => {
    return request({
        url: '/resource-service/update-cart-item',
        method: 'post',
        data
    });
};

export const deleteCartItems = data => {
    return request({
        url: '/resource-service/delete-cart-items',
        method: 'post',
        data
    });
};

export const submitCartItems = data => {
    return request({
        url: '/resource-service/submit-cart-items',
        method: 'post',
        data
    });
};