<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {ref} from 'vue'
import {describeNotificationProviders} from '@/api/notification.js'

const providerId = defineModel()

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
		v-model="providerId"
		@change="onSelectChange"
		:list-getter="resp=>resp.providers"
		:value-getter="item=>item.providerId"
		:label-getter="item=>item.providerName"
		:remote-method="describeNotificationProviders"
		:request="request"
		:multiple="multiple"
		:disabled="disabled"
	/>
</template>

<style scoped>

</style>
