<script setup>
import {onMounted, ref} from 'vue'
import {ElFormItem} from 'element-plus'
import {getValidatorByRegex} from '@/utils/regex.js'
import {cidrRegex_IPv4, cidrRegex_IPv6, ipRegex_IPv4, ipRegex_IPv6} from '@/views/ip/IpUtil.js'

const formData = defineModel()

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	name: [{required: true, message: '请输入规则名称'}],
	cidr: [{validator: cidrValidator, trigger: 'blur'},],
	gateway: [{validator: gatewayValidator, trigger: 'blur'},],
})

function cidrValidator(rule, value, callback){
	if(!value) return callback(new Error('请输入CIDR'))
	if(formData.value.protocol === 'IPv6'){
		getValidatorByRegex(cidrRegex_IPv6, 'CIDR格式不正确')(rule, value, callback)
	}else {
		getValidatorByRegex(cidrRegex_IPv4, 'CIDR格式不正确')(rule, value, callback)
	}
}
function gatewayValidator(rule, value, callback){
	if(!value) return callback(new Error('请输入网关'))
	if(formData.value.protocol === 'IPv6'){
		getValidatorByRegex(ipRegex_IPv6, '网关格式不正确')(rule, value, callback)
	}else {
		getValidatorByRegex(ipRegex_IPv4, '网关格式不正确')(rule, value, callback)
	}
}

onMounted(()=>{

})
</script>

<template>

	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="IP池名称" prop="name">
			<ElInput v-model="formData.name" placeholder="请输入IP池名称" />
		</ElFormItem>
		<ElFormItem label="CIDR" prop="cidr">
			<ElInput v-model="formData.cidr" placeholder="请输入CIDR" />
		</ElFormItem>
		<ElFormItem label="网关" prop="gateway">
			<ElInput v-model="formData.gateway" placeholder="请输入网关" />
		</ElFormItem>
		<ElFormItem label="描述" prop="description">
			<ElInput type="textarea" v-model="formData.description" placeholder="请输入描述" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>