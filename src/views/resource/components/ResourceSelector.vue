<script setup>

import {computed, ref, watch} from "vue";
import {describeResources} from "@/api/resource.js";
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {
	useIsolatedResourceContext,
	useResourceContext,
	useResourceTypeDef
} from "@/views/resource/composables/ResourceContext.js";
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'
import ResourceState from '@/views/resource/components/ResourceState.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'
import {useNetworkResourceContext} from '@/views/resource/composables/NetworkResourceContext.js'

const props = defineProps({
	resourceTypeId: {
		required: false,
	},
	resourceCategory: {
		required: false,
	},
	resourceTags:{
		required: false,
		default: []
	},
	contextConsumer: {
		required: false,
		type: Function,
		default: useResourceContext
	},
	placeholder: {
		required: false,
		default: '请选择资源'
	},
	disabledFlagGetter: {
		required: false,
		type: Function,
		default: item=>item.recycled
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	},
	ipPoolAttachable: {
		required: false,
		type: Boolean,
		default: undefined
	},
	teleported: {
		required: false,
		default: false,
		type: Boolean
	},
	isolatedResourceContext: {
		required: false,
		default: false,
		type: Boolean
	},
})

const resourceTypeDef = useResourceTypeDef(()=>props.resourceTypeId)

const resourceId = defineModel()

const resourceContext = props.isolatedResourceContext ? useIsolatedResourceContext() : props.contextConsumer(resourceTypeDef, resourceId)
const sharedTargetIds = resourceContext.sharedTargetIds

const accountId = ref()
const accountContext = useAccountContext(accountId)

const networkResourceContext = useNetworkResourceContext()

const disabledSelector = ref(false)


const pagingRequest = ref({
	requirementTargetIds: sharedTargetIds.value,
	resourceCategories: props.resourceCategory?[props.resourceCategory]:undefined,
	resourceTypes: props.resourceTypeId?[props.resourceTypeId]:undefined,
	accountIds: accountContext.accountId.value?[accountContext.accountId.value]:undefined,
	ipPoolAttachable: props.ipPoolAttachable
})


watch(resourceId, ()=>{
	if(resourceTypeDef.value && resourceTypeDef.value.spec.canAttachIpPool){
		networkResourceContext.networkResourceId.value = resourceId.value
	}
})

watch(sharedTargetIds, ()=>{
	pagingRequest.value.requirementTargetIds = sharedTargetIds.value
},{deep: true})

watch(accountContext.accountId, ()=>{
	pagingRequest.value.accountIds = accountContext.accountId.value?[accountContext.accountId.value]:undefined
})

watch(() => props.resourceTypeId, () => {
	pagingRequest.value.resourceTypes = props.resourceTypeId?[props.resourceTypeId]:undefined
})


function getCategoryName(){
	return resourceTypeDef.value?.spec.resourceCategoryName
}

function onSelectChange(row){
	if(!row) {
		accountId.value = undefined
		selectedTags.value.forEach(tag=>{
			tag.tagValue = undefined
			tag.tagValueName = undefined
		})
		return
	}
	accountId.value = row.accountId

	if(row.tags){
		selectedTags.value = row.tags
	}
}

defineExpose({getCategoryName})

const selectedTags = ref([])

const tagEntryPagingRequest = computed(()=>{
	return {
		requiredWhenFiltering: true,
		resourceCategories: [resourceTypeDef.value?.spec.resourceCategoryId]
	}
})

watch(selectedTags, ()=>{
	const tagsMap = {}
	selectedTags.value.forEach(tag=>{
		if(!tag.tagKey || !tag.tagValue) return
		if(!tagsMap[tag.tagKey]){
			tagsMap[tag.tagKey] = []
		}
		tagsMap[tag.tagKey].push(tag.tagValue)
	})

	pagingRequest.value.tagsMap = tagsMap
}, {deep: true})

</script>

<template>
	<StratoPagingSelector
		v-model="resourceId"
		:disabled="disabledSelector"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:remote-method="describeResources"
		:disabled-option-flag-getter="disabledFlagGetter"
		@change="onSelectChange"
		:placeholder="placeholder"
		:multiple="multiple"
		:teleported="teleported"
		sorted-by="recycled"
		direction="ASC"
		id-filter-key="resourceIds"
	>
		<template #header v-if="resourceTypeDef">
			<TagValueSelectorGroup
				:entry-paging-request="tagEntryPagingRequest"
				v-model="selectedTags"
			/>
		</template>
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
