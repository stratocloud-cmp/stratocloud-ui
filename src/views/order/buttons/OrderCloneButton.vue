<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import {cloneOrder} from '@/api/order.js'

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

const emits = defineEmits(['refresh'])


const formData = ref({})

const buttonLoading = ref(false)


function confirm(){
	formData.value.orderId = props.selectedOrders[0].id
	buttonLoading.value = true
	cloneOrder(formData.value).then(resp=>{
		emits('refresh')
	}).finally(()=>{
		buttonLoading.value = false
	})
}

function showButton(){
	return props.selectedOrders.length>0
}

</script>

<template>
	<template v-if="showButton()">
		<StratoButton
			plain
			:size="size"
			@click="confirm"
			:disabled="selectedOrders.length!==1"
			disabled-message="请只选择一项"
			:loading="buttonLoading"
		>
			克隆
		</StratoButton>

	</template>

</template>

<style scoped>

</style>