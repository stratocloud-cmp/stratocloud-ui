<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {describeResourceCategories} from '@/api/resource.js'
import {ref} from 'vue'

const category = defineModel()

const emits = defineEmits(['change'])

const props = defineProps({
	placeholder: {
		required: false,
		default: '请选择资源类型'
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	}
})

function onSelectChange(row){
	emits('change', row)
}

const request = ref({})
</script>

<template>
	<StratoSelector
		v-model="category"
		@change="onSelectChange"
		:list-getter="resp=>resp.resourceCategories"
		:value-getter="item=>item.categoryId"
		:label-getter="item=>item.categoryName"
		:remote-method="describeResourceCategories"
		:request="request"
		:placeholder="placeholder"
		:multiple="multiple"
	/>
</template>

<style scoped>

</style>