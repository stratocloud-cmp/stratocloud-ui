import request from '@/utils/request'

export const describeResourceCategories = data => {
    return request({
        url: '/resource-service/describe-resource-categories',
        method: 'post',
        data
    });
};

export const describeResources = data => {
    return request({
        url: '/resource-service/describe-resources',
        method: 'post',
        data
    });
};

export const describeUnclaimedResources = data => {
    return request({
        url: '/resource-service/describe-unclaimed-resources',
        method: 'post',
        data
    });
};

export const performCreateResourcesPriceInquiry = data => {
    return request({
        url: '/resource-service/create-resources-price-inquiry',
        method: 'post',
        data
    });
};

export const performDestroyResourcesRefundInquiry = data => {
    return request({
        url: '/resource-service/destroy-resources-refund-inquiry',
        method: 'post',
        data
    });
};

export const performRunActionsPriceInquiry = data => {
    return request({
        url: '/resource-service/run-actions-price-inquiry',
        method: 'post',
        data
    });
};

export const performChangeEssentialRequirementsPriceInquiry = data => {
    return request({
        url: '/resource-service/change-essential-requirements-price-inquiry',
        method: 'post',
        data
    });
};

export const describeResourceTypes = data => {
    return request({
        url: '/resource-service/describe-resource-types',
        method: 'post',
        data
    });
};

export const describeRequirements = data => {
    return request({
        url: '/resource-service/describe-requirements',
        method: 'post',
        data
    });
};

export const describeCapabilities = data => {
    return request({
        url: '/resource-service/describe-capabilities',
        method: 'post',
        data
    });
};

export const describeRelationships = data => {
    return request({
        url: '/resource-service/describe-relationships',
        method: 'post',
        data
    });
};

export const describeAvailableActions = data => {
    return request({
        url: '/resource-service/describe-available-resource-actions',
        method: 'post',
        data
    });
};

export const describeProviders = data => {
    return request({
        url: '/resource-service/describe-providers',
        method: 'post',
        data
    });
};

export const describeResourceActionForm = data => {
    return request({
        url: '/resource-service/describe-resource-action-form',
        method: 'post',
        data
    });
};

export const describeRelationshipForm = data => {
    return request({
        url: '/resource-service/describe-relationship-form',
        method: 'post',
        data
    });
};

export const describeRelationshipSpec = data => {
    return request({
        url: '/resource-service/describe-relationship-spec',
        method: 'post',
        data
    });
};

export const describeRelationshipTypes = data => {
    return request({
        url: '/resource-service/describe-relationship-types',
        method: 'post',
        data
    });
};

export const runReadActions = data => {
    return request({
        url: '/resource-service/run-resource-read-actions',
        method: 'post',
        data
    });
};

export const dropResources = data => {
    return request({
        url: '/resource-service/drop-resources',
        method: 'post',
        data
    });
};

export const describeResourceQuickStats = data => {
    return request({
        url: '/resource-service/describe-resource-quick-stats',
        method: 'post',
        data
    });
};

export const associateTags = data => {
    return request({
        url: '/resource-service/associate-tags',
        method: 'post',
        data
    });
};

export const disassociateTag = data => {
    return request({
        url: '/resource-service/disassociate-tag',
        method: 'post',
        data
    });
};

export const updateDescription = data => {
    return request({
        url: '/resource-service/update-description',
        method: 'post',
        data
    });
};
