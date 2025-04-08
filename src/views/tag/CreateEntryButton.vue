<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import CategorySelector from '@/views/resource/components/CategorySelector.vue'
import {createTagEntry} from '@/api/tag.js'


const formRef = ref()
const formData = ref({
	tagKey: undefined,
	tagKeyName: undefined,
	resourceCategory: undefined,
	requiredWhenCreating: true,
	requiredWhenFiltering: true,
	userGroupTaggable: false,
})
const drawerFlag = ref(false)
function openDrawer(){
	drawerFlag.value = true
}

const rules = ref({
	tagKey: [{required: true, message: '请输入标签键'}],
	tagKeyName: [{required: true, message: '请输入标签键名称'}],
})

const emits = defineEmits(['confirm'])

function confirmCreate(){
	formRef.value.validate(valid => {
		if (!valid) return
		createTagEntry(formData.value).then(resp=>{
			drawerFlag.value = false
			emits('confirm')
		})
	})
}
</script>
<template>
	<StratoButton type="primary" plain @click="openDrawer">创建</StratoButton>

	<StratoDrawer title="创建标签键" v-model="drawerFlag" size="600" @on-confirm="confirmCreate">
		<ElForm ref="formRef" :model="formData" :rules="rules" label-position="top">
			<ElFormItem prop="tagKey" label="标签键">
				<ElInput placeholder="请输入标签键" v-model="formData.tagKey" />
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
							用户组中可选
						</ElCheckbox>
					</ElFormItem>
				</ElCol>
			</ElRow>
			<ElFormItem prop="description" label="描述">
				<ElInput type="textarea" v-model="formData.description" />
			</ElFormItem>
		</ElForm>
	</StratoDrawer>
</template>

<style scoped>

</style>