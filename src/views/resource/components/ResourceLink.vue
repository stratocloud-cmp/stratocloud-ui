<script setup>

import {useRouter} from 'vue-router'
import {useSessionStore} from '@/stores/session.js'
import {computed} from 'vue'

const props = defineProps({
	resourceId: {
		required: true,
	},
	resourceName: {
		required: true,
	},
	resourceCategory: {
		required: true,
	}
})

const router = useRouter()
const sessionStore = useSessionStore()

const disabled = computed(() => !sessionStore.hasPermission(props.resourceCategory, 'READ'))

function jumpToResource(){
	router.push(`/resource/list/${props.resourceCategory}?id=${props.resourceId}&name=${props.resourceName}`);
}

</script>
<template>
	<ElLink :disabled="disabled" @click="jumpToResource" type="primary">
		{{ resourceName }}
	</ElLink>
</template>

<style scoped>

</style>
