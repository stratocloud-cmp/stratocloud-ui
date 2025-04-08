<script setup>
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import {onMounted, ref} from 'vue'
import {describeRelationshipForm} from '@/api/resource.js'

const relationshipProperties = defineModel({
	required: true
})

const props = defineProps({
	relationshipTypeId: {
		required: true,
	}
})

const formRef = ref()
const formMetaData = ref()

onMounted(()=>{
	describeRelationshipForm({
		relationshipTypeId: props.relationshipTypeId,
	}).then(resp=>{
		formMetaData.value = resp.formMetaData
	})
})

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

</script>

<template>
	<StratoDynamicForm
		ref="formRef"
		v-if="formMetaData"
		:form-meta-data="formMetaData"
		v-model="relationshipProperties"
	/>
</template>

<style scoped>

</style>