<script setup>

import {ref} from 'vue'
import ResourceStackSelector from '@/views/stack/ResourceStackSelector.vue'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'

const formData = defineModel({
	required: true,
	default: {
		transfers: [{
			stackId: undefined,
			newOwnerId: undefined,
			newTenantId: undefined
		}]
	}
})


defineExpose({validate})

function validate(callback){
	formRef.value.validate(callback)
}

const formRef = ref()

function addItem(){
	formData.value.transfers.push({
		stackId: undefined,
		newOwnerId: undefined,
		newTenantId: undefined
	})
}

function removeItem(index){
	formData.value.transfers.splice(index, 1)
}


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top">
		<template v-for="(item, index) in formData.transfers">
			<ElDivider v-if="index!==0" />
			<ElRow style="width: 100%; display: flex; align-items: center" :gutter="20">
				<ElCol :span="10">
					<ElFormItem :label="`待移交资源栈${index + 1}`" required>
						<ResourceStackSelector
							v-model="item.stackId"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="6">
					<ElFormItem label="租户">
						<TenantTreeSelector v-model="item.newTenantId" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="6">
					<ElFormItem label="所有者">
						<UserSelector v-model="item.newOwnerId" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="2">
					<ElButton
						style="float: right;"
						size="small"
						circle
						plain
						icon="Minus"
						@click="()=>removeItem(index)"
					/>
				</ElCol>
			</ElRow>
		</template>
		<ElButton
			style="width: 100%; margin-top: 20px"
			@click="addItem"
			plain
			icon="Plus"
		/>
	</ElForm>
</template>

<style scoped>

</style>
