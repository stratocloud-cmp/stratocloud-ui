<script setup>

import {ref} from "vue";
import {describeUnclaimedResources} from "@/api/resource.js";
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import ResourceState from '@/views/resource/components/ResourceState.vue'

const props = defineProps({
	resourceCategory: {
		required: false,
	},
	placeholder: {
		required: false,
		default: '请选择资源'
	},
})

const resourceId = defineModel()

const pagingRequest = ref({
	category: props.resourceCategory,
})


</script>

<template>
	<StratoPagingSelector
		v-model="resourceId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:remote-method="describeUnclaimedResources"
		:placeholder="placeholder"
		id-filter-key="resourceIds"
		teleported
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right; color: grey">
				<ResourceState :state="scope.row.state" />&nbsp;&nbsp;
				{{scope.row.typeName}}
			</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
