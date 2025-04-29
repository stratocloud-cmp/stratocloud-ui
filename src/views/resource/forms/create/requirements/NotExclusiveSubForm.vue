<script setup>
import {computed, onMounted, ref} from "vue";
import ResourceSelector from "@/views/resource/components/ResourceSelector.vue";
import {Right} from '@element-plus/icons-vue'
import RelationshipPropertiesForm from '@/views/resource/forms/relationship/RelationshipPropertiesForm.vue'
import {validateForms} from '@/utils/FormUtil.js'

const props = defineProps({
	newRequirements: {
		required: true,
	},
	requirementDef: {
		required: true,
	},
})


const emits = defineEmits(['addNewRequirement', 'removeRequirement'])

function addNewRequirement() {
	let tempRequirement = {
		relationshipTypeId: props.requirementDef.relationshipSpec.relationshipTypeId,
		relationshipInputs: {}
	}
	emits('addNewRequirement', tempRequirement)
}

function removeRequirement(requirement) {
	emits('removeRequirement', requirement)
}



function disabledFlagGetter(item){
	return !props.requirementDef.relationshipSpec.allowedTargetStates.includes(item.state) || item.recycled || item.syncState === 'NOT_FOUND'
}

const categoryName = computed(()=>props.requirementDef.targetSpec.resourceCategoryName)

const formRef = ref()

function validate(callback){
	validateForms(
		[formRef.value, ...propertiesFormRefs.value],
		callback
	)
}

defineExpose({validate})

const propertiesFormRefs = ref([])

</script>

<template>
	<ElForm :model="newRequirements" ref="formRef" label-position="top">
		<ElRow :gutter="12">
			<ElCol :span="4">
				{{requirementDef.relationshipSpec.requirementName}}
			</ElCol>
			<ElCol :span="20">
				<ElButton
					type="primary"
					link
					icon="Plus"
					@click="addNewRequirement"
					style="margin-top: 2px;margin-bottom: 18px; margin-left: 2px"
				>
					{{requirementDef.relationshipSpec.connectActionName}}
				</ElButton>
				<template v-for="(newRequirement, index) in newRequirements">
					<ElRow>
						<ElCol :span="4" style="font-size: 14px">
							<ElButton
								circle
								link
								size="small"
								icon="Close"
								type="danger"
								@click="()=>removeRequirement(newRequirement)"
							/>
							{{ requirementDef.relationshipSpec.requirementName+(index+1) }}
						</ElCol>
						<ElCol :span="20">
							<ElFormItem :prop="index+'.targetResourceId'" required :show-message="false">
								<ResourceSelector
									v-model="newRequirement.targetResourceId"
									:resource-type-id="requirementDef.targetSpec.resourceTypeId"
									:disabled-flag-getter="disabledFlagGetter"
									:placeholder="'请选择'+categoryName"
								/>
							</ElFormItem>
							<RelationshipPropertiesForm
								ref="propertiesFormRefs"
								:relationship-type-id="newRequirement.relationshipTypeId"
								v-model="newRequirement.relationshipInputs" />
						</ElCol>
					</ElRow>
				</template>
			</ElCol>
		</ElRow>



	</ElForm>
</template>

<style scoped>

</style>
