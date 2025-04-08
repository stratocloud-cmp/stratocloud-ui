<script setup>

import {onMounted, ref} from 'vue'
import {describeTagEntries} from '@/api/tag.js'
import TagValueSelector from '@/views/tag/TagValueSelector.vue'
import TagEntrySelector from '@/views/tag/TagEntrySelector.vue'

const model = defineModel({
	required: true,
	type: Array,
	default: []
})

const props = defineProps({
	entryPagingRequest: {
		required: true
	},
	span: {
		required: false,
		default: 12
	},
	defaultAddAllEntries: {
		required: false,
		default: true,
		type: Boolean
	}
})

const entries = ref([])

function addModelItem(entry){
	model.value.push({
		tagKey: entry.tagKey,
		tagKeyName: entry.tagKeyName
	})
}

onMounted(()=>{
	describeTagEntries({
		...props.entryPagingRequest,
		current: 0,
		size: 50
	}).then(resp=>{
		entries.value = resp.content

		if(props.defaultAddAllEntries){
			for (let e of entries.value) {
				if(model.value.some(each => each.tagKey === e.tagKey)){
					continue
				}

				addModelItem(e)
			}
		}
	})
})


function removeModelItem(item){
	const index = model.value.indexOf(item)
	if(index >= 0){
		model.value.splice(index, 1)
	}

}

function validate(rule, value, callback){
	if(!value || value.length === 0){
		return callback()
	}

	for (let each of value) {
		if(!each.tagKey || !each.tagValue){
			return callback(new Error("标签未选择"))
		}
	}

	return callback()
}

defineExpose({validate})

</script>

<template>
	<ElPopover width="450" trigger="click" :teleported="false">
		<template #reference>
			<ElInput plain suffix-icon="ArrowDown">
				<template #prefix>
					<ElSpace alignment="normal" wrap>
						<template v-for="item in model">
							<ElTag closable @close="()=>removeModelItem(item)">
								{{ (item.tagKeyName?item.tagKeyName:"?")+":"+(item.tagValueName?item.tagValueName:"?") }}
							</ElTag>
						</template>
					</ElSpace>
				</template>
			</ElInput>
		</template>
		<template #default>
			<div>
				<template v-for="item in model">
					<ElRow :gutter="12" style="margin-bottom: 6px">
						<ElCol :span="10">
							<TagEntrySelector
								v-model="item.tagKey"
								v-model:tag-key-name="item.tagKeyName"
								:paging-request="entryPagingRequest"
							/>
						</ElCol>
						<ElCol :span="14">
							<TagValueSelector
								v-model="item.tagValue"
								v-model:tag-value-name="item.tagValueName"
								:tag-entry-key="item.tagKey"
								:tag-entry-name="item.tagKeyName"
							/>
						</ElCol>
					</ElRow>
				</template>
			</div>

			<ElButton style="width: 100%;margin-top: 6px" icon="Plus" @click="()=>addModelItem({})" />
		</template>

	</ElPopover>
</template>

<style scoped>

</style>