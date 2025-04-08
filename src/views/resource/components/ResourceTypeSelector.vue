<script setup>
import {ref, watch} from "vue";
import {describeResourceTypes} from "@/api/resource.js";
import StratoSelector from "@/components/StratoSelector.vue";

const resourceTypeId = defineModel()

const providerId = defineModel('providerId')

const props = defineProps({
	resourceCategory: {
		required: false,
	},
	disabled: {
		required: false,
		type: Boolean,
		default: false
	},
	disabledOptionPredicate: {
		required: false,
		type: Function,
		default: ()=>false,
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	}
})

const request = ref({
	providerId: providerId.value,
	resourceCategoryId: props.resourceCategory,
	resourceTypeId: props.multiple?undefined:resourceTypeId.value
})

watch(providerId, ()=>{
	request.value.providerId = providerId.value
})

function onResourceTypeChange(item){
	if(item){
		providerId.value = item.spec.providerId
		request.value.providerId = providerId.value
	}else {
		providerId.value = undefined
		request.value.providerId = undefined
	}
}

</script>

<template>
	<StratoSelector
		v-model="resourceTypeId"
		placeholder="请选择资源类型"
		:disabled="props.disabled"
		:request="request"
		@change="onResourceTypeChange"
		:remote-method="describeResourceTypes"
		:list-getter="resp=>resp.resourceTypes"
		:label-getter="item=>item.spec.resourceTypeName"
		:value-getter="item=>item.spec.resourceTypeId"
		:disabled-option-predicate="disabledOptionPredicate"
		:multiple="multiple"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.spec.resourceTypeName}}</span>
			<span style="float: right;color: grey">{{scope.row.spec.resourceCategoryName}}</span>
		</template>
	</StratoSelector>
</template>

<style scoped>

</style>