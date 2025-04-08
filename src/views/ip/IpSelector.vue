<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeIps} from '@/api/IpPool.js'
import IpState from '@/views/ip/IpState.vue'
import {useNetworkResourceContext} from '@/views/resource/composables/NetworkResourceContext.js'

const ips = defineModel()

const props = defineProps({
	placeholder: {
		required: false,
	},
	protocol: {
		required: false,
	},
	multipleLimit: {
		required: false
	}
})

const pagingRequest = ref({
	protocol: props.protocol
})

const networkResourceContext = useNetworkResourceContext()

watch(networkResourceContext.networkResourceId, () => {
	pagingRequest.value.networkResourceId = networkResourceContext.networkResourceId.value
})

</script>

<template>
	<StratoPagingSelector
		v-model="ips"
		:paging-request="pagingRequest"
		:label-getter="item=>item.address"
		:value-getter="item=>item.address"
		:disabled-option-flag-getter="item=>item.state !== 'AVAILABLE'"
		:placeholder="placeholder"
		:remote-method="describeIps"
		multiple
		:multiple-limit="multipleLimit"
		allow-create
		sorted-by="toBigInteger"
		direction="ASC"
		id-filter-key="ips"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.address}}</span>
			<span style="float: right;color: grey"><IpState :state="scope.row.state" /></span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
