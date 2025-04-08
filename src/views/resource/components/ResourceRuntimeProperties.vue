<script setup>

const props = defineProps({
	resource: {
		required: true,
		type: Object
	},
	inList: {
		required: false,
		type: Boolean
	}
})

</script>

<template>
	<template v-if="resource.runtimeProperties && resource.runtimeProperties.length > 0">
		<template v-for="runtimeProperty in resource.runtimeProperties">
			<ElTooltip :disabled="inList">
				<ElTag
					v-show="runtimeProperty.displayable && (!inList || runtimeProperty.displayInList)"
					type="info"
				>
					<div style="display: flex;flex-wrap: nowrap">
						<div class="in-list-overflow">
							{{runtimeProperty.keyName}}:&nbsp;{{runtimeProperty.valueName}}
						</div>
					</div>
				</ElTag>
				<template #content>
					<div style="max-width: 150px">
						{{runtimeProperty.valueName}}
					</div>
				</template>
			</ElTooltip>
		</template>
	</template>
</template>

<style scoped>
.in-list-overflow{
	max-width: 150px;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
