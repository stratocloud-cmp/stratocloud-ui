<script setup>
import { ElForm, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import UserGroupSelector from '@/views/usergroup/UserGroupSelector.vue'
import AccountSelector from '@/views/account/AccountSelector.vue'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	accountIds: [{required: true, message: '请选择云账号'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="云账号" prop="accountIds">
			<AccountSelector v-model="formData.accountIds" multiple />
		</ElFormItem>
	</ElForm>
</template>