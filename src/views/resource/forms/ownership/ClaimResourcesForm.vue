<script setup>

import {ref} from 'vue'
import UnclaimedResourceSelector from '@/views/resource/components/UnclaimedResourceSelector.vue'

const formData = defineModel({
	required: true,
	default: [{
		resourceId: undefined,
		enableCascadedClaim: true
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
		enableCascadedClaim: true
	})
}

function removeItem(index){
	formData.value.splice(index, 1)
}

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" scroll-to-error>
		<template v-for="(item, index) in formData">
			<ElDivider v-if="index!==0" />
			<ElRow style="width: 100%; display: flex; align-items: center" :gutter="20">
				<ElCol :span="18">
					<ElFormItem :prop="index+'.resourceId'" :label="`资源${index + 1}`" :show-message="false">
						<UnclaimedResourceSelector
							v-model="item.resourceId"
							:resource-category="resourceCategory"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="3">
					<ElFormItem :prop="index+'.enableCascadedClaim'" label="级联认领">
						<ElSwitch v-model="item.enableCascadedClaim" />
					</ElFormItem>
				</ElCol>

				<ElCol :span="3">
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