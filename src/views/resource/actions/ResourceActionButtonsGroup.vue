<script setup>
import {describeAvailableActions} from "@/api/resource.js";
import {getCurrentInstance, ref, watch} from "vue";
import StratoButton from "@/components/StratoButton.vue";
import {ArrowDown} from "@element-plus/icons-vue";
import CreateResourceButton from '@/views/resource/actions/CreateResourceButton.vue'
import RecycleResourcesButton from '@/views/resource/actions/RecycleResourcesButton.vue'
import {useSessionStore} from '@/stores/session.js'
import ResourcesActionButton from '@/views/resource/actions/ResourcesActionButton.vue'
import SyncResourcesButton from '@/views/resource/actions/SyncResourcesButton.vue'
import TransferResourcesButton from '@/views/resource/actions/TransferResourcesButton.vue'
import ResourcesReadActionButton from '@/views/resource/actions/ResourcesReadActionButton.vue'
import DropResourcesButton from '@/views/resource/actions/DropResourcesButton.vue'

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
	buildActionHidden: {
		required: false,
		type: Boolean,
		default: false
	}
})

const allActions = ref([])
const extraActions = ref([])
const availableActions = ref([])
const readActions = ref([])

function getSelectedIds(){
	return props.selectedResources.map(resource=>resource.id)
}

watch(props, ()=>{
	fetchActions()
}, {immediate: true})

function isActionAvailable(actionId){
	return availableActions.value.some(action=>action.id === actionId)
}

const destroyable = ref(false)

function fetchActions(){
	describeAvailableActions({
		category: props.category,
		resourceIds: getSelectedIds(),
	}).then(resp => {
		allActions.value=[]
		extraActions.value=[]
		if(resp.allActions){
			for (let i = 0; i < resp.allActions.length; i++) {
				let action = resp.allActions[i];

				if(action.id === 'DESTROY_RESOURCE'){
					destroyable.value = true
				}

				if(i<3){
					allActions.value.push(action)
				}else if(action.id==='BUILD_RESOURCE') {
					allActions.value.unshift(action)
				}else if(action.id==='DESTROY_RESOURCE') {
					allActions.value.push(action)
				}else {
					extraActions.value.push(action)
				}
			}
		}

		destroyable.value = allActions.value.filter(each=>each.id === 'DESTROY_RESOURCE').length !== 0

		availableActions.value = resp.availableActions
		readActions.value = resp.readActions
	})
}

defineExpose({fetchActions})

const emits = defineEmits(['actionSubmitted'])

function onActionSubmitted(){
	emits('actionSubmitted')
}


const sessionStore = useSessionStore()

const {proxy} = getCurrentInstance()

function onDropDownItemClicked(actionId){
	if(!actionId) return
	proxy.$refs[actionId][0].openActionDrawer()
}

function triggerReadAction(actionId){
	if(!actionId) return
	proxy.$refs[actionId][0].openResultDrawer()
}
</script>

<template>
	<ElSpace alignment="normal">
		<template v-for="action in allActions">
			<template v-if="action.id==='BUILD_RESOURCE'">
				<template v-if="!buildActionHidden">
					<CreateResourceButton
						:category="category"
						:small="small"
						@action-submitted="onActionSubmitted"
					/>
				</template>
			</template>
			<template v-else-if="action.id==='DESTROY_RESOURCE'">
				<template v-if="sessionStore.hasPermission('Resource', 'BATCH_RECYCLE_RESOURCES')">
					<RecycleResourcesButton
						:small="small"
						:category="category"
						:selected-resources="selectedResources"
						@action-submitted="onActionSubmitted"
						destroyable
					>
						<span :style="small?{fontSize: '12px'}:{}">回收</span>
					</RecycleResourcesButton>
				</template>
			</template>
			<ResourcesActionButton
				v-else-if="selectedResources.length===0"
				:small="small"
				:action="action"
				:selected-resources="selectedResources"
				:category="category"
				@action-submitted="onActionSubmitted"
				disabled
			/>
			<ResourcesActionButton
				v-else
				:small="small"
				:action="action"
				:selected-resources="selectedResources"
				:category="category"
				:disabled="!isActionAvailable(action.id)"
				@action-submitted="onActionSubmitted"
				disabled-message="所选资源无法执行此操作"
			/>
		</template>

		<template
			v-if="!destroyable && sessionStore.hasPermission('Resource', 'BATCH_RECYCLE_RESOURCES')"
		>
			<RecycleResourcesButton
				:small="small"
				:category="category"
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
				:destroyable="false"
			>
				<span :style="small?{fontSize: '12px'}:{}">回收</span>
			</RecycleResourcesButton>
		</template>

		<template v-if="sessionStore.hasPermission('Resource', 'SYNCHRONIZE_RESOURCES')">
			<SyncResourcesButton
				:small="small"
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
			/>
		</template>

		<template v-if="sessionStore.hasPermission('Resource', 'TRANSFER')">
			<TransferResourcesButton
				:small="small"
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
				:category="category"
			/>
		</template>

		<template v-if="sessionStore.hasPermission('Resource', 'DELETE')">
			<DropResourcesButton
				:small="small"
				:selected-resources="selectedResources"
				@action-submitted="onActionSubmitted"
			/>
		</template>

		<template v-if="extraActions.length>0 || readActions.length>0">
			<ElDropdown
				trigger="click"
				:size="small?'small':'default'"
				@command="onDropDownItemClicked"
			>
				<StratoButton :size="small?'small':'default'" :disabled="selectedResources.length===0">
				<span :style="small?{fontSize: '12px'}:{}">
					更多操作<ElIcon size="12" class="el-icon--right"><ArrowDown /></ElIcon>
				</span>
				</StratoButton>
				<template #dropdown>
					<ElDropdownMenu style="width: 120px">
						<template v-for="action in extraActions">
							<ElDropdownItem
								:disabled="!isActionAvailable(action.id)"
								:command="action.id"
							>
								{{action.name}}
							</ElDropdownItem>
						</template>
						<template v-for="action in readActions">
							<ElDropdownItem
								@click="() => triggerReadAction(action.id)"
								command=""
							>
								{{action.name}}
							</ElDropdownItem>
						</template>
					</ElDropdownMenu>
				</template>

			</ElDropdown>
			<div>
				<template v-for="action in extraActions">
					<ResourcesActionButton
						:ref="action.id"
						:action="action"
						:selected-resources="selectedResources"
						:category="category"
						@action-submitted="onActionSubmitted"
						:show-button="false"
					/>
				</template>

				<template v-for="action in readActions">
					<ResourcesReadActionButton
						:ref="action.id"
						:action="action"
						:selected-resources="selectedResources"
						:category="category"
						:show-button="false"
					/>
				</template>
			</div>
		</template>
	</ElSpace>
</template>

<style scoped>
</style>
