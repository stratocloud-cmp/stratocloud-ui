<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import CategorySelector from '@/views/resource/components/CategorySelector.vue'
import {updateTagEntry} from '@/api/tag.js'

const props = defineProps({
	selectedEntries: {
		required: true,
		type: Array,
	}
})

const formRef = ref()
const formData = ref({
	tagEntryId: undefined,
	tagKeyName: undefined,
	description: undefined,
	resourceCategory: undefined,
	requiredWhenCreating: true,
	requiredWhenFiltering: true,
	userGroupTaggable: false,
})
const drawerFlag = ref(false)
const entry = ref()
function openDrawer(){
	if(props.selectedEntries.length === 0) return

	entry.value = props.selectedEntries[0]

	formData.value.tagEntryId = entry.value.id
	formData.value.tagKeyName = entry.value.tagKeyName
	formData.value.resourceCategory = entry.value.resourceCategory
	formData.value.requiredWhenCreating = entry.value.requiredWhenCreating
	formData.value.requiredWhenFiltering = entry.value.requiredWhenFiltering
	formData.value.userGroupTaggable = entry.value.userGroupTaggable

	formData.value.description = entry.value.description

	drawerFlag.value = true
}

const rules = ref({
	tagKeyName: [{required: true, message: '请输入标签键名称'}],
})

const emits = defineEmits(['confirm'])

function confirmUpdate(){
	formRef.value.validate(valid => {
		if (!valid) return
		updateTagEntry(formData.value).then(resp=>{
			drawerFlag.value = false
			emits('confirm')
		})
	})
}
</script>
<template>
	<ElButton
		link
		type="primary"
		@click="openDrawer"
	>
		更新
	</ElButton>
	<Teleport to="body">
		<StratoDrawer title="更新标签键" v-model="drawerFlag" size="600" @on-confirm="confirmUpdate">
			<ElForm ref="formRef" :model="formData" :rules="rules" label-position="top">
				<ElFormItem prop="tagKey" label="标签键">
					{{entry?.tagKey}}
				</ElFormItem>
				<ElFormItem prop="tagKeyName" label="标签键名称">
					<ElInput placeholder="请输入标签键名称" v-model="formData.tagKeyName" />
				</ElFormItem>
				<ElFormItem prop="resourceCategory" label="所作用的资源类型">
					<CategorySelector v-model="formData.resourceCategory" placeholder="留空代表作用于所有资源类型" />
				</ElFormItem>
				<ElRow>
					<ElCol :span="8">
						<ElFormItem prop="requiredWhenCreating">
							<ElCheckbox v-model="formData.requiredWhenCreating">
								创建资源时必选
							</ElCheckbox>
						</ElFormItem>
					</ElCol>
					<ElCol :span="8">
						<ElFormItem prop="requiredWhenFiltering">
							<ElCheckbox v-model="formData.requiredWhenFiltering">
								筛选资源时必选
							</ElCheckbox>
						</ElFormItem>
					</ElCol>

					<ElCol :span="8">
						<ElFormItem prop="userGroupTaggable">
							<ElCheckbox v-model="formData.userGroupTaggable">
								在用户组中可选
							</ElCheckbox>
						</ElFormItem>
					</ElCol>
				</ElRow>
				<ElFormItem prop="description" label="描述">
					<ElInput type="textarea" v-model="formData.description" />
				</ElFormItem>
			</ElForm>
		</StratoDrawer>
	</Teleport>
</template>

<style scoped>

</style>
