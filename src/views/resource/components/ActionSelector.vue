<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {describeAvailableActions} from '@/api/resource.js'
import {ref, watch} from 'vue'

const actionId = defineModel()

const emits = defineEmits(['change'])

function onSelectChange(row){
	emits('change', row)
}

const props = defineProps({
	resourceId: {
		required: true,
	}
})

const request = ref({
	resourceIds: props.resourceId?[props.resourceId]:undefined
})

watch(()=>props.resourceId, ()=>{
	request.value.resourceIds = props.resourceId?[props.resourceId]:undefined
})

function disabledActionPredicate(item, resp){
	if(resp.availableActions && resp.availableActions.length > 0){
		return resp.availableActions.filter(action=>action.id===item.id).length === 0
	}
	return true
}

function listGetter(resp){
	if(resp.allActions && resp.allActions.length > 0){
		return resp.allActions.filter(action=>{
			return action.id !== 'BUILD_RESOURCE' && action.id !=='DESTROY_RESOURCE'
		})
	}
	return []
}

</script>

<template>
	<StratoSelector
		v-model="actionId"
		@change="onSelectChange"
		:list-getter="listGetter"
		:value-getter="item=>item.id"
		:label-getter="item=>item.name"
		:remote-method="describeAvailableActions"
		:disabled-option-predicate="disabledActionPredicate"
		:request="request"
	/>
</template>

<style scoped>

</style>