<script setup>
import { Chart } from '@antv/g2';
import {onMounted, ref, watch} from 'vue'

const props = defineProps({
	chartId: {
		required: true,
	},
	sequences: {
		required: true,
		type: Array
	},
	channelX: {
		required: true,
	},
	channelY: {
		required: true,
	},
	channelXName: {
		required: true,
	},
	channelYName: {
		required: true,
	},
	sequenceNameKey : {
		required: true,
	},
	sequenceDataKey: {
		required: true,
	},
	channelXFormatter: {
		required: false,
		default: x => x,
		type: Function
	},
	channelYFormatter: {
		required: false,
		default: y => y,
		type: Function
	},
	renderVersion: {
		required: true,
		type: Number
	}
})

function getChartData(){
	const result = []

	if(!props.sequences) return result

	for (let sequence of props.sequences) {
		const sequenceData = sequence[props.sequenceDataKey]

		if(!sequenceData) continue

		for (let sequencePoint of sequenceData) {
			const point = {}
			point[props.channelXName] = props.channelXFormatter(sequencePoint[props.channelX])
			point[props.channelYName] = props.channelYFormatter(sequencePoint[props.channelY])
			point[props.sequenceNameKey] = sequence[props.sequenceNameKey]

			result.push(point)
		}
	}

	return result
}


function render() {
	const chart = new Chart({
		container: props.chartId,
		autoFit: true,
		theme: 'dark'
	})
	chart
		.line()
		.data({
			type: 'inline',
			value: getChartData(),
		})
		.encode('x', props.channelXName)
		.encode('y', props.channelYName)
		.encode('color', props.sequenceNameKey);

	chart.render();
}

onMounted(()=>{
	render()
})



watch(()=>props.renderVersion, ()=>{
	render()
})

</script>

<template>
	<div :id="chartId"></div>
</template>

<style scoped>

</style>
