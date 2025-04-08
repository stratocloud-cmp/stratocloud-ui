<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {describeTagEntries} from '@/api/tag.js'

const tagKey = defineModel()

const tagKeyName = defineModel('tagKeyName')

const props = defineProps({
	pagingRequest: {
		required: false,
		default: {}
	}
})

function handleEntrySelected(tagEntry){
	tagKeyName.value = tagEntry?.tagKeyName
}

</script>

<template>
	<StratoPagingSelector
		v-model="tagKey"
		:paging-request="pagingRequest"
		:value-getter="item=>item.tagKey"
		:label-getter="item=>item.tagKeyName"
		:placeholder="`请选择标签键`"
		:remote-method="describeTagEntries"
		@change="handleEntrySelected"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.tagKeyName}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
