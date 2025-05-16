<script setup>
const props = defineProps({
	eventLevel: {
		required: true,
	}
})
</script>

<template>
	<span>
		<ElText type="info" v-if="eventLevel==='INFO'">信息</ElText>
		<ElText type="primary" v-else-if="eventLevel==='REMIND'">提示</ElText>
		<ElText type="warning" v-else-if="eventLevel==='WARNING'">警告</ElText>
		<ElText type="danger" v-else-if="eventLevel==='SERIOUS'">严重</ElText>
	</span>
</template>

<style scoped>

</style>
