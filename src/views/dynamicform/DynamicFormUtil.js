import UserSelector from '@/views/user/UserSelector.vue'
import RoleSelector from '@/views/role/RoleSelector.vue'
import JobDefinitionSelector from '@/views/jobs/JobDefinitionSelector.vue'
import {defineComponent, h, inject, provide} from 'vue'
import ScriptDefinitionWrappedSelector from '@/views/script/ScriptDefinitionWrappedSelector.vue'

export function getSelectorComponentByEntityType(entityType) {
    switch (entityType) {
        case 'USER':
            return UserSelector
        case 'ROLE':
            return RoleSelector
        case 'JOB_DEFINITION':
            return JobDefinitionSelector
        case 'SCRIPT_DEFINITION':
            return ScriptDefinitionWrappedSelector
    }

    return defineComponent({
        setup(){
            return () => h(
                'div',{}, 'Unknown entity type:'+entityType
            )
        }
    })
}

class DynamicFormContext{
    constructor(formDataRef){
        this.formDataRef = formDataRef
        this.args = {}
    }

    isConditionsMatched(conditions){
        if(!conditions || conditions.length === 0) return true
        for (let condition of conditions) {
            const tempData = {
                ...this.formDataRef.value,
                isMatched: new Function('args', 'return '+condition)
            }

            if(!tempData.isMatched(this.args)) return false
        }
        return true
    }

    setArg(key, value){
        this.args[key] = value
    }

    setArgs(argList){
        if(!argList) return

        for (let key in argList) {
            this.setArg(key, argList[key])
        }
    }
}

export function useDynamicFormContextProvider(formDataRef){
    const dynamicFormContext = new DynamicFormContext(formDataRef)
    provide('dynamicFormContext', dynamicFormContext)
    return dynamicFormContext
}

export function useDynamicFormContext(){
    return inject('dynamicFormContext', new DynamicFormContext({}))
}