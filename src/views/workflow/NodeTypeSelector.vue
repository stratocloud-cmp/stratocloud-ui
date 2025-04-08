<script setup>
import {ref, watch} from "vue";
import StratoSelector from "@/components/StratoSelector.vue";
import {describeNodeTypes} from '@/api/workflow.js'


const request = ref({})

const nodeType = defineModel()


const emits = defineEmits(['change'])
function handleSelectionChange(item){
	emits('change', item)
}
</script>

<template>
	<StratoSelector
		v-model="nodeType"
		placeholder="请选择节点类型"
		:request="request"
		:remote-method="describeNodeTypes"
		:list-getter="resp=>resp.nodeTypes"
		:label-getter="item=>item.nodeTypeName"
		:value-getter="item=>item.nodeType"
		@change="handleSelectionChange"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.nodeTypeName}}</span>
			<span style="float: right;color: grey">{{scope.row.nodeType}}</span>
		</template>
	</StratoSelector>
</template>

<style scoped>

</style>