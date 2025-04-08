<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {approveOrder} from '@/api/order.js'
import {useSessionStore} from '@/stores/session.js'
import {useOrderContext} from '@/views/order/OrderContext.js'

const props = defineProps({
	selectedOrders: {
		required: true,
		default: [],
		type: Array,
	},
	size: {
		required: false,
		default: 'default'
	}
})

const sessionStore = useSessionStore()

const emits = defineEmits(['refresh'])

const drawerFlag = ref(false)

const drawerLoading = ref(false)

const orderContext = useOrderContext()
const isAnyOrderItemChanged = ref(false)

function openDrawer(){
	isAnyOrderItemChanged.value = orderContext.isAnyOrderItemChanged()
	drawerFlag.value = true
}

const formData = ref({})

const formRef = ref()

function confirm(){
	formRef.value.validate(valid=>{
		if(!valid) return
		formData.value.orderId = props.selectedOrders[0].id
		drawerLoading.value = true
		approveOrder(formData.value).then(resp=>{
			drawerFlag.value = false
			emits('refresh')
		}).finally(()=>{
			drawerLoading.value = false
		})
	})
}

function canCurrentUserHandle() {
	if(props.selectedOrders.length === 0){
		return false
	}
	return props.selectedOrders[0].possibleHandlers?.findIndex(h => h.userId === sessionStore.userId) !== -1
}

function showButton(){
	const allowedStatuses = ['AWAIT_APPROVAL', 'PROCESS_ROLLED_BACK']
	return props.selectedOrders.length>0
		&& allowedStatuses.includes(props.selectedOrders[0].status)
		&& canCurrentUserHandle()
}

</script>

<template>
	<template v-if="showButton()">
		<StratoButton
			type="success"
			plain
			:size="size"
			@click="openDrawer"
			:disabled="selectedOrders.length!==1"
			disabled-message="请只选择一项"
		>
			通过
		</StratoButton>

		<teleport to="body">
			<StratoDrawer v-model="drawerFlag" title="审批通过" :loading="drawerLoading" @on-confirm="confirm">
				<ElForm ref="formRef" :model="formData" label-position="top">
					<ElFormItem v-if="isAnyOrderItemChanged">
						<ElText type="warning">
							检测到当前页面存在工单项修改后未保存，如需保存，请前往工单详情页点击对应的[保存工单项]后再次点击通过
						</ElText>
					</ElFormItem>
					<ElFormItem label="审批意见">
						<ElInput type="textarea" v-model="formData.message" />
					</ElFormItem>
				</ElForm>
			</StratoDrawer>
		</teleport>

	</template>
</template>

<style scoped>

</style>