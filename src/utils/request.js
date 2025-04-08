import axios from 'axios';
import {ElMessageBox, ElNotification} from 'element-plus';
import { useSessionStore } from '@/stores/session';
import {throttle} from 'lodash'
import stratoRouter from '@/router/index.js'
import {ref} from 'vue'
import {uploadLicense} from '@/api/license.js'

const sessionStore = useSessionStore();


function popErrorMessage(message){
    ElNotification({
        title: '错误',
        message: message,
        type: 'error',
    })
}

const throttledPopErrorMessage = throttle(
    popErrorMessage, 500, {trailing: false}
);



const service = axios.create({
    baseURL: '/api',
    timeout: 60000
});

service.interceptors.request.use(
    config => {
        config.headers['X-Auth-Token'] = sessionStore.session?.token;
        return config;
    },
    error => {
        console.error(error);
        return Promise.reject();
    }
);

const premiumOnlyNotified = ref(false)

const licenseInvalidNotified = ref(false)

service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if(!error.response || !error.response.data){
            throttledPopErrorMessage(error.message)
            return Promise.reject();
        }

        if (error.response.data._errorCode) {
            if (error.response.data._errorCode === 4011) {
                stratoRouter.push('/login')
                return Promise.reject();
            }else if (error.response.data._errorCode === 4032) {
                if(!premiumOnlyNotified.value){
                    ElMessageBox.alert(
                        error.response.data._errorMessage,
                        '商业版功能',
                        {callback: ()=>premiumOnlyNotified.value = false}
                    )
                    premiumOnlyNotified.value = true
                }

                return Promise.reject();
            }else if (error.response.data._errorCode === 4033) {
                if(!licenseInvalidNotified.value){
                    licenseInvalidNotified.value = true
                    ElMessageBox.prompt(
                        error.response.data._errorMessage,
                        '许可证存在问题',
                        {
                            type: 'warning',
                            confirmButtonText: '更新许可证',
                            inputPlaceholder: '在此处粘贴您的许可证',
                            inputType: 'textarea',
                            showCancelButton: false,
                            closeOnClickModal: false,
                            closeOnEsc: false,
                            closeOnPressEscape: false,
                            closeOnHashChange: false,
                            showClose: false,
                            icon: 'Warning',
                            customStyle: {
                                minWidth: '500px'
                            }
                        }
                    ).then(({value}) => {
                        uploadLicense({licenseText: value}).then(resp => {
                            ElNotification.success('许可证上传成功')
                            window.location.reload()
                        }).catch(() => {
                            licenseInvalidNotified.value = false
                        })
                    })
                }
            }else{
                throttledPopErrorMessage(error.response.data._errorMessage)
                return Promise.reject();
            }
        }else{
            throttledPopErrorMessage(error.message)
            return Promise.reject();
        }
    }
);



export default service;
