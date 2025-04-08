<script setup>
import {createCartItem} from '@/api/cartItem.js'
import {ref} from 'vue'
import {ElNotification} from 'element-plus'

const props = defineProps({
	jobParameters: {
		required: true,
		type: Object
	},
	jobType: {
		required: true,
		type: String
	},
	formRef: {
		required: true
	}
})

const emits = defineEmits(['confirm'])

function addToCart(){
	props.formRef.validate(valid => {
		if(!valid) return
		loading.value = true
		createCartItem({
			jobType: props.jobType,
			jobParameters: props.jobParameters,
		}).then(() => {
			emits('confirm')
			ElNotification.success('已加入待办队列')
		}).finally(() => {
			loading.value = false
		})
	})
}

const loading = ref(false)
</script>
<template>
	<ElButton type="primary" plain :loading="loading" icon="ShoppingCart" @click="addToCart">加入待办队列</ElButton>
</template>

<style scoped>

</style>