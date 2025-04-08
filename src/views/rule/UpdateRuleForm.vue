<script setup>
import {onMounted, ref} from 'vue'
import StratoCodeBlock from '@/components/StratoCodeBlock.vue'

const props = defineProps({
	isNamingRule: {
		required: false,
		default: false,
		type: Boolean
	}
})

const formData = defineModel()

const formRef = ref()

defineExpose({validate})
function validate(callback) {
	formRef.value.validate(callback)
}

const rules = ref({
	name: [{required: true, message: '请输入规则名称'}],
	script: [{required: true, message: '请粘贴JavaScript脚本'}],
	suffixType: [{required: true, message: '请选择后缀类型'}],
	suffixLength: [{required: true, message: '请输入后缀长度'}],
	suffixStartNumber: [{required: true, message: '请输入后缀起始数字'}],
})


onMounted(()=>{

})
</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="规则名称" prop="name">
			<ElInput v-model="formData.name" placeholder="请输入规则名称" />
		</ElFormItem>
		<ElFormItem label="JavaScript脚本" prop="script">
			<StratoCodeBlock v-model="formData.script" language="javascript" />
		</ElFormItem>

		<template v-if="isNamingRule">
			<ElFormItem label="后缀类型" prop="suffixType">
				<ElSelect v-model="formData.suffixType" placeholder="请选择后缀类型">
					<ElOption key="NONE" value="NONE" label="无后缀" />
					<ElOption key="RANDOM_STRING" value="RANDOM_STRING" label="随机字符串" />
					<ElOption key="NUMERIC_SEQUENCE" value="NUMERIC_SEQUENCE" label="数字序列" />
					<ElOption key="DYNAMIC_NUMERIC_SEQUENCE" value="DYNAMIC_NUMERIC_SEQUENCE" label="动态数字序列" />
				</ElSelect>
			</ElFormItem>
			<ElFormItem label="后缀长度" v-if="formData.suffixType && formData.suffixType!=='NONE'" prop="suffixLength">
				<ElInputNumber style="width: 100%" :min="1" v-model="formData.suffixLength" placeholder="请输入后缀长度" />
			</ElFormItem>
			<ElFormItem
				label="后缀起始数字"
				v-if="formData.suffixType==='NUMERIC_SEQUENCE' || formData.suffixType==='DYNAMIC_NUMERIC_SEQUENCE'"
				prop="suffixStartNumber"
			>
				<ElInputNumber style="width: 100%" :min="0" v-model="formData.suffixStartNumber" placeholder="请输入后缀起始数字" />
			</ElFormItem>
		</template>
	</ElForm>
</template>

<style scoped>

</style>