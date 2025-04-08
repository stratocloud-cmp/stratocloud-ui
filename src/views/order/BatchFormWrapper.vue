<script setup>
import {computed, h, onMounted, ref} from 'vue'
import {validateForms} from '@/utils/FormUtil.js'

const props = defineProps({
	formComponent: {
		required: true,
		type: Object
	},
	itemsPath: {
		required: true,
	},
	cardTitle: {
		required: true,
	},
	enableEdit: {
		required: true,
		type: Boolean,
	}
})

const formData = defineModel({
	required: true,
	type: Object,
})

const formDataItems = computed(()=>formData.value[props.itemsPath])

onMounted(()=>{
	console.log(formDataItems.value)
})

function removeItem(index){
	formData.value[props.itemsPath].splice(index, 1)
}

function addItem(){
	formData.value[props.itemsPath].push(hiddenFormRef.value.getDefaultFormData())
}

const hiddenFormRef = ref()
const hiddenFormModel = ref()

const formRefs = ref([])

defineExpose({validate})

function validate(callback){
	validateForms(formRefs.value, callback)
}

</script>
<template>
	<component ref="hiddenFormRef" :is="formComponent" v-show="false" v-model="hiddenFormModel"></component>
	<template v-for="(item,index) in formDataItems">
		<ElCard style="margin-bottom: 12px">
			<template #header>
				<div style="width: 100%; height: 24px">
					<span>{{ cardTitle + (index+1) }}</span>
					<ElButton
						v-if="enableEdit"
						link
						icon="Close"
						type="danger"
						style="float: right"
						@click="()=>removeItem(index)"
					/>
				</div>
			</template>
			<component ref="formRefs" :is="formComponent" v-model="formDataItems[index]"></component>
		</ElCard>
	</template>
	<ElButton
		v-if="enableEdit"
		style="width: 100%;"
		icon="Plus"
		@click="addItem"
	>
		添加{{cardTitle}}
	</ElButton>
</template>

<style scoped>

</style>