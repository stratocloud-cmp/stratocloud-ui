<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {cancelOrder} from '@/api/order.js'
import {useSessionStore} from '@/stores/session.js'

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

function openDrawer(){
	drawerFlag.value = true
}

const formData = ref({})

const formRef = ref()

function confirm(){
	formRef.value.validate(valid=>{
		if(!valid) return
		formData.value.orderId = props.selectedOrders[0].id
		drawerLoading.value = true
		cancelOrder(formData.value).then(resp=>{
			drawerFlag.value = false
			emits('refresh')
		}).finally(()=>{
			drawerLoading.value = false
		})
	})
}

function showButton(){
	const allowedStatuses = [
		'AWAIT_SUBMIT',
		'REJECTED',
		'PROCESS_ROLLED_BACK',
		'AWAIT_APPROVAL',
		'AWAIT_CONFIRM'
	]
	return props.selectedOrders.length>0 &&
		allowedStatuses.includes(props.selectedOrders[0].status) &&
		(sessionStore.isSuperAdmin || props.selectedOrders.every(o => o.id === sessionStore.userId))
}

</script>

<template>
	<template v-if="showButton()">
		<StratoButton
			plain
			:size="size"
			@click="openDrawer"
			:disabled="selectedOrders.length!==1"
			disabled-message="请只选择一项"
		>
			取消工单
		</StratoButton>

		<teleport to="body">
			<StratoDrawer v-model="drawerFlag" title="取消工单" :loading="drawerLoading" @on-confirm="confirm">
				<ElForm ref="formRef" :model="formData" label-position="top">
					<ElFormItem label="取消说明">
						<ElInput type="textarea" v-model="formData.message" />
					</ElFormItem>
				</ElForm>
			</StratoDrawer>
		</teleport>

	</template>

</template>

<style scoped>

</style>