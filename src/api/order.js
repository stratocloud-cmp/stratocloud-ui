import request from '@/utils/request'

export const describeOrders = data => {
    return request({
        url: '/order-service/describe-orders',
        method: 'post',
        data
    });
};

export const describeRollbackTargets = data => {
    return request({
        url: '/order-service/describe-order-rollback-targets',
        method: 'post',
        data
    });
};

export const updateOrderItem = data => {
    return request({
        url: '/order-service/update-order-item',
        method: 'post',
        data
    });
};

export const submitOrder = data => {
    return request({
        url: '/order-service/submit-order',
        method: 'post',
        data
    });
};

export const approveOrder = data => {
    return request({
        url: '/order-service/approve-order',
        method: 'post',
        data
    });
};

export const confirmOrder = data => {
    return request({
        url: '/order-service/confirm-order',
        method: 'post',
        data
    });
};

export const rollbackOrder = data => {
    return request({
        url: '/order-service/rollback-order',
        method: 'post',
        data
    });
};

export const rejectOrder = data => {
    return request({
        url: '/order-service/reject-order',
        method: 'post',
        data
    });
};

export const cancelOrder = data => {
    return request({
        url: '/order-service/cancel-order',
        method: 'post',
        data
    });
};

export const denyOrder = data => {
    return request({
        url: '/order-service/deny-order',
        method: 'post',
        data
    });
};

export const cloneOrder = data => {
    return request({
        url: '/order-service/clone-order',
        method: 'post',
        data
    });
};

export const createOrder = data => {
    return request({
        url: '/order-service/create-order',
        method: 'post',
        data
    });
};
