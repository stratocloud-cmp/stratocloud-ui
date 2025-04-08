<script setup>
import {onMounted, ref} from 'vue'
import {ElFormItem} from 'element-plus'
import {getValidatorByRegex} from '@/utils/regex.js'
import {ipRegex_IPv4, ipRegex_IPv6} from '@/views/ip/IpUtil.js'

const formData = defineModel()

const formRef = ref()

const props = defineProps({
	protocol: {
		required: true
	}
})

defineExpose({validate})
function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	startIp: [
		{required: true, message: '请输入起始IP'},
		{validator: ipValidator, trigger: 'blur'},
	],
	endIp: [
		{required: true, message: '请输入终止IP'},
		{validator: ipValidator, trigger: 'blur'},
	],
})

function ipValidator(rule, value, callback){
	if(!value) return callback(new Error('请输入IP'))
	if(props.protocol === 'IPv6'){
		getValidatorByRegex(ipRegex_IPv6, 'IP格式不正确')(rule, value, callback)
	}else {
		getValidatorByRegex(ipRegex_IPv4, 'IP格式不正确')(rule, value, callback)
	}
}

onMounted(()=>{

})
</script>

<template>

	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="起始IP" prop="startIp">
			<ElInput v-model="formData.startIp" placeholder="请输入起始IP" />
		</ElFormItem>
		<ElFormItem label="终止IP" prop="endIp">
			<ElInput v-model="formData.endIp" placeholder="请输入终止IP" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>