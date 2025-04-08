<script setup>
import { ElIcon, ElTag } from 'element-plus';
import { computed } from 'vue';

const props = defineProps({
    state: {
        required: true
    }
})

const states = {
	CONNECTED:{
        name: '已连接',
        icon: 'Check',
        type: 'success'
    },
	CONNECTION_LOST:{
        name: '失去连接',
        icon: 'Warning',
        type: 'warning'
    },
	CREDENTIAL_EXPIRED:{
        name: '凭证失效',
        icon: 'Close',
		type: 'danger'
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