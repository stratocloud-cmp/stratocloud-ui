<script setup>

import {ref} from 'vue'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'

const formData = defineModel({
	required: true,
	default: [{
		resourceId: undefined,
		newOwnerId: undefined,
		newTenantId: undefined,
		enableCascadedTransfer: true
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
		newOwnerId: undefined,
		newTenantId: undefined,
		enableCascadedTransfer: true
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
				<ElCol :span="8">
					<ElFormItem :prop="index+'.resourceId'" :label="`资源${index + 1}`" :show-message="false">
						<ResourceSelector
							v-model="item.resourceId"
							:resource-category="resourceCategory"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="5">
					<ElFormItem :prop="index+'.newTenantId'" label="租户" required :show-message="false">
						<TenantTreeSelector
							v-model="item.newTenantId"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="5">
					<ElFormItem :prop="index+'.newOwnerId'" label="所有者" required :show-message="false">
						<UserSelector
							v-model="item.newOwnerId"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="3">
					<ElFormItem :prop="index+'.enableCascadedTransfer'" label="级联移交">
						<ElSwitch v-model="item.enableCascadedTransfer" />
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