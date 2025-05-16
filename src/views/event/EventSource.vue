<script setup>
const props = defineProps({
	eventSource: {
		required: true,
	}
})
</script>

<template>
	<span>
		<ElText type="primary" v-if="eventSource==='STRATO_ACTION'">云管操作事件</ElText>
		<ElText type="warning" v-else-if="eventSource==='EXTERNAL_ACTION'">外部操作事件</ElText>
		<ElText type="danger" v-else-if="eventSource==='ALERT'">告警事件</ElText>
		<ElText type="primary" v-else-if="eventSource==='ORDER'">工单事件</ElText>
	</span>
</template>

<style scoped>

</style>
