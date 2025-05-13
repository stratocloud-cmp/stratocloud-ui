import request from '@/utils/request'

export const createNotificationWay = data => {
    return request({
        url: '/identity-service/create-notification-way',
        method: 'post',
        data
    });
};
export const updateNotificationWay = data => {
    return request({
        url: '/identity-service/update-notification-way',
        method: 'post',
        data
    });
};
export const deleteNotificationWays = data => {
    return request({
        url: '/identity-service/delete-notification-ways',
        method: 'post',
        data
    });
};
export const describeNotificationWays = data => {
    return request({
        url: '/identity-service/describe-notification-ways',
        method: 'post',
        data
    });
};
export const describeNotificationProviders = data => {
    return request({
        url: '/identity-service/describe-notification-providers',
        method: 'post',
        data
    });
};

export const createNotificationPolicy = data => {
    return request({
        url: '/identity-service/create-notification-policy',
        method: 'post',
        data
    });
};
export const updateNotificationPolicy = data => {
    return request({
        url: '/identity-service/update-notification-policy',
        method: 'post',
        data
    });
};
export const deleteNotificationPolicies = data => {
    return request({
        url: '/identity-service/delete-notification-policies',
        method: 'post',
        data
    });
};
export const describeNotificationPolicies = data => {
    return request({
        url: '/identity-service/describe-notification-policies',
        method: 'post',
        data
    });
};
export const describeNotificationEventTypes = data => {
    return request({
        url: '/identity-service/describe-notification-event-types',
        method: 'post',
        data
    });
};

export const describeNotifications = data => {
    return request({
        url: '/identity-service/describe-notifications',
        method: 'post',
        data
    });
};
export const resendNotifications = data => {
    return request({
        url: '/identity-service/resend-notifications',
        method: 'post',
        data
    });
};

export const describeInternalMails = data => {
    return request({
        url: '/identity-service/describe-internal-mails',
        method: 'post',
        data
    });
};
export const markInternalMailsRead = data => {
    return request({
        url: '/identity-service/resend-notifications',
        method: 'post',
        data
    });
};
