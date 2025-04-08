<script setup>
import RemoteScriptDef from '@/views/script/RemoteScriptDef.vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'
import {ref} from 'vue'
import {validateForms} from '@/utils/FormUtil.js'


const model = defineModel({
	required: true,
	type: Object
})

const formRef = ref()
const scriptDefFormRef = ref()

function validate(callback){
	validateForms([formRef.value, scriptDefFormRef.value], callback)
}

defineExpose({validate})

</script>

<template>
	<ElForm ref="formRef" :model="model" label-position="top">
		<ElRow :gutter="24">
			<ElCol :span="12">
				<ElFormItem label="租户" prop="tenantId" required :show-message="false">
					<TenantTreeSelector v-model="model.tenantId" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="所有者" prop="ownerId" required :show-message="false">
					<UserSelector v-model="model.ownerId" />
				</ElFormItem>
			</ElCol>

			<ElCol :span="12">
				<ElFormItem label="脚本标识" prop="definitionKey" required :show-message="false">
					<ElInput v-model="model.definitionKey" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="脚本名称" prop="name" required :show-message="false">
					<ElInput v-model="model.name" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="6">
				<ElFormItem label="公用脚本" prop="publicDefinition">
					<ElSwitch v-model="model.publicDefinition" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="6">
				<ElFormItem label="在依赖目标中可见" prop="visibleInTarget">
					<ElSwitch v-model="model.visibleInTarget" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="12">
				<ElFormItem label="描述" prop="description">
					<ElInput type="textarea" v-model="model.description" />
				</ElFormItem>
			</ElCol>

		</ElRow>

	</ElForm>
	<RemoteScriptDef ref="scriptDefFormRef" v-model="model.remoteScriptDef" />
</template>

<style scoped>

</style>