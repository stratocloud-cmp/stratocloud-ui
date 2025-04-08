<script setup>
import StratoPagingSelector from "@/components/StratoPagingSelector.vue";
import {ref, watch} from "vue";
import {describeUsers} from "@/api/user.js";

const userId = defineModel()

const props = defineProps({
	placeholder: {
		required: false,
	},
	multiple: {
		required: false,
		default: false,
		type: Boolean
	}
})

const pagingRequest = ref({})

</script>

<template>
	<StratoPagingSelector
		v-model="userId"
		:paging-request="pagingRequest"
		:label-getter="item=>item.realName"
		:placeholder="placeholder"
		:remote-method="describeUsers"
		:multiple="multiple"
		id-filter-key="userIds"
		teleported
	>
		<template #default="scope">
			<span style="float: left">{{scope.row.realName}}</span>
			<span style="float: right;color: grey">{{scope.row.loginName}}</span>
		</template>
	</StratoPagingSelector>
</template>

<style scoped>

</style>
