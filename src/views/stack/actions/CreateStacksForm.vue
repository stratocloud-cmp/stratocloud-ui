<script setup>

import {onMounted, ref, watch} from 'vue'
import BlueprintSelector from '@/views/blueprint/BlueprintSelector.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'
import {generateCreateStacksCmd} from '@/api/blueprint.js'
import UserSelector from '@/views/user/UserSelector.vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import {validateForms} from '@/utils/FormUtil.js'
import ResourceStackNodeForm from '@/views/stack/actions/ResourceStackNodeForm.vue'
import {useResourceStackContextProvider} from '@/views/stack/ResourceStackContext.js'

const formRef = ref()

const formData = defineModel()

const blueprintId = ref()

onMounted(() => {
	if(formData.value){
		if (formData.value.blueprintId){
			blueprintId.value = formData.value.blueprintId
		}

		if(!formData.value.tags){
			formData.value.tags = []
		}
	}
})

const resourceCmdPending = ref(false)

function handleBlueprintChange(blueprint){
	if(!blueprint) return
	if(blueprint.id === formData.value?.blueprintId) return

	resourceCmdPending.value = true
	generateCreateStacksCmd({
		blueprintId: blueprint.id,
	}).then(resp => {
		formData.value = resp.cmd
	}).finally(() => {
		resourceCmdPending.value = false
	})
}

function validate(callback){
	validateForms([formRef.value, ...ResourceStackNodeFormRefs.value], callback)
}

defineExpose({validate})

const rules = ref({
	blueprintId: [{required: true, message: '请选择蓝图', trigger: 'blur'}],
	tenantId: [{required: true, message: '请选择租户', trigger: 'blur'}],
	ownerId: [{required: true, message: '请选择所有者', trigger: 'blur'}],
	tags: [{validator: (rule,value,callback)=>tagRef.value?.validate(rule,value,callback), trigger: 'change'}],
})

const tagRef = ref()

const ResourceStackNodeFormRefs = ref([])

const resourceStackContext = useResourceStackContextProvider()

watch(()=>formData.value?.tags, ()=>{
	resourceStackContext.tags.value = formData.value?.tags
}, {deep: true, immediate: true})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElFormItem label="蓝图" prop="blueprintId">
			<BlueprintSelector
				v-model="blueprintId"
				@change="handleBlueprintChange"
			/>
		</ElFormItem>
		<template v-if="blueprintId">
			<ElRow :gutter="12">
				<ElCol :span="12">
					<ElFormItem label="租户" prop="tenantId">
						<TenantTreeSelector v-model="formData.tenantId" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="所有者" prop="ownerId">
						<UserSelector v-model="formData.ownerId" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="资源栈名称">
						<ElInput v-model="formData.name" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="到期时间">
						<ElDatePicker
							style="width: 100%"
							type="datetime"
							v-model="formData.expireTime"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="数量">
						<ElInputNumber style="width: 100%" :min="1" v-model="formData.number" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="标签" prop="tags">
						<TagValueSelectorGroup
							ref="tagRef"
							:entry-paging-request="{
								userGroupTaggable: true,
								requiredWhenCreating: true,
							}"
							v-if="formData.tags && !resourceCmdPending"
							v-model="formData.tags"
							:default-add-all-entries="true"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="24">
					<ElFormItem label="描述">
						<ElInput type="textarea" v-model="formData.description" />
					</ElFormItem>
				</ElCol>
			</ElRow>

			<ElTabs v-if="!resourceCmdPending">
				<ElTabPane v-for="node in formData.nodes" :label="node.nodeName">
					<ResourceStackNodeForm
						ref="ResourceStackNodeFormRefs"
						:node="node"
						:nodes="formData.nodes"
						v-model="node.resourceCmd"
					/>
				</ElTabPane>
			</ElTabs>
		</template>
	</ElForm>
</template>

<style scoped>

</style>