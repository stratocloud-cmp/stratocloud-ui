<script setup>
import {onMounted, ref} from "vue";
import {ElForm} from "element-plus";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";
import {Bottom} from "@element-plus/icons-vue";
import {useResourceContextProvider} from '@/views/resource/composables/ResourceContext.js'
import RelationshipPropertiesForm from '@/views/resource/forms/relationship/RelationshipPropertiesForm.vue'
import {describeRelationshipSpec} from '@/api/resource.js'
import {changeEssentialTargetFormData} from '@/utils/DefaultFormData.js'
import {cloneDeep} from 'lodash'


const formData = defineModel({
	required: true,
	default: changeEssentialTargetFormData
})

useResourceContextProvider()

const formRef = ref()

const sourceResourceRef = ref()
const targetResourceRef = ref()

const relationshipSpec = ref()

onMounted(() => {
	if (!formData.value || !formData.value.relationshipTypeId) {
		return
	}

	describeRelationshipSpec({relationshipTypeId: formData.value.relationshipTypeId}).then(resp => {
		relationshipSpec.value = resp.spec
	})
})

const rules = ref({
	sourceId: [{required: true, message: '请选择资源'}],
	newTargetId: [{required: true, message: '请选择资源'}],
})

function validate(callback) {
	formRef.value.validate(callback)
}

function getDefaultFormData(){
	return cloneDeep(changeEssentialTargetFormData)
}

defineExpose({validate, getDefaultFormData})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules" v-if="relationshipSpec">
		<ElFormItem :label="sourceResourceRef?.getCategoryName()" prop="sourceId">
			<ResourceSelector
				ref="sourceResourceRef"
				v-model="formData.sourceId"
				:resource-type-id="relationshipSpec.sourceResourceTypeId"
				:disabled-flag-getter="item=>!relationshipSpec.allowedSourceStates?.includes(item.state) || item.recycled"
			/>
		</ElFormItem>
		<ElFormItem>
			<ElText type="success">变更{{targetResourceRef?.getCategoryName()}}
				<ElIcon>
					<Bottom/>
				</ElIcon>
			</ElText>
		</ElFormItem>
		<ElFormItem :label="targetResourceRef?.getCategoryName()" prop="newTargetId">
			<ResourceSelector
				ref="targetResourceRef"
				v-model="formData.newTargetId"
				:resource-type-id="relationshipSpec.targetResourceTypeId"
				:isolated-resource-context="relationshipSpec.isolatedTargetContext"
				:disabled-flag-getter="item=>!relationshipSpec.allowedTargetStates?.includes(item.state) || item.recycled"
			/>
		</ElFormItem>
		<RelationshipPropertiesForm
			:relationship-type-id="formData.relationshipTypeId"
			v-model="formData.relationshipInputs"/>
	</ElForm>
</template>

<style scoped>

</style>
