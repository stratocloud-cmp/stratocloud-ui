<script setup>
import {computed, ref} from "vue";
import InternalMail from '@/views/notification/InternalMail.vue'

const popOverVisible = ref(false)

const totalUnreadMails = computed(()=>unreadMailRef.value?.getTotal())

const unreadMailRef = ref()

const showingRead = ref(false)
</script>

<template>
	<ElPopover v-model:visible="popOverVisible" placement="bottom-end" :width="600" trigger="click">
		<template #reference>
			<!--suppress JSValidateTypes -->
			<ElBadge :is-dot="totalUnreadMails > 0" type="warning" :offset="[-10, 10]">
				<ElButton size="large" class="job-button" icon="Message" />
			</ElBadge>
		</template>

		<ElRadioGroup size="small" v-model="showingRead" style="margin-bottom: 16px">
			<ElRadioButton label="未读" :value="false"></ElRadioButton>
			<ElRadioButton label="已读" :value="true"></ElRadioButton>
		</ElRadioGroup>

		<InternalMail v-if="showingRead" :is-read="true" />
		<InternalMail ref="unreadMailRef" v-else :is-read="false" />

	</ElPopover>
</template>

<style lang="scss">
.job-button{
	color: white;
	border: 0;
}
.job-button:hover{
	background-color: rgba(7, 0, 112, 0.25);
	color: white;
}
.el-popover.el-popper{
	background: rgba(55, 55, 55, .5);
	backdrop-filter: blur(20px);
}
</style>
