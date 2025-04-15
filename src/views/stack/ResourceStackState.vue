<script setup>
import { ElIcon } from 'element-plus';
import { computed } from 'vue';

const props = defineProps({
    state: {
        required: true
    }
})
/**
 * NO_STATE,
 *     CREATING,
 *     CREATE_ERROR,
 *     RUNNING,
 *     SHUTTING_DOWN,
 *     SHUTDOWN_ERROR,
 *     SHUTDOWN
 *
 */
const states = {
	NO_STATE:{
        name: '未创建',
        icon: 'Clock',
        type: 'info'
    },
	CREATING:{
        name: '创建中',
        icon: 'Loading',
		type: 'primary'
    },
	CREATE_ERROR:{
        name: '创建失败',
        icon: 'Warning',
		type: 'danger'
    },

	RUNNING:{
		name: '运行中',
		icon: 'VideoPlay',
		type: 'success'
	},
	SHUTTING_DOWN:{
		name: '销毁中',
		icon: 'Loading',
		type: 'warning'
	},
	SHUTDOWN_ERROR:{
		name: '销毁失败',
		icon: 'Warning',
		type: 'danger'
	},

	SHUTDOWN:{
		name: '已销毁',
		icon: 'Delete',
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
		<ElText style="cursor: pointer" :type="computedState.type">
	        <ElIcon :class="computedState.icon==='Loading'?'is-loading':''"><component :is="computedState.icon"></component></ElIcon>
	    </ElText>
		<span style="margin-left: 6px">{{computedState.name}}</span>
	</span>
</template>

<style scoped>
</style>
