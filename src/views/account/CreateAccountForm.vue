<script setup>
import {ref} from 'vue'
import ProviderSelector from '@/views/resource/components/ProviderSelector.vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'

const formData = defineModel({
	required: true,
	default: {
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
	providerId: [{required: true, message: '请选择云平台'}],
	name: [{required: true, message: '请输入云账号名称'}],
})

const selectedProvider = ref()
function onProviderSelected(provider) {
	selectedProvider.value = provider
}

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="云平台" prop="providerId">
			<ProviderSelector @change="onProviderSelected" v-model="formData.providerId" />
		</ElFormItem>
		<ElFormItem label="云账号名称" prop="name">
			<ElInput v-model="formData.name" />
		</ElFormItem>
		<StratoDynamicForm
			ref="dynamicFormRef"
			v-if="selectedProvider"
			:form-meta-data="selectedProvider?.accountFormMetaData"
			v-model="formData.properties" />
		<ElFormItem label="云账号描述" prop="description">
			<ElInput type="textarea" v-model="formData.description" />
		</ElFormItem>


	</ElForm>
</template>

<style scoped>

</style>