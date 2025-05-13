<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {ref} from 'vue'
import {describeNotificationEventTypes} from '@/api/notification.js'

const eventType = defineModel()

const props = defineProps({
	multiple: {
		required: false,
		type: Boolean,
		default: false
	},
	disabled: {
		required: false,
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['change'])

function onSelectChange(row){
	emits('change', row)
}

const request = ref({})
</script>

<template>
	<StratoSelector
		v-model="eventType"
		@change="onSelectChange"
		:list-getter="resp=>resp.eventTypes"
		:value-getter="item=>item.eventType"
		:label-getter="item=>item.eventTypeName"
		:remote-method="describeNotificationEventTypes"
		:request="request"
		:multiple="multiple"
		:disabled="disabled"
	/>
</template>

<style scoped>

</style>
