<script setup>
import {ref, watch} from 'vue'
import {performDestroyResourcesRefundInquiry} from '@/api/resource.js'

const props = defineProps({
	formData: {
		required: true,
		default: {},
	}
})

const refundDescription = ref()
const loading = ref(false)
watch(props, () => {
	loading.value = true
	performDestroyResourcesRefundInquiry({
		resources: props.formData
	}).then(resp=>{
		refundDescription.value = resp.refundDescription
	}).finally(() => {
		loading.value = false
	})
}, { immediate: true, deep: true })

</script>

<template>
	<ElText type="warning">
		<span v-if="loading">费用查询中...</span>
		<span v-else>{{refundDescription?refundDescription:'退费：无'}}</span>
	</ElText>
</template>

<style scoped>

</style>