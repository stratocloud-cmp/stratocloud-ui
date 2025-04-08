<script setup>
import {ElIcon, ElTag} from 'element-plus';
import {computed} from 'vue';

const props = defineProps({
	state: {
		required: true
	}
})

const states = {
	NO_STATE: {
		name: '未关联',
		icon: 'Clock',
		type: 'info'
	},
	CONNECTED: {
		name: '已关联',
		icon: 'Connection',
		type: 'success'
	},

	ERROR: {
		name: '错误',
		icon: 'Warning',
		type: 'danger'
	},

	DISCONNECTED: {
		name: '已解除关联',
		icon: 'CircleClose',
		type: 'warning'
	},

	CONNECTING: {
		name: '正在关联',
		icon: 'Loading',
	},

	DISCONNECTING: {
		name: '正在解除关联',
		icon: 'Loading',
	},

	LOST: {
		name: '关系遗失',
		icon: 'Warning',
		type: 'warning'
	},
}

const computedState = computed(() => {
	let stateDef = states[props.state]
	if (stateDef === undefined) {
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
			<ElIcon :class="computedState.icon==='Loading'?'is-loading':''">
				<component :is="computedState.icon"></component>
			</ElIcon>
		</ElText>
		<span style="margin-left: 6px">{{ computedState.name }}</span>
	</span>
</template>

<style scoped>

</style>
