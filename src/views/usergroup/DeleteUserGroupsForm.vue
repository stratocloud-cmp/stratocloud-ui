<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import {ref} from 'vue';
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	userGroupIds: [{required: true, message: '请选择用户组'}],
})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="待删除用户组" prop="userGroupIds">
			<UserGroupSelector multiple v-model="formData.userGroupIds" />
		</ElFormItem>
	</ElForm>
</template>
