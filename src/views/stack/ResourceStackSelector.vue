<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeUsers} from "@/api/user.js";
import {describeBlueprints} from '@/api/blueprint.js'
import {describeStacks} from '@/api/resourceStack.js'

const stackId = defineModel()

const props = defineProps({
	placeholder: {
		required: false,
	},
	multiple: {
		required: false,
		default: false,
		type: Boolean
	},
	disabled: {
		required: false,
		default: false,
		type: Boolean
	}
})

const pagingRequest = ref({})

</script>

<template>
	<StratoPagingSelector
		v-model="stackId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:placeholder="placeholder"
		:remote-method="describeStacks"
		:multiple="multiple"
		:disabled="disabled"
		id-filter-key="resourceStackIds"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.description}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
