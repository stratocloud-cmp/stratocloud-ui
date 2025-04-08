<script setup>
import { ElIcon, ElTag } from 'element-plus';
import { computed } from 'vue';

const props = defineProps({
    state: {
        required: true
    }
})

const states = {
	AVAILABLE:{
        name: '可用',
        icon: 'Check',
        type: 'success'
    },
	ALLOCATED:{
        name: '已占用',
        icon: 'Lock',
        type: 'danger'
    },
	EXCLUDED:{
        name: '已排除',
        icon: 'Close',
		type: 'warning'
    },
}

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
    <ElTag size="small" :type="computedState.type" style="font-size: 12px;">
        <ElIcon :class="computedState.icon==='Loading'?'is-loading':''"><component :is="computedState.icon"></component></ElIcon>
        <span style="margin-left: 2px">{{computedState.name}}</span>
    </ElTag>
</template>

<style scoped>
</style>