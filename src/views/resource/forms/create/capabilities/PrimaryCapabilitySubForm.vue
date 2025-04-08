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

const isEssential = props.capabilityDef.relationshipSpec.essentialPrimaryCapability

const emits = defineEmits(['addNewCapability', 'removeCapabilities'])

const accountContext = useAccountContext()

useNetworkResourceContextProvider()

watch(accountContext.accountId, ()=>{
	props.newCapabilities.forEach(c => c.resource.externalAccountId = accountContext.accountId.value)
}, {immediate: true})

const enableCapability = ref(false)

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

function triggerRemoveCapabilities(){
	emits('removeCapabilities', props.capabilityDef)
}

onMounted(()=>{
	if(isEssential && props.newCapabilities.length===0){
		triggerAddNewCapability()
	}
})


function handleEnableCapabilityChange(value){
	if(value){
		if(props.newCapabilities.length===0){
			triggerAddNewCapability()
		}
	}else {
		triggerRemoveCapabilities()
	}
}

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
			<div style="margin-top: 4px">
				{{capabilityDef.relationshipSpec.capabilityName}}
			</div>
		</ElCol>
		<ElCol :span="20">
			<ElCheckbox v-if="!isEssential"
			            v-model="enableCapability"
			            @change="handleEnableCapabilityChange"
			            style="margin-bottom: 18px">
				{{capabilityDef.relationshipSpec.connectActionName}}
			</ElCheckbox>
			<template v-for="newCapability in newCapabilities">
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
					is-primary-capability
				/>
				<CapabilitiesSubForm
					ref="formRefs3"
					:capability-defs="capabilityDef.sourceCapabilities"
					v-model="newCapability.capabilities"
				/>
			</template>
		</ElCol>
	</ElRow>
</template>

<style scoped>

</style>