<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {ElInput} from "element-plus";
import {deleteCartItems, describeAllCartItems, submitCartItems} from '@/api/cartItem.js'
import StratoButton from '@/components/StratoButton.vue'

const tableRef = ref()

const selectedCartItems = ref([])

const cartItems = ref([])

function fetchData(){
	describeAllCartItems(queryRequest.value).then(resp => {
		cartItems.value = resp.cartItems
	})
}

function getSelectedIds() {
	return selectedCartItems.value.map(i=>i.id)
}

const queryRequest = ref({})

watch(queryRequest, fetchData, {immediate: true})

defineExpose({getTotal})

const fetchDataIntervalId = ref()
onMounted(() => {
	fetchDataIntervalId.value = setInterval(fetchData, 5000)
})
onUnmounted(() => {
	clearInterval(fetchDataIntervalId.value)
})

function getTotal(){
	return cartItems.value.length
}

const submitLoading = ref(false)
function onSubmit(){
	submitLoading.value = true
	const cartItemIds = getSelectedIds()
	const request = {cartItemIds}
	submitCartItems(request).then(()=>{
		fetchData()
		tableRef.value?.clearSelection()
	}).finally(() => {
		submitLoading.value = false
	})
}

const deleteLoading = ref(false)
function onDelete(){
	deleteLoading.value = true
	const cartItemIds = getSelectedIds()
	const request = {cartItemIds}
	deleteCartItems(request).then(()=>{
		fetchData()
		tableRef.value?.clearSelection()
	}).finally(()=>{
		deleteLoading.value = false
	})
}

function onSelect(selectedRows){
	selectedCartItems.value = selectedRows
}

</script>

<template>
	<div style="height: 32px">
		<StratoButton
			:disabled="selectedCartItems.length<=0"
			:loading="submitLoading"
			size="small"
			type="success"
			plain
			@click="onSubmit">
			提交
		</StratoButton>
		<StratoButton
			:disabled="selectedCartItems.length<=0"
			:loading="deleteLoading"
			size="small"
			type="danger"
			plain
			@click="onDelete">
			删除
		</StratoButton>
		<ElInput size="small" style="float: right; width: 20%;" v-model="queryRequest.search" suffix-icon="search" />
	</div>

	<ElTable
		ref="tableRef"
		size="small"
		:data="cartItems"
		row-key="id"
		max-height="600"
		:show-overflow-tooltip="false"
		@selection-change="onSelect"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn prop="jobTypeName" label="待办任务" sortable="custom" />
		<ElTableColumn prop="summary" label="任务详情">
			<template #default="scope">
				<ElTooltip>
					<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						{{scope.row.summary}}
					</div>
					<template #content>
						<span style="white-space: pre-wrap" v-html="scope.row.summary"></span>
					</template>
				</ElTooltip>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="createdAt" label="创建时间" sortable="custom" />
	</ElTable>
</template>

<style scoped>

</style>
