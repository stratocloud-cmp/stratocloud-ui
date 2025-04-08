import request from '@/utils/request'

export const describeAuditLogs = data => {
    return request({
        url: '/identity-service/describe-audit-logs',
        method: 'post',
        data
    });
};
