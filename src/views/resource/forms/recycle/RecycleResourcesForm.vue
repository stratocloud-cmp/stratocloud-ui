<script setup>

import {onMounted, ref} from 'vue'
import ResourceSelector from '@/views/resource/components/ResourceSelector.vue'
import {QuestionFilled} from '@element-plus/icons-vue'
import ResourceActionDynamicForm from '@/views/resource/forms/ResourceActionDynamicForm.vue'

const formData = defineModel({
	required: true
})

const props = defineProps({
	resourceCategory: {
		required: false,
		default: undefined
	},
	destroyable: {
		required: false,
		type: Boolean,
		default: false
	}
})

defineExpose({validate})

function validate(callback){
	formRef.value.validate(callback)
}

const formRef = ref()

function addItem(){
	formData.value.push({
		resourceId: undefined,
		recyclingCapabilities: true,
		executingDestruction: props.destroyable,
		destroyParameters: {}
	})
}

function removeItem(index){
	formData.value.splice(index, 1)
}

onMounted(()=>{
	for (let each of formData.value) {
		if(!props.destroyable && props.resourceCategory){
			each.executingDestruction = false
			each.recyclingCapabilities = false
		}
	}
})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top">
		<template v-for="(item, index) in formData">
			<ElDivider v-if="index!==0" />
			<ElRow style="width: 100%; display: flex; align-items: center" :gutter="20">
				<ElCol :span="14">
					<ElFormItem
						:label="`待回收资源${index + 1}`"
						:prop="index+'.resourceId'"
						required
						:show-message="false">
						<ResourceSelector
							v-model="item.resourceId"
							:resource-category="resourceCategory"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="4">
					<ElFormItem>
						<template #label>
							<span>
								级联回收
								<ElTooltip>
									<template #content>
										<div style="max-width: 240px">
											级联回收指回收依赖该资源的所有连带资源，以级联回收云主机为例，
											系统将自动回收挂载到该云主机的数据盘、网卡、弹性IP等连带资源。
											若级联回收选择否，系统将保留您的相关连带资源。
										</div>
									</template>
									<ElIcon style="cursor: pointer;"><QuestionFilled /></ElIcon>
								</ElTooltip>
							</span>

						</template>
						<ElSwitch :disabled="!destroyable" v-model="item.recyclingCapabilities" />
					</ElFormItem>
				</ElCol>
				<ElCol :span="4">
					<ElFormItem>
						<template #label>
							<span>
								立即销毁
								<ElTooltip>
									<template #content>
										<div style="max-width: 240px">
											若立即销毁选择否，系统将仅把资源放入回收站，而不在底层执行实际操作
										</div>
									</template>
									<ElIcon style="cursor: pointer;"><QuestionFilled /></ElIcon>
								</ElTooltip>
							</span>

						</template>
						<ElSwitch :disabled="!destroyable" v-model="item.executingDestruction" />
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

			<ResourceActionDynamicForm
				v-if="destroyable && item.executingDestruction && item.resourceId"
				v-model="item.destroyParameters"
				action-id="DESTROY_RESOURCE"
				:resource-id="item.resourceId"
			/>


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
