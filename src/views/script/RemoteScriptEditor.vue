<script setup>
import StratoCodeBlock from '@/components/StratoCodeBlock.vue'
import {computed, onMounted, ref} from 'vue'


const model = defineModel({
	required: true,
	type: Object
})

const language = computed(() => {
	switch (model.value.type){
		case "SHELL": return "shell"
		case "POWERSHELL": return "powershell"
		case "PYTHON": return "python"
		default: return "shell"
	}
})

onMounted(() => {
	if(!model.value.type)
		model.value.type = 'SHELL'

	if(!model.value.content)
		model.value.content = ''
})

</script>
<template>
	<div>
		<ElSpace>
			<ElSelect v-model="model.type" style="width: 200px">
				<ElOption value="SHELL" label="Shell" />
				<ElOption value="POWERSHELL" label="Powershell" />
				<ElOption value="PYTHON" label="Python" />
			</ElSelect>
			<ElInput style="width: 200px" placeholder="指定执行程序路径" v-model="model.programPath" />
		</ElSpace>

		<StratoCodeBlock style="margin-top: 20px" :language="language" v-model="model.content" />
	</div>

</template>

<style scoped>

</style>