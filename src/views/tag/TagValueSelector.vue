<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeTagValues} from '@/api/tag.js'

const tagValue = defineModel()

const tagValueName = defineModel('tagValueName')

const props = defineProps({
	tagEntryKey: {
		required: true
	},
	tagEntryName: {
		required: true
	}
})

watch(()=>props.tagEntryKey, ()=>{
	pagingRequest.value.tagEntryKey = props.tagEntryKey
})

const pagingRequest = ref({
	tagEntryKey: props.tagEntryKey,
})

function handleValueSelected(tag){
	tagValueName.value = tag?.tagValueName
}

</script>

<template>
	<StratoPagingSelector
		v-model="tagValue"
		:paging-request="pagingRequest"
		:value-getter="item=>item.tagValue"
		:label-getter="item=>item.tagValueName"
		:placeholder="`请选择${tagEntryName?tagEntryName:''}`"
		:remote-method="describeTagValues"
		sorted-by="index"
		direction="ASC"
		id-filter-key="tagValues"
		@change="handleValueSelected"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.tagValueName}}</span>
			<span style="float: right;color: grey">{{scope.row.tagValue}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
