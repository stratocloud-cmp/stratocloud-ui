<script setup>
import {onMounted, ref, watch} from 'vue'
import {describeResourceActionForm} from '@/api/resource.js'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'
import {ElFormItem} from 'element-plus'
import {useResourceStackContext} from '@/views/stack/ResourceStackContext.js'
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'

const props = defineProps({
	resourceTypeSpec: {
		required: true,
	},
	enableDescription: {
		required: false,
		default: false,
		type: Boolean
	},
	enableTags: {
		required: false,
		default: false,
		type: Boolean
	},
	isPrimaryCapability: {
		required: false,
		default: false,
		type: Boolean
	},
})

const newResource = defineModel({
	required: true,
	default: {
		resourceTypeId: undefined,
		externalAccountId: undefined,
		resourceName: undefined,
		properties: {},
		tags: [],
		description: undefined,
	}
})

const formRef = ref()
const dynamicFormRef = ref()
defineExpose({validate})

function validate(callback) {
	formRef.value.validate(valid=>{
		if (!valid) {
			return
		}
		dynamicFormRef.value.validate(callback)
	})
}

const formMetaData = ref()

const accountContext = useAccountContext()
const dynamicFormLoading = ref(false)
watch(()=>accountContext.accountId.value, ()=>{
	dynamicFormLoading.value = true
	describeResourceActionForm({
		resourceTypeId: props.resourceTypeSpec.resourceTypeId,
		accountId: accountContext.accountId.value,
		actionId: 'BUILD_RESOURCE'
	}).then(resp=>{
		formMetaData.value = resp.formMetaData
	}).finally(()=>{
		dynamicFormLoading.value = false
	})
}, {immediate: true})

const tagRef = ref()

const rules = ref({
	tags: [{validator: (rule, value, callback) => tagRef.value?.validate(rule, value, callback), trigger: 'change'}],
})

const dynamicFormArgs = ref({
	isPrimaryCapability: props.isPrimaryCapability,
})

const resourceStackContext = useResourceStackContext()

watch(()=>resourceStackContext.tags.value, ()=>{
	const newTags = resourceStackContext.tags.value
	if(newTags){
		for (let stackTag of newTags) {
			if(newResource.value.tags){
				for (let resourceTag of newResource.value.tags) {
					if(stackTag.tagKey === resourceTag.tagKey && !resourceTag.tagValue){
						resourceTag.tagValue = stackTag.tagValue
						resourceTag.tagValueName = stackTag.tagValueName
					}
				}
			}
		}
	}
}, {deep: true, immediate: true})

</script>

<template>
	<ElForm ref="formRef" :model="newResource" :rules="rules" label-position="top">
		<StratoDynamicForm
			ref="dynamicFormRef"
			v-if="formMetaData && !dynamicFormLoading"
			:form-meta-data="formMetaData"
			v-model="newResource.properties"
			:args="dynamicFormArgs"
		/>
		<ElSkeleton v-else-if="dynamicFormLoading" :rows="3" animated />
		<ElFormItem prop="resourceName" :label="`${resourceTypeSpec.resourceCategoryName}名称`">
			<ElInput
				placeholder="留空将按命名规则自动生成"
				v-model="newResource.resourceName"
			/>
		</ElFormItem>
		<ElFormItem v-if="enableTags" label="标签" prop="tags">
			<TagValueSelectorGroup
				ref="tagRef"
				v-if="newResource.tags"
				v-model="newResource.tags"
				:entry-paging-request="{
					requiredWhenCreating: true,
					resourceCategories: [resourceTypeSpec.resourceCategoryId]
				}"
				:default-add-all-entries="true"
			/>
		</ElFormItem>
		<ElFormItem prop="description" label="描述" v-if="enableDescription">
			<ElInput type="textarea" v-model="newResource.description" />
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>
