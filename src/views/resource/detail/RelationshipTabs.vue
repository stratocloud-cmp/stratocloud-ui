<template>
    <ElTabs>
	    <template v-if="resourceTypeDef.requirements && resourceTypeDef.requirements.length>0">
		    <ElTabPane
			    lazy
			    v-for="requirement in resourceTypeDef.requirements"
			    :label="requirement.relationshipSpec.requirementName"
		    >
			    <RequirementTab :resource="props.resource" :requirement="requirement" />
		    </ElTabPane>
	    </template>
        <template v-if="resourceTypeDef.capabilities && resourceTypeDef.capabilities.length>0">
            <ElTabPane
		            lazy
		            v-for="capability in resourceTypeDef.capabilities.filter(c => c.relationshipSpec.visibleInTarget)"
		            :label="capability.relationshipSpec.capabilityName"
            >
                <CapabilityTab :resource="props.resource" :capability="capability" />
            </ElTabPane>
        </template>

    </ElTabs>
</template>

<script setup>
import { ElTabPane, ElTabs } from 'element-plus'
import CapabilityTab from './CapabilityTab.vue';
import RequirementTab from './RequirementTab.vue';
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'

const props = defineProps({
    resource: {
        required: true,
    },
    resourceTypeDef:{
        required: true,
    }
})

useAccountContext(()=>props.resource.accountId)

</script>