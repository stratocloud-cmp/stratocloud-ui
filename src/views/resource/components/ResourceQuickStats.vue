<script setup>

import {onMounted, onUnmounted, ref} from 'vue'
import {describeResourceQuickStats} from '@/api/resource.js'

const props = defineProps({
	resourceId: {
		required: true
	},
	hideAfter: {
		required: false,
		default: undefined
	},
	span: {
		required: false,
		default: 24
	},
	showLabel: {
		required: false,
		default: false,
		type: Boolean
	}
})

const quickStats = ref()

function fetchQuickStats(){
	loading.value = true
	describeResourceQuickStats({resourceId:props.resourceId}).then(resp=>{
		quickStats.value = resp.quickStats
		error.value = false
	}).catch(err=>{
		console.log(err)
		error.value = true
	}).finally(()=>{
		loading.value = false
	})
}

const fetchDataIntervalId = ref()

onMounted(() => {
	fetchQuickStats()

	fetchDataIntervalId.value = setInterval(fetchQuickStats, 10000)
})

onUnmounted(()=>{
	clearInterval(fetchDataIntervalId.value)
})

const loading = ref(false)

const error = ref(false)

</script>

<template>
	<div>
		<template v-if="quickStats && quickStats.items && quickStats.items.length>0">
			<ElRow :gutter="4">
				<template v-for="(item,index) in quickStats.items">
					<ElCol v-if="!hideAfter || index<hideAfter" :span="span">
						<template v-if="item.isPercentage">
							<div v-if="showLabel">
								{{item.label}}
							</div>
							<ElProgress
								:stroke-width="16"
								text-inside
								:percentage="item.value"
								color="darkgreen"
							>
								{{item.name}}
							</ElProgress>
						</template>
						<template v-else>
							<div v-if="showLabel">
								{{item.label}}
							</div>
							<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
								{{(showLabel? '':(item.name+':'))+item.valueStr+item.unit}}
							</div>
						</template>
					</ElCol>
				</template>
			</ElRow>
		</template>
		<template v-else-if="loading">
			<ElIcon class="is-loading"><Loading /></ElIcon>
		</template>
		<template v-else-if="error">
			<ElText type="danger">获取失败</ElText>
		</template>
		<template v-else>
			无
		</template>
	</div>

</template>

<style scoped>
</style>
