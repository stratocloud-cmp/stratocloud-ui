export const createResourceFormData = {
    tenantId: undefined,
    ownerId: undefined,
    resource: {
        resourceTypeId: undefined,
        externalAccountId: undefined,
        resourceName: undefined,
        properties: {},
        tags: [],
        description: undefined,
    },
    requirements: [],
    capabilities: [],
    number: 1
}



export const connectResourcesFormData = {
    sourceResourceId: undefined,
    targetResourceId: undefined,
    relationshipTypeId: undefined,
    relationshipInputs: {},
}

export const changeEssentialTargetFormData = {
    sourceId: undefined,
    newTargetId: undefined,
    relationshipTypeId: undefined,
    relationshipInputs: {},
}