<script setup>
import {ref} from "vue";
import StratoSelector from "@/components/StratoSelector.vue";
import {describeRollbackTargets} from '@/api/order.js'

const props = defineProps({
	orderId: {
		required: true,
	}
})

const request = ref({
	orderId: props.orderId,
})

const nodeId = defineModel()

</script>

<template>
	<StratoSelector
		v-model="nodeId"
		placeholder="请选择回退节点"
		:request="request"
		:remote-method="describeRollbackTargets"
		:list-getter="resp=>resp.targets"
		:label-getter="item=>item.nodeName"
		:value-getter="item=>item.nodeId"
	>
		<template #default="scope">
			<div>{{scope.row.nodeName}}</div>
			<div style="color: grey">
				{{scope.row.possibleHandlers?.map(h => h.realName).join()}}
			</div>
		</template>
	</StratoSelector>
</template>

<style scoped>

</style>