import {inject, provide, ref, toValue, watchEffect} from "vue";
import {describeRequirements, describeResourceTypes} from "@/api/resource.js";


export function useResourceTypeDef(resourceTypeIdRef){
    const resourceTypeDef = ref()

    function fetchData(){
        if(!toValue(resourceTypeIdRef)){
            return
        }
        describeResourceTypes({resourceTypeId: toValue(resourceTypeIdRef)}).then(resp => {
            if (resp.resourceTypes?.length > 0) {
                resourceTypeDef.value = resp.resourceTypes[0]
            }else {
                return Promise.reject('Resource type not found.')
            }
        })
    }

    watchEffect(fetchData)

    return resourceTypeDef
}


class ResourceContext {
    constructor() {
        this.sharedTargetIds = ref([])
        this.sharedTargetRefCountMap = new Map()
        this.sharedTargetTypeMap = new Map()
    }

    getSharedTargetRefCount(targetId) {
        if(this.sharedTargetRefCountMap.has(targetId)){
            return this.sharedTargetRefCountMap.get(targetId)
        } else {
            return 0
        }
    }

    increaseSharedTargetRefCount(targetId){
        if(this.sharedTargetRefCountMap.has(targetId)){
            const c = this.sharedTargetRefCountMap.get(targetId)
            this.sharedTargetRefCountMap.set(targetId, c+1)
        } else {
            this.sharedTargetRefCountMap.set(targetId, 1)
        }
    }

    decreaseSharedTargetRefCount(targetId){
        if(this.sharedTargetRefCountMap.has(targetId)){
            const c = this.sharedTargetRefCountMap.get(targetId)
            if(c > 0){
                this.sharedTargetRefCountMap.set(targetId, c-1)
            } else {
                this.sharedTargetRefCountMap.set(targetId, 0)
            }
        }

        this.clearZeroCountSharedTargetIds()
    }


    clearZeroCountSharedTargetIds(){
        this.sharedTargetRefCountMap.forEach((v, k)=>{
            if(v === undefined || v === 0){
                this.removeSharedTargetId(k)
            }
        })
    }

    removeSharedTargetId(targetId) {
        const index = this.sharedTargetIds.value.indexOf(targetId)

        if(index >= 0){
            this.sharedTargetIds.value.splice(index, 1)
        }

        this.sharedTargetTypeMap.delete(targetId)
    }

    addSharedTargetId(targetId, targetType){
        if(this.sharedTargetIds.value.indexOf(targetId) < 0){
            this.sharedTargetIds.value.push(targetId)
        }
        this.sharedTargetTypeMap.set(targetId, targetType)
        this.increaseSharedTargetRefCount(targetId)
    }

    getTargetIdsByType(targetType){
        const result = []
        this.sharedTargetTypeMap.forEach((v, k)=>{
            if(v === targetType){
                result.push(k)
            }
        })
        return result
    }


    setAllTargetIdsZeroByType(targetType, excludedId){
        const targetIdsToBeSetZero = this.getTargetIdsByType(targetType).filter(
            targetId => excludedId !== targetId
        )
        targetIdsToBeSetZero.forEach(value => this.sharedTargetRefCountMap.set(value, 0))
        this.clearZeroCountSharedTargetIds()
    }
}

export function useIsolatedResourceContext(){
    return new ResourceContext()
}


export function useResourceContextProvider(){
    const resourceContext = new ResourceContext()
    provide('resourceContext', resourceContext)
    return resourceContext
}

export function useResourceContext(resourceTypeDef, resourceIdRef) {
    const resourceContext = inject('resourceContext', new ResourceContext())

    const localTargetIds = ref([])

    function checkSharedRequirementTargets() {
        if (!resourceIdRef.value) {
            localTargetIds.value.forEach(
                localTargetId=>resourceContext.decreaseSharedTargetRefCount(localTargetId)
            )
            localTargetIds.value = []
            return;
        }
        if(!resourceTypeDef.value){
            return;
        }
        if (resourceTypeDef.value.requirements?.length <= 0) {
            return;
        }
        for (let r of resourceTypeDef.value.requirements) {
            if (!r.targetSpec.sharedRequirementTarget) {
                continue;
            }
            describeRequirements({
                sourceId: resourceIdRef.value,
                relationshipType: r.relationshipSpec.relationshipTypeId,
                size: 100
            }).then(resp => {
                if (!resp.content) {
                    return;
                }

                const relationshipsToAdd = []
                for (let relationship of resp.content) {
                    const currentTargetIdsByType = resourceContext.getTargetIdsByType(relationship.target.type)

                    if(currentTargetIdsByType.length > 0 &&
                        !currentTargetIdsByType.some(e => e === relationship.target.id)){
                        continue
                    }
                    relationshipsToAdd.push(relationship)
                }

                for (let relationshipToAdd of relationshipsToAdd) {
                    localTargetIds.value.push(relationshipToAdd.target.id)
                    resourceContext.addSharedTargetId(relationshipToAdd.target.id, relationshipToAdd.target.type)
                }
            })
        }
    }
    watchEffect(checkSharedRequirementTargets)


    return resourceContext
}

export function useResourceContextForSharedTargetItself(resourceTypeDef, resourceIdRef) {
    const resourceContext = inject('resourceContext', new ResourceContext())

    const localTargetId = ref()

    function checkSharedRequirementTargets() {
        if(!resourceTypeDef.value){
            return;
        }

        if(!resourceIdRef.value){
            if(localTargetId.value){
                resourceContext.decreaseSharedTargetRefCount(localTargetId.value)
                localTargetId.value = undefined
            }
        } else {
            if(!localTargetId.value){
                localTargetId.value = resourceIdRef.value
                resourceContext.setAllTargetIdsZeroByType(resourceTypeDef.value.spec.resourceTypeId, resourceIdRef.value)
                resourceContext.addSharedTargetId(resourceIdRef.value, resourceTypeDef.value.spec.resourceTypeId)
            }
        }
    }
    watchEffect(checkSharedRequirementTargets)


    return resourceContext
}