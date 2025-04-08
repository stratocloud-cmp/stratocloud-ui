<script setup>

import {onMounted, ref} from 'vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'

const formRef = ref()

const formData = defineModel()

onMounted(() => {
	if(formData.value){
		if(!formData.value.tags){
			formData.value.tags = []
		}
	}
})

const rules = ref({
	name: [{required: true, message: '请输入资源栈名称'}],
	tags: [{validator: (rule,value,callback)=>tagRef.value?.validate(rule,value,callback), trigger: 'change'}],
})

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

const tagRef = ref()


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="资源栈名称" prop="name">
			<ElInput v-model="formData.name" />
		</ElFormItem>
		<ElFormItem label="到期时间">
			<ElDatePicker
				style="width: 100%"
				type="datetime"
				v-model="formData.expireTime"
				value-format="YYYY-MM-DD HH:mm:ss"
			/>
		</ElFormItem>
		<ElFormItem label="标签" prop="tags">
			<TagValueSelectorGroup
				ref="tagRef"
				:entry-paging-request="{userGroupTaggable: true}"
				v-model="formData.tags"
			/>
		</ElFormItem>
		<ElFormItem label="描述">
			<ElInput type="textarea" v-model="formData.description" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>