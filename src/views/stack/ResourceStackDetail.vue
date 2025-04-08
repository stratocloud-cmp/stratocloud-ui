<script setup>
import {ElDescriptions, ElLink} from 'element-plus'
import ResourceStackState from '@/views/stack/ResourceStackState.vue'
import UpdateStackBasicsButton from '@/views/stack/actions/UpdateStackBasicsButton.vue'
import TransferStacksButton from '@/views/stack/actions/TransferStacksButton.vue'
import RecycleStacksButton from '@/views/stack/actions/RecycleStacksButton.vue'
import ResourceTags from '@/views/resource/components/ResourceTags.vue'
import ResourceState from '@/views/resource/components/ResourceState.vue'
import ResourceRuntimeProperties from '@/views/resource/components/ResourceRuntimeProperties.vue'
import ResourceLink from '@/views/resource/components/ResourceLink.vue'

const props = defineProps({
	stack: {
		required: true,
	}
})
</script>

<template>
	<span style="float: right;">
		<ElSpace>
			<UpdateStackBasicsButton :selected-stacks="[stack]" size="small" />

			<TransferStacksButton :selected-stacks="[stack]" size="small" />

			<RecycleStacksButton :selected-stacks="[stack]" size="small" />
		</ElSpace>
	</span>
	<ElDescriptions :column="3" border>
		<template #title style="width: 100%">
			<div style="width: 100%">
				<ElLink type="primary">{{stack.name}}</ElLink>
				<ResourceStackState style="margin-left: 20px;" :state="stack.state"/>
			</div>
		</template>
		<ElDescriptionsItem :span="1" label="蓝图">
			{{stack.blueprint.name}}
		</ElDescriptionsItem>
		<ElDescriptionsItem :span="1" label="所有者">
			{{stack.ownerRealName}}
		</ElDescriptionsItem>
		<ElDescriptionsItem :span="1" label="回收状态">
			{{ stack.recycled ? `已于${stack.recycledTime}回收` : '未回收' }}
		</ElDescriptionsItem>
		<ElDescriptionsItem :span="3" label="到期时间">
			{{ stack.expireTime }}
		</ElDescriptionsItem>
		<ElDescriptionsItem :span="3" label="标签">
			<ResourceTags :resource="stack" :in-list="false" />
		</ElDescriptionsItem>
		<ElDescriptionsItem :span="3" label="描述">
			{{ stack.description }}
		</ElDescriptionsItem>
	</ElDescriptions>

	<div style="margin-top: 12px;margin-bottom: 12px">
		<ElText>资源</ElText>
	</div>
	<ElTable :data="stack.nodes" show-overflow-tooltip max-height="300">
		<ElTableColumn prop="resource.name" label="资源名称">
			<template #default="scope">
				<ResourceLink
					:resource-category="scope.row.resource.category"
					:resource-id="scope.row.resource.id"
					:resource-name="scope.row.resource.name"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="nodeName" label="节点名称" />

		<ElTableColumn label="状态">
			<template #default="scope">
				<ResourceState :state="scope.row.resource.state" />
			</template>
		</ElTableColumn>
		<ElTableColumn label="属性">
			<template #default="scope">
				<ResourceRuntimeProperties :resource="scope.row.resource" :in-list="true" />
			</template>
		</ElTableColumn>
	</ElTable>
</template>

<style scoped>

</style>