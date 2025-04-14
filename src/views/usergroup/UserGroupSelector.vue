<script setup>
import StratoPagingSelector from '@/components/StratoPagingSelector.vue'
import {ref} from 'vue'
import {describeUserGroups} from '@/api/userGroup.js'

const props = defineProps({
	allGroups: {
		required: false,
		type: Boolean,
		default: false
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	}
})

const userGroupId = defineModel()

const pagingRequest = ref({
	allGroups: props.allGroups,
})

const emits = defineEmits(['change'])

function onSelectChange(userGroup){
	emits('change', userGroup)
}

</script>

<template>
	<StratoPagingSelector
		v-model="userGroupId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:remote-method="describeUserGroups"
		placeholder="请选择用户组"
		@change="onSelectChange"
		:multiple="multiple"
		id-filter-key="userGroupIds"
		teleported
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.alias}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
