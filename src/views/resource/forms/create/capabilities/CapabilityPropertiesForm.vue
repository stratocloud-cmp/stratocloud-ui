<script setup>
import ResourcePropertiesSubForm from '@/views/resource/forms/create/ResourcePropertiesSubForm.vue'
import RelationshipPropertiesForm from '@/views/resource/forms/relationship/RelationshipPropertiesForm.vue'
import {ref} from 'vue'
import {validateForms} from '@/utils/FormUtil.js'

const newResource = defineModel('resource', {
	required: true
})

const relationshipProperties = defineModel('relationshipProperties', {
	required: true
})

const props = defineProps({
	resourceSpec: {
		required: true,
	},
	relationshipTypeId: {
		required: true,
	},
	isPrimaryCapability: {
		required: false,
		default: false,
		type: Boolean
	},
})

const formRef1 = ref([])
const formRef2 = ref([])

function validate(callback){
	validateForms(
		[formRef1.value, formRef2.value],
		callback
	)
}

defineExpose({validate})



</script>

<template>
	<ResourcePropertiesSubForm
		ref="formRef1"
		v-model="newResource"
		:resource-type-spec="resourceSpec"
		:is-primary-capability="isPrimaryCapability"
	/>
	<RelationshipPropertiesForm
		ref="formRef2"
		v-model="relationshipProperties"
		:relationship-type-id="relationshipTypeId"
	/>
</template>

<style scoped>

</style>