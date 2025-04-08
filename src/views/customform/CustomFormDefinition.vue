<script setup>

import {ref} from 'vue'

const model = defineModel({
	required: true,
	type: Object
})

function handleAddItem(){
	model.value.items.push({
		type: '',
		key: undefined,
		label: undefined,
		description: undefined,
		encrypted: false,
		detail: {}
	})
}

function handleRemoveItem(item) {
	model.value.items.splice(model.value.items.indexOf(item), 1)
}

const formRef = ref()
function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})
</script>

<template>
	<ElForm ref="formRef" :model="model" size="small" label-position="top">
		<ElTable :data="model.items" size="small">
			<ElTableColumn prop="type" label="类型" width="130">
				<template #default="scope">
					<ElFormItem :prop="'items.'+scope.$index+'.type'" required :show-message="false">
						<ElSelect v-model="scope.row.type">
							<ElOption value="BooleanField" label="勾选框" />
							<ElOption value="InputField" label="输入框" />
							<ElOption value="NumberField" label="数字输入框" />
							<ElOption value="SelectField" label="下拉框" />
						</ElSelect>
					</ElFormItem>
				</template>
			</ElTableColumn>
			<ElTableColumn label="键值" width="120">
				<template #default="scope">
					<ElFormItem :prop="'items.'+scope.$index+'.key'" required :show-message="false">
						<ElInput v-model="scope.row.key" />
					</ElFormItem>
				</template>
			</ElTableColumn>
			<ElTableColumn label="名称" width="120">
				<template #default="scope">
					<ElFormItem :prop="'items.'+scope.$index+'.label'" required :show-message="false">
						<ElInput v-model="scope.row.label" />
					</ElFormItem>
				</template>
			</ElTableColumn>
			<ElTableColumn label="描述" width="120">
				<template #default="scope">
					<ElFormItem :prop="'items.'+scope.$index+'.description'">
						<ElInput v-model="scope.row.description" />
					</ElFormItem>
				</template>
			</ElTableColumn>
			<ElTableColumn label="是否加密" width="80">
				<template #default="scope">
					<ElFormItem :prop="'items.'+scope.$index+'.encrypted'">
						<ElCheckbox v-model="scope.row.encrypted" />
					</ElFormItem>
				</template>
			</ElTableColumn>
			<ElTableColumn label="高级选项">
				<template #default="scope">
					<template v-if="scope.row.type==='BooleanField'">
						<ElRow :gutter="8">
							<ElCol :span="4">
								<ElFormItem label="默认值">
									<ElCheckbox v-model="scope.row.detail.defaultValue"></ElCheckbox>
								</ElFormItem>
							</ElCol>
							<ElCol :span="8">
								<ElFormItem label="显示条件">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.conditions" />
								</ElFormItem>
							</ElCol>
						</ElRow>
					</template>
					<template v-else-if="scope.row.type==='InputField'">
						<ElRow :gutter="8">
							<ElCol :span="6">
								<ElFormItem label="默认值">
									<ElInput v-model="scope.row.detail.defaultValue"></ElInput>
								</ElFormItem>
							</ElCol>
							<ElCol :span="4">
								<ElFormItem label="是否必填">
									<ElCheckbox v-model="scope.row.detail.required"></ElCheckbox>
								</ElFormItem>
							</ElCol>
							<ElCol :span="6">
								<ElFormItem label="输入类型">
									<ElSelect v-model="scope.row.detail.inputType">
										<ElOption value="text" label="默认" />
										<ElOption value="textarea" label="文本框" />
										<ElOption value="password" label="密码框" />
									</ElSelect>
								</ElFormItem>
							</ElCol>
							<ElCol :span="8">
								<ElFormItem label="显示条件">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.conditions" />
								</ElFormItem>
							</ElCol>
						</ElRow>
					</template>
					<template v-else-if="scope.row.type==='NumberField'">
						<ElRow :gutter="8">
							<ElCol :span="4">
								<ElFormItem label="默认值">
									<ElInputNumber :controls="false" v-model="scope.row.detail.defaultValue" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="4">
								<ElFormItem label="最小值">
									<ElInputNumber :controls="false" v-model="scope.row.detail.min" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="4">
								<ElFormItem label="最大值">
									<ElInputNumber :controls="false" v-model="scope.row.detail.max" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="4">
								<ElFormItem label="是否必填">
									<ElCheckbox v-model="scope.row.detail.required" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="8">
								<ElFormItem label="显示条件">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.conditions" />
								</ElFormItem>
							</ElCol>
						</ElRow>
					</template>
					<template v-else-if="scope.row.type==='SelectField'">
						<ElRow :gutter="8">
							<ElCol :span="5">
								<ElFormItem label="默认值">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.defaultValues" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="5">
								<ElFormItem label="选项值">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.options" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="5">
								<ElFormItem label="选项名">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.optionNames" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="4">
								<ElFormItem label="是否必填">
									<ElCheckbox v-model="scope.row.detail.required" />
								</ElFormItem>
							</ElCol>
							<ElCol :span="5">
								<ElFormItem label="显示条件">
									<ElSelect suffix-icon="" filterable multiple allow-create v-model="scope.row.detail.conditions" />
								</ElFormItem>
							</ElCol>
						</ElRow>
					</template>
				</template>
			</ElTableColumn>
			<ElTableColumn width="80">
				<template #header>
					<ElButton icon="Plus" @click="handleAddItem" />
				</template>
				<template #default="scope">
					<ElButton type="danger" icon="Minus" @click="()=>handleRemoveItem(scope.row)" />
				</template>
			</ElTableColumn>
		</ElTable>
	</ElForm>
</template>

<style scoped>

</style>