<script setup>
import {ref} from 'vue'

const props = defineProps({
	textValue: {
		required: true,
	},
	remoteMethod: {
		required: true,
		type: Function
	},
	remoteRequest: {
		required: true,
		type: Object
	},
	textKey: {
		required: true,
		type: String
	}
})

const editing = ref(false)

const editingText = ref()

function startEditing(){
	editingText.value = props.textValue
	editing.value = true
}

const emits = defineEmits(['confirm'])

function confirmEditing(){
	const request = {
		...props.remoteRequest
	}
	request[props.textKey] = editingText.value
	props.remoteMethod(request).then(() => {
		editing.value = false
		emits('confirm')
	})
}

function cancelEditing(){
	editing.value = false
}
</script>

<template>
	<div>
		<template v-if="editing">
			<ElInput v-model="editingText">
				<template #suffix>
					<ElButton link type="success" icon="Check" @click="confirmEditing" />
					<ElButton link type="danger" icon="Close" @click="cancelEditing" />
				</template>
			</ElInput>
		</template>
		<template v-else>
			<ElText>{{textValue}}</ElText>
			<ElButton link type="primary" style="float: right" icon="Edit" @click="startEditing" />
		</template>
	</div>
</template>

<style scoped>

</style>
