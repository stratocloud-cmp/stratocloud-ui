<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus';
import { onMounted, ref } from 'vue';
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
    formRef.value.validate(callback)
}

const rules = ref({
    tenantId: [{required: true, message: '请选择所属租户'}],
    loginName: [{required: true, message: '请输入用户名'}],
    realName: [{required: true, message: '请输入姓名'}],
    password: [{required: true, message: '请输入密码'}]
})


onMounted(()=>{
    
})

</script>

<template>
    <ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
        <ElFormItem label="所属租户" prop="tenantId">
            <TenantTreeSelector v-model="formData.tenantId" />
        </ElFormItem>
        <ElFormItem label="登录名" prop="loginName">
            <ElInput v-model="formData.loginName" placeholder="请输入登录名" />
        </ElFormItem>
        <ElFormItem label="姓名" prop="realName">
            <ElInput v-model="formData.realName" placeholder="请输入姓名" />
        </ElFormItem>
        <ElFormItem label="密码" prop="password">
            <ElInput autocomplete="new-password" type="password" show-password v-model="formData.password" placeholder="请输入密码" />
        </ElFormItem>
        <ElFormItem label="邮箱">
            <ElInput v-model="formData.emailAddress" placeholder="请输入邮箱" />
        </ElFormItem>
        <ElFormItem label="手机号" placeholder="请输入手机号">
            <ElInput v-model="formData.phoneNumber" placeholder="请输入手机号" />
        </ElFormItem>
        <ElFormItem label="描述">
            <ElInput type="textarea" v-model="formData.description" placeholder="请输入描述" />
        </ElFormItem>
    </ElForm>
</template>