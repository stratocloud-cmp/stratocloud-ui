<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus';
import { onMounted, ref } from 'vue';
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'

const formData = defineModel({})

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const tagRef = ref()

const rules = ref({
	tenantId: [{required: true, message: '请选择所属租户'}],
	name: [{required: true, message: '请输入用户组名称'}],
	alias: [{required: true, message: '请输入用户组别名'}],
	tags: [{validator: (rule,value,callback)=>tagRef.value?.validate(rule,value,callback), trigger: 'change'}],
})


onMounted(()=>{

})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="所属租户" prop="tenantId">
			<TenantTreeSelector v-model="formData.tenantId" />
		</ElFormItem>
		<ElFormItem label="名称" prop="name">
			<ElInput v-model="formData.name" placeholder="请输入用户组名称" />
		</ElFormItem>
		<ElFormItem label="别名" prop="alias">
			<ElInput v-model="formData.alias" placeholder="请输入用户组别名" />
		</ElFormItem>
		<ElFormItem label="标签" prop="tags">
			<TagValueSelectorGroup
				ref="tagRef"
				v-if="formData.tags"
				v-model="formData.tags"
				:entry-paging-request="{userGroupTaggable: true}"
				:default-add-all-entries="false"
			/>
		</ElFormItem>
		<ElFormItem label="描述" prop="description">
			<ElInput type="textarea" v-model="formData.description" placeholder="请输入描述" />
		</ElFormItem>
	</ElForm>
</template>