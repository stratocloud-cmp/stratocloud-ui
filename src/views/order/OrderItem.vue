<script setup>
import {computed, onMounted, ref} from 'vue'
import {getJobFormComponentByJobType, isOrderStatusEditable} from '@/views/order/OrderUtil.js'
import {updateOrderItem} from '@/api/order.js'
import {cloneDeep, isEqual} from 'lodash'
import {ElNotification} from 'element-plus'
import {useOrderContext} from '@/views/order/OrderContext.js'

const props = defineProps({
	order: {
		required: true,
	},
	orderItem: {
		required: true,
	}
})

const formData = ref({
	orderId: props.order.id,
	orderItemId: props.orderItem.id,
})

onMounted(()=>{
	formData.value.parameters = cloneDeep(props.orderItem.parameters)
})

function getJobFormComponent(){
	return getJobFormComponentByJobType(props.orderItem.jobType, props.order.status)
}

const jobFormComponent = getJobFormComponent()

const updateOderItemDisabled = computed(()=>{
	return !isOrderStatusEditable(props.order.status)
})

const formRef = ref()

const buttonLoading = ref(false)
const emits = defineEmits(['refresh'])
function confirmUpdateOderItem(){
	console.log(formRef.value.$options)
	formRef.value.validate(valid=>{
		if(!valid) return
		buttonLoading.value = true
		updateOrderItem(formData.value).then(resp=>{
			ElNotification.success({
				message: '工单项保存成功'
			})
		}).finally(()=>{
			buttonLoading.value = false
			emits('refresh')
		})
	})
}

function isOrderItemChanged(){
	console.log(props.orderItem.parameters)
	console.log(formData.value.parameters)
	return !isEqual(props.orderItem.parameters, formData.value.parameters)
}

const orderContext = useOrderContext()

orderContext.registerOrderItemChangeDetector(isOrderItemChanged)

</script>
<template>
	<div>
		<component ref="formRef" v-if="formData.parameters" :is="jobFormComponent" v-model="formData.parameters" />
		<div style="width: 100%; height: 32px;">
			<ElButton
				:loading="buttonLoading"
				type="primary"
				style="float: right;margin-top: 12px"
				:disabled="updateOderItemDisabled"
				@click="confirmUpdateOderItem"
				plain
			>
				保存工单项
			</ElButton>
		</div>
	</div>
</template>
<style scoped>

</style>