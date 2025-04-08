<script setup>

import {ref} from 'vue'
import {validateForms} from '@/utils/FormUtil.js'

const props = defineProps({
	formComponent: {
		required: true,
		type: Object
	},
	formDataPath: {
		required: true,
	},
})

const formData = defineModel({
	required: true,
	type: Object,
})

const formRef = ref()

defineExpose({validate})

function validate(callback){
	validateForms([formRef.value], callback)
}

</script>
<template>
	<component ref="formRef" :is="formComponent" v-model="formData[formDataPath]"></component>
</template>

<style scoped>

</style>