<script setup>
import {computed, onMounted, ref} from "vue";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";
import RelationshipPropertiesForm from '@/views/resource/forms/relationship/RelationshipPropertiesForm.vue'
import {validateForms} from '@/utils/FormUtil.js'

const props = defineProps({
	newRequirements: {
		required: true,
	},
	requirementDef: {
		required: true,
	},
})


const emits = defineEmits(['addNewRequirement', 'removeRequirements'])

const switchOn = ref(false)

function addNewRequirementIfAbsent() {
	if (props.newRequirements.length === 0) {
		let tempRequirement = {
			relationshipTypeId: props.requirementDef.relationshipSpec.relationshipTypeId,
			relationshipInputs: {}
		}
		emits('addNewRequirement', tempRequirement)
	}
}

function handleSwitchChange(isSwitchOn){
	if(isSwitchOn){
		addNewRequirementIfAbsent()
	}else {
		emits('removeRequirements', props.requirementDef)
	}
}

onMounted(()=>{
	if(props.newRequirements.length > 0){
		switchOn.value = true
	}
})

function disabledFlagGetter(item){
	return !props.requirementDef.relationshipSpec.allowedTargetStates.includes(item.state) || item.recycled
}

const categoryName = computed(()=>props.requirementDef.targetSpec.resourceCategoryName)

const formRef = ref()

function validate(callback){
	validateForms(
		[formRef.value, ...propertiesFormRefs.value],
		callback
	)
}

defineExpose({validate})

const propertiesFormRefs = ref([])

</script>

<template>
	<ElForm ref="formRef" :model="newRequirements" label-position="top">
		<ElRow :gutter="12">
			<ElCol :span="4">
				{{requirementDef.relationshipSpec.requirementName}}
			</ElCol>
			<ElCol :span="4">
				<ElFormItem>
					<ElCheckbox v-model="switchOn" @change="handleSwitchChange">
						{{requirementDef.relationshipSpec.connectActionName}}
					</ElCheckbox>
				</ElFormItem>
			</ElCol>
			<ElCol :span="16">
				<template v-if="switchOn">
					<template v-for="(newRequirement, index) in newRequirements">
						<ElFormItem :prop="index+'.targetResourceId'" required :show-message="false">
							<ResourceSelector
								v-model="newRequirement.targetResourceId"
								:resource-type-id="requirementDef.targetSpec.resourceTypeId"
								:disabled-flag-getter="disabledFlagGetter"
								:placeholder="'请选择'+categoryName"
							/>
						</ElFormItem>
						<RelationshipPropertiesForm
							ref="propertiesFormRefs"
							:relationship-type-id="newRequirement.relationshipTypeId"
							v-model="newRequirement.relationshipInputs" />
					</template>
				</template>

			</ElCol>
		</ElRow>



	</ElForm>
</template>

<style scoped>

</style>