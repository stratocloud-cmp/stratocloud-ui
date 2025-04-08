<script setup>

import OrderSubmitButton from '@/views/order/buttons/OrderSubmitButton.vue'
import OrderApproveButton from '@/views/order/buttons/OrderApproveButton.vue'
import OrderDenyButton from '@/views/order/buttons/OrderDenyButton.vue'
import OrderRejectButton from '@/views/order/buttons/OrderRejectButton.vue'
import OrderRollbackButton from '@/views/order/buttons/OrderRollbackButton.vue'
import OrderCancelButton from '@/views/order/buttons/OrderCancelButton.vue'
import OrderConfirmButton from '@/views/order/buttons/OrderConfirmButton.vue'
import OrderCloneButton from '@/views/order/buttons/OrderCloneButton.vue'
import CreateOrderButton from '@/views/order/buttons/CreateOrderButton.vue'

const props = defineProps({
	selectedOrders: {
		required: true,
		default: [],
		type: Array,
	},
	size: {
		required: false,
		default: 'default'
	},
	showCreate: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['refresh'])

function notifyRefresh(){
	emits('refresh')
}
</script>

<template>
	<CreateOrderButton v-if="showCreate" @refresh="notifyRefresh" />
	<OrderSubmitButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderApproveButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderConfirmButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderDenyButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderRejectButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderRollbackButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderCancelButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
	<OrderCloneButton :selected-orders="selectedOrders" :size="size" @refresh="notifyRefresh" />
</template>

<style scoped>

</style>
