<script setup>
import { ElIcon, ElTag } from 'element-plus';
import { computed } from 'vue';

const props = defineProps({
	state: {
		required: true
	},
	errorMessage: {
		required: false
	},
	size: {
		required: false
	}
})

const states = {
	AWAIT_START:{
		name: '等待',
		icon: 'Clock',
		type: 'info'
	},
	STARTED:{
		name: '已开始',
		icon: 'Loading',
		type: 'primary'
	},
	FINISHED:{
		name: '执行成功',
		icon: 'Check',
		type: 'success'
	},
	FAILED:{
		name: '失败',
		icon: 'Warning',
		type: 'danger'
	},

	CANCELED:{
		name: '已取消',
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
	<span>
		<ElText style="cursor: pointer" :type="computedState.type">
			<ElTooltip :disabled="state!=='FAILED'">
				<template #content>
					<div style="max-width: 500px;white-space: pre-wrap;max-height: 400px;overflow: auto" v-html="errorMessage">
					</div>
				</template>
				<ElIcon :class="computedState.icon==='Loading'?'is-loading':''">
					<component :is="computedState.icon"></component>
				</ElIcon>
			</ElTooltip>
		</ElText>
		<span style="margin-left: 6px">{{computedState.name}}</span>
	</span>
</template>

<style scoped>
</style>
