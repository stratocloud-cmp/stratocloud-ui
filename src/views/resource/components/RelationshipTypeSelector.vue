<script setup>
import {ref, watch} from "vue";
import {describeRelationshipTypes, describeResourceTypes} from "@/api/resource.js";
import StratoSelector from "@/components/StratoSelector.vue";

const relationshipTypeId = defineModel()

const props = defineProps({
	sourceTypeId: {
		required: true,
	},
	targetTypeId: {
		required: true,
	}
})

const request = ref({
	sourceTypeId: props.sourceTypeId,
	targetTypeId: props.targetTypeId,
})

watch(props, () => {
	request.value.sourceTypeId = props.sourceTypeId
	request.value.targetTypeId = props.targetTypeId
})

const emits = defineEmits(['change'])

function onChange(rel){
	emits('change', rel)
}

</script>

<template>
	<StratoSelector
		v-model="relationshipTypeId"
		placeholder="请选择关系类型"
		:request="request"
		@change="onChange"
		:remote-method="describeRelationshipTypes"
		:list-getter="resp=>resp.relationshipSpecs"
		:label-getter="item=>item.connectActionName"
		:value-getter="item=>item.relationshipTypeId"
		teleported
	>
	</StratoSelector>
</template>

<style scoped>

</style>