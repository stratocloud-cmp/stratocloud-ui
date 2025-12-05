<script setup>
import {computed, onMounted, ref} from "vue";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";
import ResourceTableSelector from '@/views/resource/components/ResourceTableSelector.vue'

const props = defineProps({
	newRequirements: {
		required: true,
	},
	requirementDef: {
		required: true,
	},
	isNested: {
		required: false,
		default: false,
		type: Boolean
	}
})


const emits = defineEmits(['addNewRequirement'])

function addNewRequirementIfAbsent() {
	if (props.newRequirements.length === 0) {
		let tempRequirement = {
			relationshipTypeId: props.requirementDef.relationshipSpec.relationshipTypeId,
			relationshipInputs: {}
		}
		emits('addNewRequirement', tempRequirement)
	}
}

onMounted(()=>{
	addNewRequirementIfAbsent()
})

function disabledFlagGetter(item){
	return !props.requirementDef.relationshipSpec.allowedTargetStates.includes(item.state) || item.recycled || item.syncState === 'NOT_FOUND'
}

const categoryName = computed(()=>props.requirementDef.targetSpec.resourceCategoryName)

const formRef = ref()

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

const formItemRefs = ref([])
function clearValidation(index){
	formItemRefs.value[index]?.clearValidate()
}

</script>

<template>
	<ElForm ref="formRef" :model="newRequirements" hide-required-asterisk label-position="top">
		<ElRow :gutter="12">
			<ElCol v-if="!isNested" :span="4">{{requirementDef.relationshipSpec.requirementName}}</ElCol>
			<ElCol :span="isNested?24:20">
				<template v-for="(newRequirement, index) in props.newRequirements">
					<ElFormItem
						ref="formItemRefs"
						:label="isNested?requirementDef.relationshipSpec.requirementName:undefined"
						:prop="index+'.targetResourceId'"
						:rules="[{required: true, message: '请选择'+categoryName}]"
						required
						:show-message="false">
						<template v-if="requirementDef.relationshipSpec.selectType === 'TABLE'">
							<ResourceTableSelector
								v-model="newRequirement.targetResourceId"
								:resource-category="requirementDef.targetSpec.resourceCategoryId"
								:resource-type-id="requirementDef.targetSpec.resourceTypeId"
								@clear-validation="() => clearValidation(index)"
							/>
						</template>
						<template v-else>
							<ResourceSelector
								v-model="newRequirement.targetResourceId"
								:resource-type-id="requirementDef.targetSpec.resourceTypeId"
								:disabled-flag-getter="disabledFlagGetter"
								:placeholder="'请选择'+categoryName"
							/>
						</template>

					</ElFormItem>
				</template>
			</ElCol>
		</ElRow>
	</ElForm>
</template>

<style scoped>

</style>
