<script setup>

import UsageTypeSelector from '@/views/limit/UsageTypeSelector.vue'

const model = defineModel({
	required: true,
	type: Array,
	default: []
})

const props = defineProps({
	providerIds: {
		required: false,
		type: Array,
		default: undefined,
	},
	resourceCategories: {
		required: false,
		type: Array,
		default: undefined,
	},
})


function addModelItem(item){
	model.value.push({
		usageType: item.usageType,
		usageTypeName: item.usageTypeName,
		limitValue: item.limitValue,
	})
}

function removeModelItem(item){
	const index = model.value.indexOf(item)
	if(index >=0){
		model.value.splice(index, 1)
	}
}

function validate(rule, value, callback){
	if(!value || value.length === 0){
		return callback()
	}

	for (let each of value) {
		if(!each.usageType || !each.limitValue){
			return callback(new Error("配额上限未完成填写"))
		}
	}

	return callback()
}

defineExpose({validate})

</script>

<template>
	<ElPopover width="450" trigger="click" :teleported="false">
		<template #reference>
			<ElInput plain suffix-icon="ArrowDown">
				<template #prefix>
					<ElSpace alignment="normal" wrap>
						<template v-for="item in model">
							<ElTag closable @close="()=>removeModelItem(item)">
								{{ (item.usageTypeName?item.usageTypeName:"?")+":"+(item.limitValue?item.limitValue:"?") }}
							</ElTag>
						</template>
					</ElSpace>
				</template>
			</ElInput>
		</template>
		<template #default>
			<div>
				<template v-for="item in model">
					<ElRow :gutter="12" style="margin-bottom: 6px">
						<ElCol :span="10">
							<UsageTypeSelector
								:provider-ids="providerIds"
								:resource-categories="resourceCategories"
								v-model="item.usageType"
								v-model:usage-type-name="item.usageTypeName"
							/>
						</ElCol>
						<ElCol :span="14">
							<ElInput v-model="item.limitValue" />
						</ElCol>
					</ElRow>
				</template>
			</div>

			<ElButton style="width: 100%;margin-top: 6px" icon="Plus" @click="()=>addModelItem({})" />
		</template>

	</ElPopover>
</template>

<style scoped>

</style>