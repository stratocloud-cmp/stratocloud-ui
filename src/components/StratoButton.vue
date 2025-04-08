<script setup>
import { ElButton } from 'element-plus';
import {useAttrs} from "vue";
const props = defineProps({
	disabledMessage: {
		required: false,
		default: "请选择列表项后再操作"
	},
	disabled: {
		required: false,
		default: false,
		type: Boolean,
	}
})

const attrs = useAttrs()

</script>
<template>
	<ElButton
		:disabled="props.disabled"
		:class="attrs.type==='primary'?'strato-button-primary':'strato-button'"
		v-bind="attrs"
	>
		<ElTooltip :disabled="!props.disabled" :content="props.disabledMessage">
			<div v-if="attrs.size==='small'"
			     :class="props.disabled?'strato-button-disabled-text-small':'strato-button-text-small'">
				<slot></slot>
			</div>
			<div v-else :class="props.disabled?'strato-button-disabled-text':'strato-button-text'">
				<slot></slot>
			</div>
		</ElTooltip>
	</ElButton>
</template>

<style lang="scss" scoped>
.strato-button-primary{
    background: linear-gradient(45deg, #00a3ff 0%, #513cc6 100%);
    border: 0;
	font-weight: 500;
}
.strato-button-primary:hover{
    background: linear-gradient(45deg, #68c8ff 0%, #6656c2 100%);
}
.strato-button-text{
    font-weight: 500;
    letter-spacing: 0.2rem;
    color: white;
    font-size: 16px;
	width: 100%;
	height: 100%;
}
.strato-button-disabled-text{
	font-weight: 500;
	letter-spacing: 0.2rem;
	color: grey;
	font-size: 16px;
	width: 100%;
	height: 100%;
}
.strato-button{
    font-weight: 500;
}

.strato-button-text-small{
	font-weight: 500;
	letter-spacing: 0.2rem;
	color: white;
	font-size: 12px;
	width: 100%;
	height: 100%;
}
.strato-button-disabled-text-small{
	font-weight: 500;
	letter-spacing: 0.2rem;
	color: grey;
	font-size: 12px;
	width: 100%;
	height: 100%;
}
</style>