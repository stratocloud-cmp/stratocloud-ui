<script setup>
import {ref, watch} from 'vue'
import {performCreateResourcesPriceInquiry} from '@/api/resource.js'

const props = defineProps({
	formData: {
		required: true,
		default: {},
	}
})

const costDescription = ref()
const loading = ref(false)
watch(props, () => {
	loading.value = true
	performCreateResourcesPriceInquiry({
		createCommand: props.formData
	}).then(resp=>{
		costDescription.value = resp.totalMonthlyCostDescription
	}).finally(() => {
		loading.value = false
	})
}, { immediate: true, deep: true })

</script>

<template>
	<ElText type="warning">
		<span v-if="loading">费用查询中...</span>
		<span v-else>参考价格：{{costDescription?costDescription:'无'}}</span>
	</ElText>
</template>

<style scoped>

</style>