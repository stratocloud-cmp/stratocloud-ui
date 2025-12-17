<script setup>
import {computed} from 'vue'

const props = defineProps({
	type: {
		type: String,
		required: true,
	},
	logoId: {
		type: String,
		required: true,
	},
	width: {
		type: String,
		required: false,
		default: '16px'
	}
})

const logoUrl = computed(() => {
	return `/api/resource-service/provider-logo?type=${props.type}&id=${props.logoId}`
})

</script>
<template>
	<img :style="{width: width, height: 'auto', verticalAlign: 'middle', position: 'relative', bottom: '1px'}" :src="logoUrl" :alt="props.logoId" />
</template>

<style scoped>

</style>
