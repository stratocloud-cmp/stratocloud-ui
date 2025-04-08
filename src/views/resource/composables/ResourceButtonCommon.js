import {useActiveJobStore} from '@/stores/activeJob.js'
import {ref, toValue} from 'vue'
import {runAsyncJob} from '@/api/asyncJob.js'

export function useResourceButtonCommon(requestGetter, submittedCallback) {

    const activeJobStore = useActiveJobStore()

    const drawerFlag = ref(false)
    const buttonLoading = ref(false)
    const formRef = ref()

    function openDrawer(){
        drawerFlag.value = true
    }
    function confirm(){
        formRef.value.validate((valid)=>{
            if(!valid) return

            buttonLoading.value = true
            runAsyncJob(toValue(requestGetter)).then(resp => {
                activeJobStore.setActiveJobId(resp.jobId)
                submittedCallback()
                drawerFlag.value = false
            }).finally(() => {
                buttonLoading.value = false
            })
        })
    }

    return {
        drawerFlag, buttonLoading, formRef, openDrawer, confirm
    }
}