<script setup>

import {ref} from 'vue'
import UserSelector from '@/views/user/UserSelector.vue'
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'

const formData = defineModel({})
const formRef = ref()

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})
</script>

<template>
	<ElForm ref="formRef" :model="formData" >
		<ElFormItem prop="userGroupId" label="用户组">
			<UserGroupSelector v-model="formData.userGroupId" />
		</ElFormItem>
		<ElFormItem prop="userIds" label="新成员">
			<UserSelector multiple v-model="formData.userIds" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>