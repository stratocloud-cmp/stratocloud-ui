<script setup>
import {describeAvailableActions} from "@/api/resource.js";
import {ref, watch} from "vue";
import RecycleResourcesButton from '@/views/resource/actions/RecycleResourcesButton.vue'
import {useSessionStore} from '@/stores/session.js'
import SyncResourcesButton from '@/views/resource/actions/SyncResourcesButton.vue'
import RestoreResourcesButton from '@/views/resource/actions/RestoreResourcesButton.vue'

const props = defineProps({
	selectedResources: {
		type: Array,
		required: true,
	},
	category: {
		required: true
	},
	small: {
		required: false,
		type: Boolean,
		default: false
	},
})

const allActions = ref([])

function getSelectedIds(){
	return props.selectedResources.map(resource=>resource.id)
}

watch(props, ()=>{
	fetchActions()
}, {immediate: true})


const destroyable = ref(false)

function fetchActions(){
	describeAvailableActions({
		category: props.category,
		resourceIds: getSelectedIds(),
	}).then(resp => {
		allActions.value=[]
		if(resp.allActions){
			for (let i = 0; i < resp.allActions.length; i++) {
				let action = resp.allActions[i];

				if(action.id === 'DESTROY_RESOURCE'){
					destroyable.value = true
				}

				allActions.value.push(action)
			}
		}

		destroyable.value = allActions.value.filter(each=>each.id === 'DESTROY_RESOURCE').length !== 0
	})
}

defineExpose({fetchActions})

const emits = defineEmits(['actionSubmitted'])

function onActionSubmitted(){
	emits('actionSubmitted')
}


const sessionStore = useSessionStore()


</script>

<template>
	<ElSpace alignment="normal">
		<template v-if="sessionStore.hasPermission('Resource', 'BATCH_RESTORE_RESOURCES')">
			<RestoreResourcesButton
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
			/>
		</template>

		<template v-for="action in allActions">
			<template v-if="action.id==='DESTROY_RESOURCE'">
				<template v-if="sessionStore.hasPermission('Resource', 'BATCH_RECYCLE_RESOURCES')">
					<RecycleResourcesButton
						:small="small"
						:category="category"
						:selected-resources="selectedResources"
						@action-submitted="onActionSubmitted"
						destroyable
						recycle-bin-mode
					/>
				</template>
			</template>
		</template>

		<template v-if="sessionStore.hasPermission('Resource', 'SYNCHRONIZE_RESOURCES')">
			<SyncResourcesButton
				:small="small"
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
			/>
		</template>
	</ElSpace>
</template>

<style scoped>
</style>
