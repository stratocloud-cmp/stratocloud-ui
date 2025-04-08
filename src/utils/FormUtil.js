import {ElNotification} from 'element-plus'
import {debounce, throttle} from 'lodash'

export function validateForms(formRefs, callback){
    validateRecursively(formRefs, true, 0, callback)
}

const throttledNotifyError = throttle(
    ()=>ElNotification.error('表单校验失败'),
    3000,
    {
        trailing: false
    }
)


function validateRecursively(formRefs, isValid, index, callback){
    if(!formRefs[index]) {
        if(!isValid) throttledNotifyError()
        callback(isValid)
        return
    }

    formRefs[index].validate(valid => {
        validateRecursively(formRefs, isValid && valid, index+1, callback)
    })
}