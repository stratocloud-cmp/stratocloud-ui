<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'

const formData = defineModel({})

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	userGroupId: [{required: true, message: '请选择用户组'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="加入用户组" prop="userGroupId">
			<UserGroupSelector all-groups v-model="formData.userGroupId" />
		</ElFormItem>
	</ElForm>
</template>