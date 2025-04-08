<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeAccounts} from "@/api/account.js";
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'

const accountId = defineModel()

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
	multiple: {
		required: false,
		type: Boolean,
		default: false
	}
})

const pagingRequest = ref({
	resourceCategory: props.resourceCategory,
	providerIds: providerId.value?[providerId.value]:undefined,
	disabled: false
})

const accountContext = useAccountContext(accountId)

watch(accountContext.accountId, ()=>{
	pagingRequest.value.accountIds
		= props.multiple ?
		accountContext.accountId :
		(accountContext.accountId.value?[accountContext.accountId.value]:undefined)
})

watch(providerId, ()=>{
	pagingRequest.value.providerIds = providerId.value?[providerId.value]:undefined
})

function onAccountChange(item){
	if(item){
		providerId.value = item.providerId
		pagingRequest.value.providerIds = [providerId.value]
	}else {
		providerId.value = undefined
		pagingRequest.value.providerIds = undefined
	}
}

</script>

<template>
	<StratoPagingSelector
		:disabled="props.disabled"
		v-model="accountId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		@change="onAccountChange"
		:remote-method="describeAccounts"
		placeholder="请选择云账号"
		:multiple="multiple"
		id-filter-key="accountIds"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.description}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
