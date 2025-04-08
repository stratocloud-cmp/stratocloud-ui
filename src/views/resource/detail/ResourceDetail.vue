<script setup>
import {ElDescriptions, ElDescriptionsItem, ElLink} from 'element-plus';
import {onMounted, ref} from 'vue';
import ResourceState from '../components/ResourceState.vue';
import RelationshipTabs from './RelationshipTabs.vue'
import ResourceUsages from "@/views/resource/components/ResourceUsages.vue";
import ResourceTags from "@/views/resource/components/ResourceTags.vue";
import ResourceRuntimeProperties from "@/views/resource/components/ResourceRuntimeProperties.vue";
import ResourceActionButtonsGroup from "@/views/resource/actions/ResourceActionButtonsGroup.vue";
import {useResourceTypeDef} from '@/views/resource/composables/ResourceContext.js'
import {useAccountContextProvider} from '@/views/resource/composables/AccountContext.js'
import {describeAccounts} from '@/api/account.js'
import ResourceQuickStats from '@/views/resource/components/ResourceQuickStats.vue'
import StratoTextEditor from '@/components/StratoTextEditor.vue'
import {updateDescription} from '@/api/resource.js'

const props = defineProps({
	resource: {
		required: true,
	}
})

const resourceTypeDef = useResourceTypeDef(()=>props.resource.type)

useAccountContextProvider()

const accountName = ref()

onMounted(()=>{
	describeAccounts(
		{accountIds: [props.resource.accountId]}
	).then(resp => {
		if(resp.content){
			accountName.value = resp.content[0].name
		}
	})
})

const emits = defineEmits(['refresh'])
function onRefresh(){
	emits('refresh')
}
</script>

<template>
	<span style="float: right;">
		<ResourceActionButtonsGroup
			build-action-hidden
			small
			:selected-resources="[resource]"
			:category="resource.category" />
	</span>
	<ElDescriptions :column="3" border>
		<template #title style="width: 100%">
			<div style="width: 100%">
				<span>{{resource.categoryName}}:</span>
				<ElLink style="margin-left: 10px;">{{ resource.name }}</ElLink>
				<ResourceState style="margin-left: 20px;font-size: 12px" :state="resource.state"/>
			</div>
		</template>
		<ElDescriptionsItem label="类型">
			<template #label>
				<div style="width: 100px">类型</div>
			</template>
			{{ resource.typeName }}
		</ElDescriptionsItem>
		<ElDescriptionsItem label="云账号" :span="2">
			<template #label>
				<div style="width: 100px">云账号</div>
			</template>
			{{ resource.providerName }}->
			<ElLink type="primary">
				{{ accountName }}
			</ElLink>
		</ElDescriptionsItem>
		<ElDescriptionsItem label="回收状态">
			<template #label>
				<div style="width: 100px">回收状态</div>
			</template>
			{{ resource.recycled ? `已于${resource.recycledTime}回收` : '未回收' }}
		</ElDescriptionsItem>
		<ElDescriptionsItem label="ID" :span="2">
			<template #label>
				<div style="width: 100px">ID</div>
			</template>
			{{ resource.externalId }}
		</ElDescriptionsItem>
		<ElDescriptionsItem label="估计费用" :span="1">
			<template #label>
				<div style="width: 100px">估计费用</div>
			</template>
			{{resource.monthlyCostDescription}}
		</ElDescriptionsItem>
		<ElDescriptionsItem label="监控" :span="2">
			<template #label>
				<div style="width: 100px">监控</div>
			</template>
			<div style="min-width: 180px">
				<ResourceQuickStats :resource-id="resource.id" :span="6" :hide-after="4" />
			</div>

		</ElDescriptionsItem>
		<ElDescriptionsItem label="属性" :span="3">
			<template #label>
				<div style="width: 100px">属性</div>
			</template>
			<ResourceRuntimeProperties :resource="resource" />
		</ElDescriptionsItem>
		<ElDescriptionsItem label="标签" :span="3">
			<template #label>
				<div style="width: 100px">标签</div>
			</template>
			<ResourceTags :resource="resource" @refresh="onRefresh" />
		</ElDescriptionsItem>
		<ElDescriptionsItem label="描述" :span="3">
			<template #label>
				<div style="width: 100px">描述</div>
			</template>
			<StratoTextEditor
				:remote-method="updateDescription"
				:remote-request="{resourceId: resource.id}"
				:text-value="resource.description"
				text-key="description"
				@confirm="onRefresh"
			/>
		</ElDescriptionsItem>
		<ElDescriptionsItem label="资源使用" :span="3">
			<template #label>
				<div style="width: 100px">资源使用</div>
			</template>
			<ResourceUsages :resource="resource" />
		</ElDescriptionsItem>
	</ElDescriptions>
	<ElRow style="width: 100%">
		<ElCol :span="20">

		</ElCol>
		<ElCol :span="4">

		</ElCol>
	</ElRow>


	<RelationshipTabs v-if="resourceTypeDef" :resource="resource" :resource-type-def="resourceTypeDef"/>
</template>
