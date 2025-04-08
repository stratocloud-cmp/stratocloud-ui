<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {describeProviders} from '@/api/resource.js'
import {ref, watch} from 'vue'
import {describeUsageTypes} from '@/api/limit.js'

const usageType = defineModel()

const usageTypeName = defineModel('usageTypeName')

const props = defineProps({
	providerIds: {
		required: false,
		type: Array,
		default: undefined,
	},
	resourceCategories: {
		required: false,
		type: Array,
		default: undefined,
	},
})

const emits = defineEmits(['change'])

function onSelectChange(row){
	usageTypeName.value = row.usageTypeName
	emits('change', row)
}

const request = ref({})

watch(props, ()=>{
	request.value.providerIds = props.providerIds
	request.value.resourceCategories = props.resourceCategories
}, {immediate: true})
</script>

<template>
	<StratoSelector
		v-model="usageType"
		@change="onSelectChange"
		:list-getter="resp=>resp.usageTypes"
		:value-getter="item=>item.usageType"
		:label-getter="item=>item.usageTypeName"
		:remote-method="describeUsageTypes"
		:request="request"
	/>
</template>

<style scoped>

</style>