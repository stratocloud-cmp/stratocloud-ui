<script setup>
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'
import {ref} from 'vue'
import {validateForms} from '@/utils/FormUtil.js'
import SoftwareActionsForm from '@/views/software/SoftwareActionsForm.vue'
import SoftwareRequirementsForm from '@/views/software/SoftwareRequirementsForm.vue'


const model = defineModel({
	required: true,
	type: Object
})

const formRef = ref()
const actionsFormRef = ref()
const requirementsFormRef = ref()

function validate(callback){
	validateForms([formRef.value, actionsFormRef.value, requirementsFormRef.value], callback)
}

defineExpose({validate})

</script>

<template>
	<ElTabs>
		<ElTabPane label="基本信息">
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
						<ElFormItem label="软件标识" prop="definitionKey" required :show-message="false">
							<ElInput v-model="model.definitionKey" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="软件名称" prop="name" required :show-message="false">
							<ElInput v-model="model.name" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="软件类型" prop="softwareType" required :show-message="false">
							<ElSelect v-model="model.softwareType">
								<ElOption value="APPLICATION" label="应用" />
								<ElOption value="DATABASE" label="数据库" />
								<ElOption value="MIDDLEWARE" label="中间件" />
								<ElOption value="OTHER" label="其他" />
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="系统类型" prop="osType" required :show-message="false">
							<ElSelect v-model="model.osType">
								<ElOption value="Linux" label="Linux" />
								<ElOption value="Windows" label="Windows" />
								<ElOption value="Unknown" label="其他" />
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="4">
						<ElFormItem label="服务端口" prop="servicePort" required :show-message="false">
							<ElInputNumber :min="1" :max="65535" v-model="model.servicePort" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="4">
						<ElFormItem label="公用软件" prop="publicDefinition">
							<ElSwitch v-model="model.publicDefinition" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="4">
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
		</ElTabPane>

		<ElTabPane label="定义操作">
			<SoftwareActionsForm ref="actionsFormRef" v-model="model.actions" />
		</ElTabPane>

		<ElTabPane label="定义依赖">
			<SoftwareRequirementsForm ref="requirementsFormRef" v-model="model.requirements" />
		</ElTabPane>
	</ElTabs>
</template>

<style scoped>

</style>