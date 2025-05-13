<script setup>
import {onMounted, ref} from 'vue'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import NotificationProviderSelector from '@/views/notification/components/NotificationProviderSelector.vue'
import {describeNotificationWays} from '@/api/notification.js'

const formData = defineModel({
	required: true,
	default: {
		notificationWayId: undefined,
		name: undefined,
		description: undefined,
		properties: {},
	}
})

const formRef = ref()
const dynamicFormRef = ref()

defineExpose({validate})

function validate(callback) {
	dynamicFormRef.value.validate((valid, _fields)=>{
		if(!valid) return
		formRef.value.validate(callback)
	})
}

const rules = ref({
	name: [{required: true, message: '请输入通知方式名称'}],
})

const selectedProvider = ref()
function onProviderSelected(provider) {
	selectedProvider.value = provider
}

const notificationWay = ref()

onMounted(() => {
	describeNotificationWays(
		{
			notificationWayIds: [formData.value.notificationWayId]
		}
	).then(resp=>{
		if(resp.content && resp.content.length > 0){
			notificationWay.value = resp.content[0]
		}
	})
})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="通知类型" prop="providerId">
			<NotificationProviderSelector v-if="notificationWay" disabled @change="onProviderSelected" :model-value="notificationWay.providerId" />
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
