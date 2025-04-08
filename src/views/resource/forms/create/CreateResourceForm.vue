<script setup>
import {ElForm} from "element-plus";
import {onMounted, ref} from "vue";
import TenantTreeSelector from "@/views/tenant/TenantTreeSelector.vue";
import {useSessionStore} from "@/stores/session.js";
import UserSelector from "@/views/user/UserSelector.vue";
import ResourceBasicsSubForm from "@/views/resource/forms/create/ResourceBasicsSubForm.vue";
import RequirementsSubForm from "@/views/resource/forms/create/requirements/RequirementsSubForm.vue";
import CapabilitiesSubForm from "@/views/resource/forms/create/capabilities/CapabilitiesSubForm.vue";
import {
	useResourceContextProvider,
	useResourceTypeDef
} from '@/views/resource/composables/ResourceContext.js'
import {useAccountContextProvider} from '@/views/resource/composables/AccountContext.js'
import ResourcePropertiesSubForm from '@/views/resource/forms/create/ResourcePropertiesSubForm.vue'
import {createResourceFormData} from '@/utils/DefaultFormData.js'
import {useNetworkResourceContextProvider} from '@/views/resource/composables/NetworkResourceContext.js'
import {validateForms} from '@/utils/FormUtil.js'
import {cloneDeep} from 'lodash'

const sessionStore = useSessionStore()


const props = defineProps({
	resourceCategory: {
		required: false,
		default: undefined
	}
})

const formData = defineModel({
	required: true,
	default: createResourceFormData
})




const resourceTypeDef = useResourceTypeDef(()=>formData.value.resource.resourceTypeId)

useResourceContextProvider()
useAccountContextProvider()
useNetworkResourceContextProvider()


onMounted(()=>{
	if(!formData.value.tenantId){
		formData.value.tenantId = sessionStore.tenantId
	}

	if(!formData.value.ownerId){
		formData.value.ownerId = sessionStore.userId
	}
})

function getDefaultFormData(){
	return cloneDeep(createResourceFormData)
}

defineExpose({validate, getDefaultFormData})


function validate(callback){
	validateForms(
		[
			formRef.value,
			basicsSubFormRef.value,
			requirementsSubFormRef.value,
			capabilitiesSubFormRef.value,
			propertiesSubFormRef.value
		],
		callback
	)
}

const formRef = ref()
const basicsSubFormRef = ref()
const requirementsSubFormRef = ref()
const capabilitiesSubFormRef = ref()

const propertiesSubFormRef = ref()

const rules = ref({
	tenantId: [{required: true, message: '请选择租户', trigger: 'blur'}],
	ownerId: [{required: true, message: '请选择所有者', trigger: 'blur'}],
})


</script>

<template>
	<ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
		<ElRow :gutter="12">
			<ElCol :span="4">
				资源归属
			</ElCol>
			<ElCol :span="10">
				<ElFormItem prop="tenantId">
					<TenantTreeSelector v-model="formData.tenantId" />
				</ElFormItem>
			</ElCol>
			<ElCol :span="10">
				<ElFormItem prop="ownerId">
					<UserSelector placeholder="请选择所有者" v-model="formData.ownerId" />
				</ElFormItem>
			</ElCol>
		</ElRow>


		<ResourceBasicsSubForm
			ref="basicsSubFormRef"
			:resource-category="props.resourceCategory"
			v-model="formData.resource"
		/>

		<ElRow :gutter="12" v-if="resourceTypeDef">
			<ElCol :span="4">
				数量
			</ElCol>
			<ElCol :span="10">
				<ElFormItem prop="number">
					<ElInputNumber
						style="width: 100%"
						v-model="formData.number"
						:min="1"
						:max="200"
						:value-on-clear="1"
					/>
				</ElFormItem>
			</ElCol>
		</ElRow>


		<RequirementsSubForm
			ref="requirementsSubFormRef"
			v-if="resourceTypeDef && formData.requirements"
			v-model="formData.requirements"
			:requirement-defs="resourceTypeDef.requirements" />
		<CapabilitiesSubForm
			ref="capabilitiesSubFormRef"
			v-if="resourceTypeDef && formData.capabilities"
			v-model="formData.capabilities"
			:capability-defs="resourceTypeDef.capabilities"
		/>
		<ElRow :gutter="12" v-if="resourceTypeDef" style="margin-top: 12px">
			<ElCol :span="4">
				{{resourceTypeDef.spec.resourceCategoryName}}属性
			</ElCol>
			<ElCol :span="20">
				<ResourcePropertiesSubForm
					ref="propertiesSubFormRef"
					:resource-type-spec="resourceTypeDef.spec"
					enable-description
					enable-tags
					v-model="formData.resource" />
			</ElCol>
		</ElRow>

	</ElForm>
</template>

<style scoped>

</style>