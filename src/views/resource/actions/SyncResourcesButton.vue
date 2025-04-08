<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {useResourceButtonCommon} from '@/views/resource/composables/ResourceButtonCommon.js'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import RecycleResourcesForm from '@/views/resource/forms/recycle/RecycleResourcesForm.vue'
import SynchronizeResourcesForm from '@/views/resource/forms/action/SynchronizeResourcesForm.vue'

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

const formData = ref({})


const {
	drawerFlag,
	buttonLoading,
	formRef,
	openDrawer,
	confirm
} = useResourceButtonCommon(requestGetter, emitsActionSubmitted)

function requestGetter(){
	return {
		jobType: 'SYNCHRONIZE_RESOURCES',
		jobParameters: formData.value
	}
}

function openSyncDrawer(){
	formData.value.resourceIds = props.selectedResources.map(r=>r.id)
	formData.value.synchronizeAll = false
	openDrawer()
}


</script>

<template>
	<StratoButton
		:size="small?'small':'default'"
		:loading="buttonLoading"
		@click="openSyncDrawer"
		:disabled="selectedResources.length === 0"
		plain>
		<span :style="small?{fontSize: '12px'}:{}">同步</span>
	</StratoButton>
	<StratoDrawer
		v-model="drawerFlag"
		:size="800"
		title="同步资源"
		@on-confirm="confirm"
		:loading="buttonLoading"
	>
		<SynchronizeResourcesForm
			v-if="drawerFlag"
			ref="formRef"
			v-model="formData"
		/>
	</StratoDrawer>
</template>

<style scoped>

</style>