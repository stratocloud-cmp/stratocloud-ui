<script setup>

import {ref, watch} from "vue";
import {describeRelationships} from "@/api/resource.js";
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import RelationshipState from '@/views/resource/components/RelationshipState.vue'

const props = defineProps({
	disabled: {
		required: false,
		type: Boolean,
		default: false
	}
})

const relationshipIds = defineModel()


const pagingRequest = ref({
	relationshipIds: relationshipIds.value
})


watch(relationshipIds, ()=>{
	pagingRequest.value.relationshipIds = relationshipIds.value
})

function getLabel(relationship){
	return relationship.source.name+' -> '+relationship.target.name
}

</script>

<template>
	<StratoPagingSelector
		v-model="relationshipIds"
		:disabled="disabled"
		:paging-request="pagingRequest"
		:label-getter="getLabel"
		:remote-method="describeRelationships"
		placeholder="请选择关系"
	>
		<template #default="scope">
			<span style="float: left">{{getLabel(scope.row)}}</span>
			<span style="float: right; color: grey">
				<RelationshipState :state="scope.row.state" />&nbsp;&nbsp;
			</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
