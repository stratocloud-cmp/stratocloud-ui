<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {dropResources} from '@/api/resource.js'

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

function onDrop(){
	if(props.selectedResources.length === 0){
		return
	}

	const resourceIds = props.selectedResources.map(r=>r.id)

	const request = {resourceIds}

	dropResources(request).then(() => {
		emits('actionSubmitted')
	})
}
</script>

<template>
	<ElPopconfirm title="解除纳管" @confirm="onDrop">
		<template #reference>
			<StratoButton
				:size="small?'small':'default'"
				:disabled="selectedResources.length===0"
				plain
			>
				解除纳管
			</StratoButton>
		</template>
	</ElPopconfirm>
</template>

<style scoped>

</style>