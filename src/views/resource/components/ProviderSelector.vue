<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {describeProviders} from '@/api/resource.js'
import {ref} from 'vue'

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
		:value-getter="item=>item.id"
		:label-getter="item=>item.name"
		:remote-method="describeProviders"
		:request="request"
		:multiple="multiple"
		:disabled="disabled"
	/>
</template>

<style scoped>

</style>