<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeJobDefinitions} from '@/api/job.js'

const model = defineModel()

const props = defineProps({
	placeholder: {
		required: false,
	},
	multiple: {
		required: false,
		default: false,
		type: Boolean
	}
})

const pagingRequest = ref({})


</script>

<template>
	<StratoPagingSelector
		v-model="model"
		:paging-request="pagingRequest"
		:label-getter="item=>item.jobTypeName"
		:value-getter="item=>item.jobType"
		:placeholder="placeholder"
		:remote-method="describeJobDefinitions"
		:multiple="multiple"
		id-filter-key="jobTypes"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.jobTypeName}}</span>
			<span style="float: right;color: grey">{{scope.row.jobType}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
