<script setup>

import StratoDrawer from '@/components/StratoDrawer.vue'
import {describeOrders} from '@/api/order.js'
import {computed, onMounted, ref} from 'vue'
import {ElDescriptions, ElDescriptionsItem, ElLink} from 'element-plus'
import OrderState from '@/views/order/OrderState.vue'
import OrderButtonsGroup from '@/views/order/OrderButtonsGroup.vue'
import OrderItem from '@/views/order/OrderItem.vue'
import {useOrderContextProvider} from '@/views/order/OrderContext.js'

const drawerFlag = defineModel({
	type: Boolean,
	required: true,
	default: false
})

const props = defineProps({
	orderId: {
		required: true,
	}
})

useOrderContextProvider()

const order = ref()

function fetchData(){
	describeOrders({
		orderIds: [props.orderId],
	}).then(resp=>{
		if(resp.content && resp.content.length > 0){
			order.value = resp.content[0]
		}
	})
}

onMounted(fetchData)

const orders = computed(()=>{
	if(order.value) return [order.value]
	return []
})

const emits = defineEmits(['refresh'])
function closeDrawer(){
	drawerFlag.value = false
	emits('refresh')
}




</script>

<template>
	<StratoDrawer :size="1000" v-model="drawerFlag" title="工单详情" custom-footer>
		<template v-if="order">
			<ElDescriptions :column="3" border>
				<template #title style="width: 100%">
					<div style="width: 100%">
						<ElSpace>
							<span>工单编号:</span>
							<ElLink type="primary">{{ order.orderNo }}</ElLink>
							<OrderState
								:state="order.status"
								:error-message="order.errorMessage"
							/>
						</ElSpace>

					</div>
				</template>
				<ElDescriptionsItem label="标题">
					{{ order.orderName }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="工作流">
					{{ order.workflowName }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="创建时间">
					{{ order.createdAt }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="提交时间">
					{{ order.submittedAt }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="最近审批时间">
					{{ order.lastApprovedAt }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="结束时间">
					{{ order.endedAt }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="当前意见">
					{{ order.userMessage }}
				</ElDescriptionsItem>
				<ElDescriptionsItem label="备注">
					{{ order.note }}
				</ElDescriptionsItem>
			</ElDescriptions>
			<ElCollapse style="margin-top: 32px" accordion>
				<ElCollapseItem v-for="(item,index) in order.orderItems">
					<template #title>
						<span style="font-size: 16px;">
							{{`工单项${index+1}: ${item.jobTypeName}`}}
						</span>
					</template>
					<OrderItem
						style="margin-top: 6px;"
						:order="order"
						:order-item="item"
						@refresh="fetchData"
					/>

				</ElCollapseItem>
			</ElCollapse>
		</template>

		<template #footer>
			<OrderButtonsGroup :selected-orders="orders" @refresh="closeDrawer" />
		</template>
	</StratoDrawer>
</template>

<style>
.el-collapse-item__content {
	font-size: unset;
}
</style>