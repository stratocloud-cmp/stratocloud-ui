<script setup>

import {associateTags, disassociateTag} from '@/api/resource.js'
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import TagValueSelectorGroup from '@/views/tag/TagValueSelectorGroup.vue'

const props = defineProps({
	resource: {
		required: true,
		type: Object
	},
	inList: {
		required: false,
		default: false,
		type: Boolean
	}
})

const emits = defineEmits(['refresh'])

function onRemoveTag(tag){
	disassociateTag({
		resourceId:props.resource.id,
		tagKey: tag.tagKey,
		tagValue: tag.tagValue
	}).then(()=>{
		emits('refresh')
	})
}

const associateTagsDrawerFlag = ref(false)
const associateTagsFormData = ref()
function openAssociateTagsDrawer(){
	associateTagsFormData.value = {
		resourceId: props.resource.id,
		tags: []
	}
	associateTagsDrawerFlag.value = true
}

function confirmAssociateTags(){
	associateTags(associateTagsFormData.value).then(()=>{
		emits('refresh')
		associateTagsDrawerFlag.value = false
	})
}
</script>

<template>
	<template v-if="props.resource.tags && props.resource.tags.length > 0">
		<ElTag v-for="tag in props.resource.tags" type="info" :closable="!inList" @close="()=>onRemoveTag(tag)">
			<div :class="inList?'in-list-overflow':undefined">
				{{tag.tagKeyName}}:&nbsp;{{tag.tagValueName}}
			</div>
		</ElTag>
	</template>
	<ElButton v-if="!inList" style="float: right" link type="primary" icon="plus" @click="openAssociateTagsDrawer" />

	<Teleport to="body">
		<StratoDrawer :title="'绑定标签: '+resource.name" v-model="associateTagsDrawerFlag" @onConfirm="confirmAssociateTags">
			<TagValueSelectorGroup
				v-if="associateTagsDrawerFlag"
				v-model="associateTagsFormData.tags"
				:entry-paging-request="{
					requiredWhenCreating: true,
					resourceCategories: [resource.category]
				}"
				:default-add-all-entries="true"
			/>
		</StratoDrawer>
	</Teleport>

</template>

<style scoped>
.in-list-overflow{
	max-width: 150px;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
