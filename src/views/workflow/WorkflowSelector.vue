<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeWorkflows} from '@/api/workflow.js'

const workflowId = defineModel()

const props = defineProps({
	placeholder: {
		required: false,
		default: "请选择流程"
	},
	multiple: {
		required: false,
		default: false,
		type: Boolean
	}
})

const pagingRequest = ref({})

const emits = defineEmits(['change'])

function onSelectionChange(item){
	emits('change',item)
}

</script>

<template>
	<StratoPagingSelector
		v-model="workflowId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:placeholder="placeholder"
		:remote-method="describeWorkflows"
		:multiple="multiple"
		id-filter-key="workflowIds"
		@change="onSelectionChange"
	/>
</template>

<style scoped>

</style>
