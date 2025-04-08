<script setup>

import {onMounted, ref} from "vue";
import {ElForm, ElMessage} from "element-plus";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";
import {Bottom} from "@element-plus/icons-vue";
import {useResourceContextProvider} from '@/views/resource/composables/ResourceContext.js'
import RelationshipPropertiesForm from '@/views/resource/forms/relationship/RelationshipPropertiesForm.vue'
import {describeRelationshipSpec} from '@/api/resource.js'
import {connectResourcesFormData} from '@/utils/DefaultFormData.js'
import {cloneDeep} from 'lodash'


const formData = defineModel({
	required: true,
	default: connectResourcesFormData
})

useResourceContextProvider()

const formRef = ref()

const sourceResourceRef = ref()
const targetResourceRef = ref()

const relationshipSpec = ref()

onMounted(()=>{
	if(!formData.value || !formData.value.relationshipTypeId){
		return
	}

	describeRelationshipSpec({relationshipTypeId: formData.value.relationshipTypeId}).then(resp=>{
		relationshipSpec.value = resp.spec
	})
})

const rules = ref({
	sourceResourceId: [{required: true, message: '请选择资源'}],
	targetResourceId: [{required: true, message: '请选择资源'}],
})

function validate(callback){
	formRef.value.validate(callback)
}

function getDefaultFormData(){
	return cloneDeep(connectResourcesFormData)
}

defineExpose({validate, getDefaultFormData})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules" v-if="relationshipSpec">
		<ElFormItem :label="sourceResourceRef?.getCategoryName()" prop="sourceResourceId">
			<ResourceSelector
				ref="sourceResourceRef"
				v-model="formData.sourceResourceId"
				:resource-type-id="relationshipSpec.sourceResourceTypeId"
				:disabled-flag-getter="item=>!relationshipSpec.allowedSourceStates?.includes(item.state) || item.recycled"
			/>
		</ElFormItem>
		<ElFormItem><ElText type="success">挂载到<ElIcon><Bottom /></ElIcon></ElText></ElFormItem>
		<ElFormItem :label="targetResourceRef?.getCategoryName()" prop="targetResourceId">
			<ResourceSelector
				ref="targetResourceRef"
				v-model="formData.targetResourceId"
				:resource-type-id="relationshipSpec.targetResourceTypeId"
				:disabled-flag-getter="item=>!relationshipSpec.allowedTargetStates?.includes(item.state) || item.recycled"
			/>
		</ElFormItem>
		<RelationshipPropertiesForm
			:relationship-type-id="formData.relationshipTypeId"
			v-model="formData.relationshipInputs" />
	</ElForm>
</template>

<style scoped>

</style>