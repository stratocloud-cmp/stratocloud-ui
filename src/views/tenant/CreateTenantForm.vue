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
    parentId: [{required: true, message: '请选择父级租户'}],
    name: [{required: true, message: '请输入租户名称'}],
})


onMounted(()=>{
    
})

</script>

<template>
    <ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
        <ElFormItem label="租户名称" prop="name">
            <ElInput v-model="formData.name" placeholder="请输入租户名称" />
        </ElFormItem>
        <ElFormItem label="父级租户" prop="parentId">
            <TenantTreeSelector v-model="formData.parentId" />
        </ElFormItem>
        <ElFormItem label="描述">
            <ElInput type="textarea" v-model="formData.description" placeholder="请输入描述" />
        </ElFormItem>
    </ElForm>
</template>