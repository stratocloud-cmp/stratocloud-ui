<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeRoles} from '@/api/role.js'

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
		:label-getter="item=>item.name"
		:placeholder="placeholder"
		:remote-method="describeRoles"
		:multiple="multiple"
		id-filter-key="roleIds"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.type}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
