<script setup>
import {computed, onMounted, ref} from "vue";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";

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
	return !props.requirementDef.relationshipSpec.allowedTargetStates.includes(item.state) || item.recycled
}

const categoryName = computed(()=>props.requirementDef.targetSpec.resourceCategoryName)

const formRef = ref()

function validate(callback){
	formRef.value.validate(callback)
}

defineExpose({validate})

</script>

<template>
	<ElForm ref="formRef" :model="newRequirements" hide-required-asterisk label-position="top">
		<ElRow :gutter="12">
			<ElCol v-if="!isNested" :span="4">{{requirementDef.relationshipSpec.requirementName}}</ElCol>
			<ElCol :span="isNested?24:20">
				<template v-for="(newRequirement, index) in props.newRequirements">
					<ElFormItem
						:label="isNested?requirementDef.relationshipSpec.requirementName:undefined"
						:prop="index+'.targetResourceId'"
						:rules="[{required: true, message: '请选择'+categoryName}]"
						required
						:show-message="false">
						<ResourceSelector
							v-model="newRequirement.targetResourceId"
							:resource-type-id="requirementDef.targetSpec.resourceTypeId"
							:disabled-flag-getter="disabledFlagGetter"
							:placeholder="'请选择'+categoryName"
						/>
					</ElFormItem>
				</template>
			</ElCol>
		</ElRow>
	</ElForm>
</template>

<style scoped>

</style>