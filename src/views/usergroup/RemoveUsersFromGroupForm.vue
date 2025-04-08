<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'

const formData = defineModel({})

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	userGroupId: [{required: true, message: '请选择用户组'}],
	userIds: [{required: true, message: '请选择用户'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="用户组" prop="userGroupId">
			<UserGroupSelector all-groups v-model="formData.userGroupId" />
		</ElFormItem>
		<ElFormItem label="移除用户" prop="userIds">
			<UserSelector multiple v-model="formData.userIds" />
		</ElFormItem>
	</ElForm>
</template>