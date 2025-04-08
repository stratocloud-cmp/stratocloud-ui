<script setup>

import {onMounted, ref} from 'vue'
import {QuestionFilled} from '@element-plus/icons-vue'
import ResourceStackSelector from '@/views/stack/ResourceStackSelector.vue'

const formData = defineModel({
	required: true,
})


defineExpose({validate})

function validate(callback){
	formRef.value.validate(callback)
}

const formRef = ref()

function addItem(){
	formData.value.stacks.push({
		stackId: undefined,
		executingDestruction: true,
	})
}

function removeItem(index){
	formData.value.stacks.splice(index, 1)
}

onMounted(() => {
	if(!formData.value.stacks){
		formData.value.stacks = []
	}
})

</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top">
		<template v-for="(item, index) in formData.stacks">
			<ElDivider v-if="index!==0" />
			<ElRow style="width: 100%; display: flex; align-items: center" :gutter="20">
				<ElCol :span="14">
					<ElFormItem :label="`待回收资源栈${index + 1}`" required>
						<ResourceStackSelector
							v-model="item.stackId"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="8">
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
						<ElSwitch v-model="item.executingDestruction" />
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
