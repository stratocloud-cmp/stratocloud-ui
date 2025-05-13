<script setup>
import {ref} from 'vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import NotificationEventTypeSelector from '@/views/notification/components/NotificationEventTypeSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'
import RoleSelector from '@/views/role/RoleSelector.vue'
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'
import NotificationWaySelector from '@/views/notification/components/NotificationWaySelector.vue'
import StratoCodeBlock from '@/components/StratoCodeBlock.vue'

const formData = defineModel({
	required: true
})

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	tenantId: [{required: true, message: '请选择租户'}],
	eventType: [{required: true, message: '请选择事件类型'}],
	policyKey: [{required: true, message: '请输入通知策略标识'}],
	name: [{required: true, message: '请输入通知策略名称'}],
	receiverType: [{required: true, message: '请选择接收者类型'}],
	notificationWayId: [{required: true, message: '请选择通知方式'}],
	template: [{required: true, message: '请输入通知模板'}],
	maxNotificationTimes: [{required: true, message: '请输入最大通知次数'}],
	notificationIntervalMinutes: [{required: true, message: '请输入通知间隔'}],
})

const selectedEventType = ref()
function onEventTypeSelected(eventType) {
	selectedEventType.value = eventType
}



</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="租户" prop="tenantId">
			<TenantTreeSelector v-model="formData.tenantId" />
		</ElFormItem>
		<ElFormItem label="通知策略标识" prop="policyKey">
			<ElInput v-model="formData.policyKey" />
		</ElFormItem>
		<ElFormItem label="通知策略名称" prop="name">
			<ElInput v-model="formData.name" />
		</ElFormItem>
		<ElFormItem label="接收者类型" prop="receiverType">
			<ElSelect v-model="formData.receiverType">
				<ElOption label="指定用户" value="PRESET_USERS" />
				<ElOption label="指定角色" value="PRESET_ROLES" />
				<ElOption label="指定用户组" value="PRESET_USER_GROUPS" />
				<ElOption label="事件对象所有者" value="EVENT_OBJECT_OWNER" />
				<ElOption label="工单审批人" value="ORDER_HANDLERS" />
			</ElSelect>
		</ElFormItem>
		<ElFormItem v-if="formData.receiverType==='PRESET_USERS'" label="接收用户" prop="presetUserIds">
			<UserSelector v-model="formData.presetUserIds" multiple />
		</ElFormItem>
		<ElFormItem v-if="formData.receiverType==='PRESET_ROLES'" label="接收角色" prop="presetRoleIds">
			<RoleSelector v-model="formData.presetRoleIds" multiple />
		</ElFormItem>
		<ElFormItem v-if="formData.receiverType==='PRESET_USER_GROUPS'" label="接收用户组" prop="presetUserGroupIds">
			<UserGroupSelector v-model="formData.presetUserGroupIds" multiple />
		</ElFormItem>
		<ElFormItem label="通知方式" prop="notificationWayId">
			<NotificationWaySelector v-model="formData.notificationWayId" />
		</ElFormItem>


		<ElFormItem label="最大通知次数" prop="maxNotificationTimes">
			<ElInputNumber v-model="formData.maxNotificationTimes" :min="1" :max="10" />
		</ElFormItem>
		<ElFormItem label="通知间隔(分钟)" prop="notificationIntervalMinutes">
			<ElInputNumber v-model="formData.notificationIntervalMinutes" :min="1" :max="300" />
		</ElFormItem>
		<ElFormItem label="事件类型" prop="eventType">
			<NotificationEventTypeSelector @change="onEventTypeSelected" v-model="formData.eventType" />
		</ElFormItem>
		<ElFormItem v-if="selectedEventType" label="事件参数示例">
			<StratoCodeBlock read-only :model-value="selectedEventType.eventPropertiesExample" language="json" />
		</ElFormItem>
		<ElFormItem label="通知模板" prop="template">
			<StratoCodeBlock style="height: 600px" v-model="formData.template" language="html" />
		</ElFormItem>
		<ElFormItem label="描述" prop="description">
			<ElInput type="textarea" v-model="formData.description" />
		</ElFormItem>


	</ElForm>
</template>

<style scoped>

</style>
