<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {useResourceButtonCommon} from '@/views/resource/composables/ResourceButtonCommon.js'

const props = defineProps({
	small: {
		required: false,
		type: Boolean,
		default: false
	},
	selectedResources: {
		required: true,
		type: Array
	}
})

const emits = defineEmits(['actionSubmitted'])

function emitsActionSubmitted(){
	emits('actionSubmitted')
}


const {
	buttonLoading,
	confirm,
	formRef
} = useResourceButtonCommon(requestGetter, emitsActionSubmitted)

formRef.value = {
	validate(callback){
		callback(true)
	}
}

function requestGetter(){
	return {
		jobType: 'BATCH_RESTORE_RESOURCES',
		jobParameters: {
			resourceIds: props.selectedResources.map(r=>r.id)
		}
	}
}



</script>

<template>
	<StratoButton
		:size="small?'small':'default'"
		:loading="buttonLoading"
		@click="confirm"
		:disabled="selectedResources.filter(r=>r.state!=='DESTROYED').length === 0"
		disabled-message="请选择回收站中未销毁的资源"
		type="success"
		plain>
		<span :style="small?{fontSize: '12px'}:{}">还原</span>
	</StratoButton>
</template>

<style scoped>

</style>