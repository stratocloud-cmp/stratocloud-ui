<script setup>
import { ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue';

const formData = defineModel()

const formRef = ref()

defineExpose({validate})
function validate(callback) {
    formRef.value.validate(callback)
}

const rules = ref({
    name: [{required: true, message: '请输入角色名称'}],
    roleType: [{required: true, message: '请选择角色类型'}]
})

</script>

<template>
    <ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
        <ElFormItem label="角色名称" prop="name">
            <ElInput v-model="formData.name" placeholder="请输入角色名称" />
        </ElFormItem>
        <ElFormItem label="角色类型" prop="roleType">
            <ElSelect style="width: 100%;" v-model="formData.roleType" placeholder="请选择角色类型">
                <ElOption label="全局超级管理员" value="SUPER_ADMIN" />
                <ElOption label="租户级超级管理员" value="TENANT_SUPER_ADMIN" />
                <ElOption label="租户级管理员" value="TENANT_ADMIN" />
                <ElOption label="普通用户" value="NORMAL_USER" />
            </ElSelect>
        </ElFormItem>
        <ElFormItem label="描述">
            <ElInput type="textarea" v-model="formData.description" placeholder="请输入描述" />
        </ElFormItem>
    </ElForm>
</template>