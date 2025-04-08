<script setup>
import { ElDescriptions, ElDescriptionsItem } from "element-plus";

const props = defineProps({
	resource: {
		required: true,
		type: Object
	},
})
</script>

<template>
	<div>
		<div
			v-if="props.resource.allocatedUsages && props.resource.allocatedUsages.length > 0"
			style="font-size: 12px"
		>
			<span v-for="usage in props.resource.allocatedUsages">
				已分配: {{usage.usageTypeName}}: {{usage.usageValue}}&nbsp;
			</span>
		</div>
		<div
			v-if="props.resource.preAllocatedUsages && props.resource.preAllocatedUsages.length > 0"
			style="font-size: 12px"
		>
			<span v-for="usage in props.resource.preAllocatedUsages">
				预分配: {{usage.usageTypeName}}: {{usage.usageValue}}&nbsp;
			</span>
		</div>
	</div>
</template>

<style scoped>

</style>
