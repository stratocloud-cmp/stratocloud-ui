<script setup>
import { ElIcon } from 'element-plus';
import { computed } from 'vue';

const props = defineProps({
    state: {
        required: true
    },
	errorMessage: {
		required: false
	}
})

const states = {
	NO_STATE:{
        name: '已初始化',
        icon: 'Clock',
        type: 'info'
    },
	ABNORMAL:{
        name: '连接异常',
        icon: 'Warning',
        type: 'warning'
    },
	NORMAL:{
        name: '正常',
        icon: 'Check',
		type: 'success'
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
	<ElTooltip :disabled="state !== 'ABNORMAL'">
		<ElText :type="computedState.type" style="font-size: 12px;">
			<ElIcon :class="computedState.icon==='Loading'?'is-loading':''"><component :is="computedState.icon"></component></ElIcon>

		</ElText>
		<template #content>
			<div style="max-width: 500px;white-space: pre-wrap;max-height: 400px;overflow: auto" v-html="errorMessage">
			</div>
		</template>
	</ElTooltip>
	<span style="margin-left: 6px">{{computedState.name}}</span>

</template>

<style scoped>
</style>
