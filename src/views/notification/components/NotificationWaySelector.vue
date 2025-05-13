<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeAccounts} from "@/api/account.js";
import {useAccountContext} from '@/views/resource/composables/AccountContext.js'
import {describeNotificationWays} from '@/api/notification.js'

const notificationWayId = defineModel()

const props = defineProps({
	disabled: {
		required: false,
		type: Boolean,
		default: false
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	}
})

const pagingRequest = ref({

})
</script>

<template>
	<StratoPagingSelector
		:disabled="props.disabled"
		v-model="notificationWayId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.name"
		:remote-method="describeNotificationWays"
		placeholder="请选择通知方式"
		:multiple="multiple"
		id-filter-key="notificationWayIds"
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.name}}</span>
			<span style="float: right;color: grey">{{scope.row.description}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
