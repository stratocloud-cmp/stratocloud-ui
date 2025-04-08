import {inject, provide} from 'vue'

class ResourceStackNodeContext {
    ignoredTargetTypeIds = []
    ignoredCapabilityTypeIds = []

    constructor() {}

    addIgnoredTargetTypeId(targetTypeId) {
        this.ignoredTargetTypeIds.push(targetTypeId)
    }

    isIgnoredTargetType(targetTypeId) {
        return this.ignoredTargetTypeIds.includes(targetTypeId)
    }

    addIgnoredCapabilityTypeId(capabilityTypeId) {
        this.ignoredCapabilityTypeIds.push(capabilityTypeId)
    }

    isIgnoredCapabilityType(capabilityTypeId) {
        return this.ignoredCapabilityTypeIds.includes(capabilityTypeId)
    }
}

export function useResourceStackNodeContextProvider(){
    const context = new ResourceStackNodeContext()
    provide('resourceStackNodeContext', context)
    return context
}

export function useResourceStaceNodeContext(){
    return inject('resourceStackNodeContext', new ResourceStackNodeContext())
}