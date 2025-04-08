<script setup>
import { ElIcon, ElTag } from 'element-plus';
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
	AWAIT_SUBMIT:{
        name: '待提交',
        icon: 'Clock',
        type: 'info'
    },
	PENDING:{
        icon: 'Loading',
		type: 'info',
    },

	CANCELED:{
        name: '已取消',
        icon: 'CircleClose',
		type: 'danger'
    },

	DENIED:{
        name: '已拒绝',
        icon: 'CircleClose',
        type: 'danger'
    },
	REJECTED:{
        name: '已驳回',
        icon: 'Back',
        type: 'warning'
    },
	PROCESS_ROLLED_BACK:{
        name: '已回退',
        icon: 'Back',
        type: 'warning'
    },
	AWAIT_APPROVAL:{
        name: '待审批',
        icon: 'Avatar',
		type: 'warning'
    },
	AWAIT_CONFIRM:{
        name: '待确认',
        icon: 'User',
		type: 'warning'
    },

	EXECUTING:{
        name: '执行中',
        icon: 'Loading',
		type: 'primary'
    },

	FINISHED:{
        name: '已完成',
        icon: 'Check',
        type: 'success'
    },
	FAILED:{
        name: '已失败',
        icon: 'Warning',
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
	<span>
		<ElTooltip :disabled="state !== 'FAILED'">
			<ElText style="cursor: pointer" :type="computedState.type">
				<ElIcon :class="computedState.icon==='Loading'?'is-loading':''">
					<component :is="computedState.icon"></component>
				</ElIcon>
			</ElText>
			<template #content>
				<div style="max-width: 500px;white-space: pre-wrap;max-height: 400px;overflow: auto" v-html="errorMessage">
				</div>
			</template>
		</ElTooltip>
		<span style="margin-left: 6px">{{computedState.name}}</span>
	</span>


</template>

<style scoped>
</style>
