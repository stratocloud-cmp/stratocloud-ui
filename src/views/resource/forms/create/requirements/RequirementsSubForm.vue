<script setup>
import {computed, ref} from "vue";
import SharedTargetEssentialsSubForm from "@/views/resource/forms/create/requirements/SharedTargetEssentialsSubForm.vue";
import NotSharedButEssentialSubForm from "@/views/resource/forms/create/requirements/NotSharedButEssentialSubForm.vue";
import ExclusiveButNotEssentialSubform
	from "@/views/resource/forms/create/requirements/ExclusiveButNotEssentialSubform.vue";
import NotExclusiveSubForm from "@/views/resource/forms/create/requirements/NotExclusiveSubForm.vue";
import {validateForms} from '@/utils/FormUtil.js'
import {useResourceStaceNodeContext} from '@/views/stack/ResourceStackNodeContext.js'

const newRequirements = defineModel({
	required: true,
	default: []
})

const props = defineProps({
	requirementDefs: {
		required: true,
		type: Array
	},
	showSharedTargets: {
		required: false,
		default: true,
	},
	isNested: {
		required: false,
		default: false,
		type: Boolean
	}
})

function isEssential(requirementDef){
	return requirementDef.relationshipSpec.essentialRequirement === true
}

function isSharedTarget(requirementDef){
	return requirementDef.targetSpec.sharedRequirementTarget === true
}

function isExclusive(requirementDef){
	return requirementDef.relationshipSpec.exclusiveRequirement === true
}

function isPrimaryCapability(requirementDef){
	return requirementDef.relationshipSpec.primaryCapability === true
}



function isSharedTargetEssential(requirementDef){
	return isEssential(requirementDef) && isSharedTarget(requirementDef) && !isPrimaryCapability(requirementDef)}

function isNotSharedButEssential(requirementDef){
	return isEssential(requirementDef) && !isSharedTarget(requirementDef) && !isPrimaryCapability(requirementDef)
}

function isExclusiveButNotEssential(requirementDef){
	return isExclusive(requirementDef) && !isEssential(requirementDef) && !isPrimaryCapability(requirementDef)
}

function isNotExclusive(requirementDef){
	return !isExclusive(requirementDef) && !isPrimaryCapability(requirementDef)
}

const resourceStackNodeContext = useResourceStaceNodeContext()

const sharedTargetEssentialDefs = computed(
	()=>props.requirementDefs
		.filter(isSharedTargetEssential)
		.filter(def => !resourceStackNodeContext.isIgnoredTargetType(def.targetSpec.resourceTypeId))
)

const notSharedButEssentialDefs = computed(
	()=>props.requirementDefs
		.filter(isNotSharedButEssential)
		.filter(def => !resourceStackNodeContext.isIgnoredTargetType(def.targetSpec.resourceTypeId))
)

const exclusiveButNotEssentialDefs = computed(
	()=>props.requirementDefs
		.filter(isExclusiveButNotEssential)
		.filter(def => !resourceStackNodeContext.isIgnoredTargetType(def.targetSpec.resourceTypeId))
)

const notExclusiveDefs = computed(()=>props.requirementDefs.filter(isNotExclusive))

function filterNewRequirementsByDef(requirementDef){
	if(newRequirements.value === undefined){
		return []
	}
	return newRequirements.value.filter(
		r=>r.relationshipTypeId === requirementDef.relationshipSpec.relationshipTypeId
	)
}

function onAddNewRequirement(newRequirement){
	newRequirements.value.push(newRequirement)
}

function handleRemoveRequirements(def){
	for (let i=newRequirements.value.length-1; i >= 0; i--) {
		let r = newRequirements.value[i]
		if(r.relationshipTypeId === def.relationshipSpec.relationshipTypeId){
			newRequirements.value.splice(i,1)
		}
	}
}

function handleRemoveRequirement(requirement){
	for (let i=newRequirements.value.length-1; i >= 0; i--) {
		let r = newRequirements.value[i]
		if(r === requirement){
			newRequirements.value.splice(i,1)
			break
		}
	}
}


const formRefs1 = ref([])
const formRefs2 = ref([])
const formRefs3 = ref([])
const formRefs4 = ref([])

function validate(callback){
	validateForms(
		[...formRefs1.value, ...formRefs2.value, ...formRefs3.value, ...formRefs4.value],
		callback
	)
}

defineExpose({validate})



</script>

<template>

	<template v-for="def in sharedTargetEssentialDefs">
		<SharedTargetEssentialsSubForm
			ref="formRefs1"
			v-show="showSharedTargets"
			@add-new-requirement="onAddNewRequirement"
			:new-requirements="filterNewRequirementsByDef(def)"
			:requirement-def="def"
			:is-nested="isNested"
		/>
	</template>

	<template v-for="def in notSharedButEssentialDefs">
		<NotSharedButEssentialSubForm
			ref="formRefs2"
			@add-new-requirement="onAddNewRequirement"
			:new-requirements="filterNewRequirementsByDef(def)"
			:requirement-def="def"
			:is-nested="isNested"
		/>
	</template>

	<template v-for="def in exclusiveButNotEssentialDefs">
		<ExclusiveButNotEssentialSubform
			ref="formRefs3"
			@add-new-requirement="onAddNewRequirement"
			@remove-requirements="handleRemoveRequirements"
			:new-requirements="filterNewRequirementsByDef(def)"
			:requirement-def="def" />
	</template>

	<template v-for="def in notExclusiveDefs">
		<NotExclusiveSubForm
			ref="formRefs4"
			@add-new-requirement="onAddNewRequirement"
			@remove-requirement="handleRemoveRequirement"
			:new-requirements="filterNewRequirementsByDef(def)"
			:requirement-def="def"
		/>
	</template>


</template>

<style scoped>

</style>