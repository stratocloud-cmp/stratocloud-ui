<script setup>
import StratoButton from '@/components/StratoButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import CreateResourceForm from '@/views/resource/forms/create/CreateResourceForm.vue'
import {useResourceButtonCommon} from '@/views/resource/composables/ResourceButtonCommon.js'
import {ref} from 'vue'
import {cloneDeep} from 'lodash'
import CreateResourcePriceInquiry from '@/views/resource/forms/create/CreateResourcePriceInquiry.vue'
import AddToCartButton from '@/views/cart/AddToCartButton.vue'

const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	category: {
		required: true
	},
})

const defaultFormData = {
	tenantId: undefined,
	ownerId: undefined,
	resource: {
		resourceTypeId: undefined,
		externalAccountId: undefined,
		resourceName: undefined,
		properties: {},
		tags: [],
		description: undefined,
	},
	requirements: [],
	capabilities: [],
	number: 1
}

const formData = ref(cloneDeep(defaultFormData))

const emits = defineEmits(['actionSubmitted'])

function emitsActionSubmitted(){
	emits('actionSubmitted')
}

const {
	drawerFlag,
	buttonLoading,
	formRef,
	openDrawer,
	confirm
} = useResourceButtonCommon(requestGetter, emitsActionSubmitted)

function requestGetter(){
	return {
		jobType: 'BATCH_CREATE_RESOURCES',
		jobParameters: {
			resources: [formData.value]
		}
	}
}

function openCreateDrawer(){
	formData.value = cloneDeep(defaultFormData)
	openDrawer()
}

function closeDrawer(){
	drawerFlag.value = false
}

</script>


<template>
	<StratoButton
		:size="small?'small':'default'"
		type="primary"
		@click="openCreateDrawer"
		:loading="buttonLoading"
	>
		<span :style="small?{fontSize: '12px'}:{}">创建</span>
	</StratoButton>
	<StratoDrawer
		:size="1000"
		v-model="drawerFlag"
		title="创建资源"
		@onConfirm="confirm"
		:loading="buttonLoading"
	>
		<CreateResourceForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
			:resource-category="category" />

		<template #footer v-if="drawerFlag">
			<CreateResourcePriceInquiry :form-data="formData" />
			<AddToCartButton
				style="margin-left: 36px"
				job-type="BATCH_CREATE_RESOURCES"
				:job-parameters="{resources:[formData]}"
				:form-ref="formRef"
				@confirm="closeDrawer"
			/>
		</template>
	</StratoDrawer>
</template>
