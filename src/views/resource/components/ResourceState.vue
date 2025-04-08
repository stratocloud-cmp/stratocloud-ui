<script setup>
import { ElIcon, ElTag } from 'element-plus';
import { computed } from 'vue';
import {ResourceStates} from '@/views/resource/components/ResourceConstants.js'

const props = defineProps({
    state: {
        required: true
    }
})

const states = ResourceStates

const computedState = computed(()=>{
    let stateDef = states[props.state]
    if(stateDef === undefined){
        stateDef = {
            name: props.state,
            icon: 'QuestionFilled',
            type: "warning"
        }
    }

    return stateDef
})

</script>
<template>
	<span>
		<ElText style="cursor: pointer" :type="computedState.type">
			<ElIcon :class="computedState.icon==='Loading'?'is-loading':''"><component :is="computedState.icon"></component></ElIcon>
		</ElText>
		<span style="margin-left: 6px">{{computedState.name}}</span>
	</span>
</template>

<style scoped>
</style>
