<script setup>
import {onMounted, ref} from 'vue'
import router from '@/router/index.js'
import {useSessionStore} from '@/stores/session.js'
import StratoTable from '@/components/StratoTable.vue'
import {describeOrders} from '@/api/order.js'
import {ElInput} from 'element-plus'
import OrderState from '@/views/order/OrderState.vue'
import OrderButtonsGroup from '@/views/order/OrderButtonsGroup.vue'
import OrderDetail from '@/views/order/OrderDetail.vue'
import {onBeforeRouteUpdate} from 'vue-router'

const sessionStore = useSessionStore()

const defaultPagingRequest = {
	ownerIds: [],
	possibleHandlerIds: [],
	historyHandlerIds: [],
	search: undefined,
}

const pagingRequest = ref(defaultPagingRequest)

const isMyOrders = ref(false)


function initPagingRequest(toRoute){
	const path = toRoute.fullPath

	if(path === '/order/my-orders'){
		pagingRequest.value.ownerIds = [sessionStore.userId]
		pagingRequest.value.possibleHandlerIds = []
		pagingRequest.value.historyHandlerIds = []
		isMyOrders.value = true
	}else if(path === '/order/to-do-orders'){
		pagingRequest.value.ownerIds = []
		pagingRequest.value.possibleHandlerIds = [sessionStore.userId]
		pagingRequest.value.historyHandlerIds = []
	}else if(path === '/order/done-orders'){
		pagingRequest.value.ownerIds = []
		pagingRequest.value.possibleHandlerIds = []
		pagingRequest.value.historyHandlerIds = [sessionStore.userId]
	} else {
		pagingRequest.value.ownerIds = []
		pagingRequest.value.possibleHandlerIds = []
		pagingRequest.value.historyHandlerIds = []
	}
}

onBeforeRouteUpdate(toRoute => {
	initPagingRequest(toRoute)
})

onMounted(()=>{
	initPagingRequest(router.currentRoute.value)
})



const selectedOrders = ref([])
function handleSelectionChange(rows){
	selectedOrders.value = rows
}


const tableRef = ref()
function fetchDataAgain(){
	tableRef.value.fetchData()
}


const detailDrawerFlag = ref()
const detailDrawerOrderId = ref()

function openDetailDrawer(orderId){
	detailDrawerOrderId.value = orderId
	detailDrawerFlag.value = true
}

</script>
<template>
	<div style="margin-bottom: 10px;height: 32px">
		<OrderButtonsGroup :show-create="isMyOrders" :selected-orders="selectedOrders" @refresh="fetchDataAgain" />
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>
	<StratoTable
		ref="tableRef"
		:paging-request="pagingRequest"
		:remote-method="describeOrders"
		@selection-change="handleSelectionChange"
	>
		<ElTableColumn type="selection" reserve-selection />
		<ElTableColumn min-width="100" prop="orderNo" label="工单编号" sortable="custom">
			<template #default="scope">
				<ElLink type="primary" @click="()=>openDetailDrawer(scope.row.id)">{{ scope.row.orderNo }}</ElLink>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="orderName" label="工单标题" sortable="custom" />
		<ElTableColumn prop="workflowName" label="工作流" />
		<ElTableColumn prop="status" label="工单状态" sortable="custom">
			<template #default="scope">
				<OrderState :state="scope.row.status" :error-message="scope.row.errorMessage" />
			</template>
		</ElTableColumn>
		<ElTableColumn prop="summary" label="工单内容" :show-overflow-tooltip="false">
			<template #default="scope">
				<ElTooltip>
					<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						{{scope.row.summary}}
					</div>
					<template #content>
						<div style="white-space: pre-wrap;max-height: 400px;overflow: auto" v-html="scope.row.summary"></div>
					</template>
				</ElTooltip>
			</template>
		</ElTableColumn>
		<ElTableColumn label="当前处理人" :show-overflow-tooltip="false">
			<template #default="scope">
				<ElTooltip>
					<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						{{scope.row.possibleHandlers?.map(h => h.userName).join()}}
					</div>
					<template #content>
						<div style="max-width: 240px;white-space: pre-wrap">
							{{scope.row.possibleHandlers?.map(h => h.userName).join()}}
						</div>
					</template>
				</ElTooltip>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="userMessage" label="当前意见" :show-overflow-tooltip="false">
			<template #default="scope">
				<ElTooltip>
					<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						{{scope.row.userMessage}}
					</div>
					<template #content>
						<div style="max-width: 240px;white-space: pre-wrap">
							{{scope.row.userMessage}}
						</div>
					</template>
				</ElTooltip>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="lastApprovedAt" label="审批时间" sortable="custom" />
		<ElTableColumn prop="ownerId" label="申请人" width="100" sortable="custom">
			<template #default="scope">
				<span>{{scope.row.ownerRealName}}</span>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="submittedAt" label="提交时间" sortable="custom" />
		<ElTableColumn prop="endedAt" label="结束时间" sortable="custom" />
	</StratoTable>

	<OrderDetail
		v-model="detailDrawerFlag"
		v-if="detailDrawerFlag"
		:order-id="detailDrawerOrderId"
		@refresh="fetchDataAgain"
	/>
</template>
