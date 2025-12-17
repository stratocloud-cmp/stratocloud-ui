<script setup>
import StratoSelector from '@/components/StratoSelector.vue'
import {describeProviders} from '@/api/resource.js'
import {ref} from 'vue'
import ProviderLogo from '@/views/resource/components/ProviderLogo.vue'

const providerId = defineModel()

const props = defineProps({
	multiple: {
		required: false,
		type: Boolean,
		default: false
	},
	disabled: {
		required: false,
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['change'])

function onSelectChange(row){
	emits('change', row)
}

const request = ref({})
</script>

<template>
	<StratoSelector
		v-model="providerId"
		@change="onSelectChange"
		:list-getter="resp=>resp.providers"
		:value-getter="item=>item.id"
		:label-getter="item=>item.name"
		:remote-method="describeProviders"
		:request="request"
		:multiple="multiple"
		:disabled="disabled"
	>
		<template #default="scope">
			<span style="float: left">
				<ProviderLogo style="margin-right: 2px" :logo-id="scope.row.id" type="Provider" />
				{{scope.row.name}}
			</span>
		</template>
		<template #label="{ label }">
			<span style="float: left">
				<ProviderLogo v-if="providerId" :logo-id="providerId" type="Provider" />
				{{label}}
			</span>
		</template>
	</StratoSelector>
</template>

<style scoped>

</style>
