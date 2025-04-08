<script setup>

import {ref} from 'vue'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'
import ResourceActionDynamicForm from '@/views/resource/forms/ResourceActionDynamicForm.vue'
import ActionSelector from '@/views/resource/components/ActionSelector.vue'

const formData = defineModel({
	required: true,
	default: [{
		resourceId: undefined,
		actionId: undefined,
		parameters: {}
	}]
})

const props = defineProps({
	resourceCategory: {
		required: false,
		default: undefined
	},
})

defineExpose({validate})

function validate(callback){
	formRef.value.validate(callback)
}

const formRef = ref()

function addItem(){
	formData.value.push({
		resourceId: undefined,
		actionId: undefined,
		parameters: {}
	})
}

function removeItem(index){
	formData.value.splice(index, 1)
}

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top">
		<template v-for="(item, index) in formData">
			<ElDivider v-if="index!==0" />
			<ElRow style="width: 100%; display: flex; align-items: center" :gutter="20">
				<ElCol :span="14">
					<ElFormItem :label="`资源${index + 1}`" required>
						<ResourceSelector
							v-model="item.resourceId"
							:resource-category="resourceCategory"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="6">
					<ElFormItem v-if="item.resourceId" label="操作" required>
						<ActionSelector
							v-model="item.actionId"
							:resource-id="item.resourceId"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="4">
					<ElButton
						style="float: right;"
						circle
						plain
						size="small"
						icon="Minus"
						@click="()=>removeItem(index)"
					/>
				</ElCol>
			</ElRow>

			<ResourceActionDynamicForm
				v-if="item.resourceId && item.actionId"
				v-model="item.parameters"
				:action-id="item.actionId"
				:resource-id="item.resourceId"
			/>


		</template>
		<template v-if="resourceCategory">
			<ElButton
				style="width: 100%; margin-top: 20px"
				@click="addItem"
				plain
				icon="Plus"
			/>
		</template>

	</ElForm>
</template>

<style scoped>

</style>