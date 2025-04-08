<script setup>
import StratoButton from '@/components/StratoButton.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {ref} from 'vue'
import ResourceStack from '@/views/stack/ResourceStack.vue'

const recycleBinFlag = ref(false)
function openRecycleBin(){
	recycleBinFlag.value = true
}
</script>

<template>
	<StratoButton
		icon="Delete"
		plain
		@click="openRecycleBin">回收站</StratoButton>
	<StratoDrawer size="800" v-model="recycleBinFlag" title="回收站" no-confirm>
		<ResourceStack v-if="recycleBinFlag" recycle-bin-mode />
	</StratoDrawer>
</template>

<style scoped>

</style>