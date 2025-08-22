<!--src/components/SvgIcon/index.vue-->
<template>
	<svg aria-hidden="true" shape-rendering="geometricPrecision">
		<use :xlink:href="symbolId" />
	</svg>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
	iconName: {
		type: String
	}
});

const symbolId = computed(() => `#icon-${props.iconName}`);
</script>

<style scoped>

</style>
