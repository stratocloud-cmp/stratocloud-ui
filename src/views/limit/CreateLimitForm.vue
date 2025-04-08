<script setup>
import {onMounted, ref} from 'vue'
import {ElFormItem} from 'element-plus'
import TenantTreeSelector from '@/views/tenant/TenantTreeSelector.vue'
import UserSelector from '@/views/user/UserSelector.vue'
import ProviderSelector from '@/views/resource/components/ProviderSelector.vue'
import AccountSelector from '@/views/account/AccountSelector.vue'
import CategorySelector from '@/views/resource/components/CategorySelector.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'
import LimitItemSelectorGroup from '@/views/limit/LimitItemSelectorGroup.vue'

const formData = defineModel()

const formRef = ref()


defineExpose({validate})
function validate(callback) {
	formRef.value.validate(callback)
}

const tagRef = ref()

const rules = ref({
	tenantId: [{required: true, message: '请选择租户'}],
	name: [{required: true, message: '请输入名称'}],
	tags: [{validator: (rule,value,callback)=>tagRef.value?.validate(rule,value,callback), trigger: 'change'}],
})

onMounted(()=>{

})
</script>

<template>

	<ElForm
		ref="formRef"
		:model="formData"
		label-position="top"
		:rules="rules"
		style="padding-left: 20px;padding-right: 20px"
	>
		<ElFormItem label="所属租户" prop="tenantId">
			<TenantTreeSelector v-model="formData.tenantId" />
		</ElFormItem>
		<ElFormItem label="名称" prop="name">
			<ElInput v-model="formData.name" placeholder="请输入名称" />
		</ElFormItem>
		<ElFormItem label="描述" prop="description">
			<ElInput v-model="formData.description" type="textarea" placeholder="请输入描述" />
		</ElFormItem>
		<ElFormItem label="所有者范围" prop="ownerIds">
			<UserSelector v-model="formData.ownerIds" multiple placeholder="留空代表匹配任意所有者" />
		</ElFormItem>
		<ElFormItem label="云平台范围" prop="providerIds">
			<ProviderSelector v-model="formData.providerIds" multiple placeholder="留空代表匹配任意云平台" />
		</ElFormItem>
		<ElFormItem label="云账号范围" prop="accountIds">
			<AccountSelector v-model="formData.accountIds" multiple placeholder="留空代表匹配任意云账号" />
		</ElFormItem>
		<ElFormItem label="云资源类型范围" prop="resourceCategories">
			<CategorySelector v-model="formData.resourceCategories" multiple placeholder="留空代表匹配任意云资源类型" />
		</ElFormItem>
		<ElFormItem label="云资源标签范围" prop="tags">
			<TagValueSelectorGroup
				ref="tagRef"
				v-model="formData.tags"
				:entry-paging-request="{}"
				:default-add-all-entries="false"
			/>
		</ElFormItem>
		<ElFormItem label="配额上限项" prop="items">
			<LimitItemSelectorGroup
				ref="itemRef"
				v-model="formData.items"
				:provider-ids="formData.providerIds"
				:resource-categories="formData.resourceCategories"
			/>
		</ElFormItem>
	</ElForm>
</template>

<style scoped>

</style>