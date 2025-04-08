<script setup>
import RequirementsSubForm from '@/views/resource/forms/create/requirements/RequirementsSubForm.vue'
import CapabilitiesSubForm from '@/views/resource/forms/create/capabilities/CapabilitiesSubForm.vue'
import {onMounted, ref, watch} from 'vue'
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'
import CapabilityPropertiesForm from '@/views/resource/forms/create/capabilities/CapabilityPropertiesForm.vue'
import {useNetworkResourceContextProvider} from '@/views/resource/composables/NetworkResourceContext.js'
import {validateForms} from '@/utils/FormUtil.js'


const props = defineProps({
	newCapabilities: {
		required: true,
		type: Array,
		default: []
	},
	capabilityDef: {
		required: true,
	}
})

const emits = defineEmits(['addNewCapability', 'removeCapability'])

const accountContext = useAccountContext()
useNetworkResourceContextProvider()

watch(accountContext.accountId, ()=>{
	props.newCapabilities.forEach(c => c.resource.externalAccountId = accountContext.accountId.value)
}, {immediate: true})

function triggerAddNewCapability() {
	emits('addNewCapability', {
		resource: {
			resourceTypeId: props.capabilityDef.sourceSpec.resourceTypeId,
			externalAccountId: accountContext.accountId.value,
			properties: {},
			tags: []
		},
		relationshipTypeId: props.capabilityDef.relationshipSpec.relationshipTypeId,
		relationshipProperties: {},
		requirements: [],
		capabilities: []
	})
}

function triggerRemoveCapability(capability) {
	emits('removeCapability', capability)
}

onMounted(() => {

})

const formRefs1 = ref([])
const formRefs2 = ref([])
const formRefs3 = ref([])

function validate(callback){
	validateForms(
		[...formRefs1.value, ...formRefs2.value, ...formRefs3.value],
		callback
	)
}

defineExpose({validate})

</script>

<template>
	<ElRow>
		<ElCol :span="4">
			{{ capabilityDef.relationshipSpec.capabilityName }}
		</ElCol>
		<ElCol :span="20">
			<ElButton
				type="primary"
				link
				icon="Plus"
				@click="triggerAddNewCapability"
				style="margin-top: 2px;margin-bottom: 18px; margin-left: 2px"
			>
				添加{{ capabilityDef.relationshipSpec.capabilityName }}
			</ElButton>

			<template v-for="(newCapability, index) in newCapabilities">
				<ElRow>
					<ElCol :span="4" style="font-size: 14px">
						<ElButton
							circle
							link
							size="small"
							icon="Close"
							type="danger"
							@click="()=>triggerRemoveCapability(newCapability)"
						/>
						{{ capabilityDef.relationshipSpec.capabilityName+(index+1) }}
					</ElCol>
					<ElCol :span="20">
						<RequirementsSubForm
							ref="formRefs1"
							:requirement-defs="capabilityDef.sourceRequirements"
							v-model="newCapability.requirements"
							is-nested
						/>
						<CapabilityPropertiesForm
							ref="formRefs2"
							v-model:resource="newCapability.resource"
							:resource-spec="capabilityDef.sourceSpec"
							:relationship-properties="newCapability.relationshipProperties"
							:relationship-type-id="newCapability.relationshipTypeId"
						/>
						<CapabilitiesSubForm
							ref="formRefs3"
							:capability-defs="capabilityDef.sourceCapabilities"
							v-model="newCapability.capabilities"
						/>
					</ElCol>
				</ElRow>

			</template>
		</ElCol>
	</ElRow>
</template>

<style scoped>

</style>