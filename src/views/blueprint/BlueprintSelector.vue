<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref} from "vue";
import {describeBlueprints} from '@/api/blueprint.js'

const blueprintId = defineModel()

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
		v-model="blueprintId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:placeholder="placeholder"
		:remote-method="describeBlueprints"
		:multiple="multiple"
		:disabled="disabled"
		id-filter-key="blueprintIds"
		teleported
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.description}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
