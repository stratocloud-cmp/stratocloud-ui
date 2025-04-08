<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus';
import { onMounted, ref } from 'vue';

const formData = defineModel()

const formRef = ref()

defineExpose({validate})
function validate(callback) {
    formRef.value.validate(callback)
}

const rules = ref({
    realName: [{required: true, message: '请输入姓名'}]
})


onMounted(()=>{
    
})

</script>

<template>
    <ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
        <ElFormItem label="姓名" prop="realName">
            <ElInput v-model="formData.realName" placeholder="请输入姓名" />
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