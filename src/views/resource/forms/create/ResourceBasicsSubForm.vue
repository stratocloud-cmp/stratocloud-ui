<script setup>

import {onMounted, ref} from "vue";
import AccountSelector from "@/views/account/AccountSelector.vue";
import ResourceTypeSelector from "@/views/resource/components/ResourceTypeSelector.vue";

const props = defineProps({
	resourceCategory: {
		required: false,
		default: undefined
	}
})

const newResource = defineModel({
	required: true,
	default: {
		resourceTypeId: undefined,
		externalAccountId: undefined,
		resourceName: undefined,
		properties: {},
		tags: undefined,
		description: undefined,
	}
})

const providerId = ref()

const formRef = ref()

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

const rules = ref({
	externalAccountId: [{required: true, message: '请选择云账号'}],
	resourceTypeId: [{required: true, message: '请选择资源类型'}],
})

const accountSelectorDisabled = ref(false)

onMounted(()=>{

	if(newResource.value?.externalAccountId){
		accountSelectorDisabled.value = true
	}
})


</script>

<template>
	<ElForm ref="formRef" :model="newResource" :rules="rules">
		<ElRow :gutter="12">
			<ElCol :span="4">
				资源类型
			</ElCol>
			<ElCol :span="10">
				<ElFormItem prop="externalAccountId">
					<AccountSelector
						:disabled="accountSelectorDisabled"
						v-model="newResource.externalAccountId"
						v-model:provider-id="providerId"
						:resource-category="props.resourceCategory"
					/>
				</ElFormItem>
			</ElCol>
			<ElCol :span="10">
				<ElFormItem prop="resourceTypeId">
					<ResourceTypeSelector
						:disabled="newResource.resourceTypeId !== undefined && newResource.resourceTypeId.length !== 0"
						v-model="newResource.resourceTypeId"
						v-model:provider-id="providerId"
						:resource-category="props.resourceCategory"
						:disabled-option-predicate="item=>!item.spec.buildable"
					/>
				</ElFormItem>
			</ElCol>
		</ElRow>
	</ElForm>
</template>

<style scoped>

</style>