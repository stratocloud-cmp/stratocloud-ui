<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {dropResources} from '@/api/resource.js'
import {dropStacks} from '@/api/resourceStack.js'

const props = defineProps({
	selectedStacks: {
		type: Array,
		required: true
	},
	size: {
		required: false
	}
})

const emits = defineEmits(['confirm'])

function onDrop(){
	if(props.selectedStacks.length === 0){
		return
	}

	const stackIds = props.selectedStacks.map(r=>r.id)

	const request = {stackIds}

	dropStacks(request).then(() => {
		emits('confirm')
	})
}
</script>

<template>
	<ElPopconfirm title="解除纳管" @confirm="onDrop">
		<template #reference>
			<StratoButton
				:size="size"
				:disabled="selectedStacks.length===0"
				plain
			>
				解除纳管
			</StratoButton>
		</template>
	</ElPopconfirm>
</template>

<style scoped>

</style>