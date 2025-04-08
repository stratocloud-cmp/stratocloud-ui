<script setup>

import {computed, onMounted, ref} from 'vue'
import PrimaryCapabilitySubForm from '@/views/resource/forms/create/capabilities/PrimaryCapabilitySubForm.vue'
import NotPrimaryCapabilitySubForm from '@/views/resource/forms/create/capabilities/NotPrimaryCapabilitySubForm.vue'
import {validateForms} from '@/utils/FormUtil.js'
import {useResourceStaceNodeContext} from '@/views/stack/ResourceStackNodeContext.js'

const newCapabilities = defineModel({
	required: true,
})

const props = defineProps({
	capabilityDefs: {
		required: true,
	}
})

function isPrimaryCapability(capabilityDef){
	return capabilityDef.relationshipSpec.primaryCapability === true
}

function isVisible(capabilityDef){
	return capabilityDef.relationshipSpec.visibleInTarget === true
}

function filterNewCapabilitiesByDef(capabilityDef){
	if(newCapabilities.value === undefined){
		return []
	}
	return newCapabilities.value.filter(
		c=>c.relationshipTypeId === capabilityDef.relationshipSpec.relationshipTypeId
	)
}

function onAddNewCapability(newCapability){
	newCapabilities.value.push(newCapability)
}

function handleRemoveCapability(capability){
	newCapabilities.value.splice(newCapabilities.value.indexOf(capability), 1)
}

function handleRemoveCapabilitiesByDef(def){
	for (let i=newCapabilities.value.length-1; i >= 0; i--) {
		let r = newCapabilities.value[i]
		if(r.relationshipTypeId === def.relationshipSpec.relationshipTypeId){
			newCapabilities.value.splice(i,1)
		}
	}
}

const resourceStackNodeContext = useResourceStaceNodeContext()

const primaryCapabilityDefs = computed(
	()=>props.capabilityDefs
		.filter(isVisible)
		.filter(isPrimaryCapability)
		.filter(def => !resourceStackNodeContext.isIgnoredCapabilityType(def.relationshipSpec.relationshipTypeId))
)

const notPrimaryCapabilityDefs = computed(
	()=>props.capabilityDefs
		.filter(isVisible)
		.filter(def=>!isPrimaryCapability(def))
		.filter(def => !resourceStackNodeContext.isIgnoredCapabilityType(def.relationshipSpec.relationshipTypeId))
)

const formRefs1 = ref([])
const formRefs2 = ref([])

function validate(callback) {
	validateForms(
		[...formRefs1.value, ...formRefs2.value],
		callback
	)
}

defineExpose({validate})

</script>

<template>
	<template v-for="def in primaryCapabilityDefs">
		<template v-if="def.sourceSpec.buildable">
			<PrimaryCapabilitySubForm
				ref="formRefs1"
				:new-capabilities="filterNewCapabilitiesByDef(def)"
				:capability-def="def"
				@add-new-capability="onAddNewCapability"
				@remove-capabilities="handleRemoveCapabilitiesByDef"
			/>
		</template>
	</template>
	<template v-for="def in notPrimaryCapabilityDefs">
		<template v-if="def.sourceSpec.buildable">
			<NotPrimaryCapabilitySubForm
				ref="formRefs2"
				:new-capabilities="filterNewCapabilitiesByDef(def)"
				:capability-def="def"
				@add-new-capability="onAddNewCapability"
				@remove-capability="handleRemoveCapability"
			/>
		</template>
	</template>
</template>

<style scoped>

</style>