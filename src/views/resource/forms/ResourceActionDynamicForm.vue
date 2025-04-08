<script setup>
import {ref, watch} from 'vue'
import {describeResourceActionForm} from '@/api/resource.js'
import StratoDynamicForm from '@/views/dynamicform/StratoDynamicForm.vue'
import {useNetworkResourceContextProvider} from '@/views/resource/composables/NetworkResourceContext.js'

const formData = defineModel({
	required: true
})

const props = defineProps({
	resourceId: {
		required: true
	},
	actionId: {
		required: true
	}
})

const formRef = ref()

defineExpose({validate})

function validate(callback) {
	formRef.value.validate(callback)
}

const formMetaData = ref()

const networkResourceContext = useNetworkResourceContextProvider()

watch(props,()=>{
	describeResourceActionForm({
		resourceId: props.resourceId,
		actionId: props.actionId
	}).then(resp=>{
		formMetaData.value = resp.formMetaData
		networkResourceContext.networkResourceId.value = resp.networkResourceId
	})
}, {immediate: true})
</script>

<template>
	<StratoDynamicForm
		ref="formRef"
		v-if="formMetaData"
		:form-meta-data="formMetaData"
		v-model="formData"
	/>
</template>

<style scoped>

</style>