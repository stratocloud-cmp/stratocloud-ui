<script setup>
import StratoButton from '@/components/StratoButton.vue'
import UpdateStackForm from '@/views/stack/actions/UpdateStackForm.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {ref} from 'vue'
import {updateStackBasics} from '@/api/resourceStack.js'

const props = defineProps({
	selectedStacks: {
		type: Array,
		required: true
	},
	size: {
		required: false
	}
})

const updateDrawerFlag = ref()
const updateFormRef = ref()
const updateDrawerLoading = ref(false)
const updateFormData = ref()
function onOpenUpdateDrawer(){
	if(props.selectedStacks.length === 0){
		return
	}
	updateFormData.value = {
		stackId: props.selectedStacks[0].id,
		name: props.selectedStacks[0].name,
		description: props.selectedStacks[0].description,

		expireTime: props.selectedStacks[0].expireTime,
		tags: props.selectedStacks[0].tags,
	}
	updateDrawerFlag.value = true
}
function updateStack(){
	updateFormRef.value.validate(valid=>{
		if(!valid) return

		updateDrawerLoading.value = true

		updateStackBasics(updateFormData.value).then(()=>{
			updateDrawerFlag.value = false
			emits('confirm')
		}).finally(()=>{
			updateDrawerLoading.value = false
		})
	})
}

const emits = defineEmits(['confirm'])
</script>

<template>
	<StratoButton
		:disabled="selectedStacks.length!==1"
		disabled-message="请选择且只选择一项"
		:size="size"
		plain
		@click="onOpenUpdateDrawer">编辑</StratoButton>
	<teleport to="body">
		<StratoDrawer
			:loading="updateDrawerLoading"
			v-model="updateDrawerFlag"
			title="编辑资源栈基本信息"
			@on-confirm="updateStack">
			<UpdateStackForm v-if="updateDrawerFlag" ref="updateFormRef" v-model="updateFormData" />
		</StratoDrawer>
	</teleport>
</template>

<style scoped>

</style>