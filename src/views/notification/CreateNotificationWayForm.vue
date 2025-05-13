<script setup>
import {ref} from 'vue'
import ProviderSelector from '@/views/resource/components/ProviderSelector.vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import NotificationProviderSelector from '@/views/notification/components/NotificationProviderSelector.vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'

const formData = defineModel({
	required: true,
	default: {
		tenantId: undefined,
		providerId: undefined,
		name: undefined,
		description: undefined,
		properties: {},
	}
})

const formRef = ref()
const dynamicFormRef = ref()

defineExpose({validate})

function validate(callback) {
	dynamicFormRef.value.validate((valid, fields)=>{
		if(!valid) return
		formRef.value.validate(callback)
	})
}

const rules = ref({
	tenantId: [{required: true, message: '请选择租户'}],
	providerId: [{required: true, message: '请选择通知类型'}],
	name: [{required: true, message: '请输入通知方式名称'}],
})

const selectedProvider = ref()
function onProviderSelected(provider) {
	selectedProvider.value = provider
}

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="租户" prop="tenantId">
			<TenantTreeSelector v-model="formData.tenantId" />
		</ElFormItem>
		<ElFormItem label="通知类型" prop="providerId">
			<NotificationProviderSelector @change="onProviderSelected" v-model="formData.providerId" />
		</ElFormItem>
		<ElFormItem label="通知方式名称" prop="name">
			<ElInput v-model="formData.name" />
		</ElFormItem>
		<StratoDynamicForm
			ref="dynamicFormRef"
			v-if="selectedProvider"
			:form-meta-data="selectedProvider?.formMetaData"
			v-model="formData.properties" />
		<ElFormItem label="描述" prop="description">
			<ElInput type="textarea" v-model="formData.description" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>
