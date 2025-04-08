<script setup>
import {ElInput} from 'element-plus'
import {ref} from 'vue'
import {describeAuditLogs} from '@/api/auditLog.js'
import StratoTable from '@/components/StratoTable.vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import StratoCodeBlock from '@/components/StratoCodeBlock.vue'

const pagingRequest = ref({})

const drawerFlag = ref(false)
const drawerLog = ref()
function openDrawer(row){
	drawerLog.value = row
	drawerFlag.value = true
}

</script>

<template>
	<div style="margin-bottom: 10px;height: 32px">
		<ElInput style="float: right; width: 20%;" v-model="pagingRequest.search" suffix-icon="search" />
	</div>
	<StratoTable
		:paging-request="pagingRequest"
		:remote-method="describeAuditLogs">
		<ElTableColumn prop="actionName" label="操作名称" sortable="custom">
			<template #default="scope">
				<ElLink @click="()=>openDrawer(scope.row)" type="primary">{{scope.row.actionName}}</ElLink>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="objectTypeName" label="对象类型" sortable="custom" />
		<ElTableColumn prop="objectNames" label="对象" sortable="custom" />
		<ElTableColumn prop="level" label="级别" sortable="custom">
			<template #default="scope">
				<ElText
					:type="scope.row.level==='info'?'info':(scope.row.level==='error'?'danger':'warning')">
					{{scope.row.level}}
				</ElText>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="userRealName" label="操作人" sortable="custom" />
		<ElTableColumn prop="sourceIp" label="源IP" sortable="custom" />
		<ElTableColumn prop="path" label="请求路径" sortable="custom" />
		<ElTableColumn prop="statusCode" label="响应码" sortable="custom">
			<template #default="scope">
				<ElText
					:type="scope.row.statusCode>=400?'danger':(scope.row.statusCode>=300?'warning':'success')">
					{{scope.row.statusCode}}
				</ElText>
			</template>
		</ElTableColumn>
		<ElTableColumn prop="requestedAt" label="时间" sortable="custom" />
	</StratoTable>

	<StratoDrawer v-model="drawerFlag" :size="800" title="日志详情">
		<ElForm>
			<ElRow :gutter="24">
				<ElCol :span="12">
					<ElFormItem label="操作">
						{{drawerLog.actionName}}({{drawerLog.action}})
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="对象类型">
						{{drawerLog.objectTypeName}}({{drawerLog.objectType}})
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="对象名称">
						<ElTooltip>
							<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								{{drawerLog.objectNames}}
							</div>
							<template #content>
								<span style="white-space: pre-wrap" v-html="drawerLog.objectNames"></span>
							</template>
						</ElTooltip>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="对象ID">
						<ElTooltip>
							<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								{{drawerLog.objectIds}}
							</div>
							<template #content>
								<span style="white-space: pre-wrap" v-html="drawerLog.objectIds"></span>
							</template>
						</ElTooltip>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="日志级别">
						{{drawerLog.level}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="请求ID">
						{{drawerLog.requestId}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="操作人登录名">
						{{drawerLog.userLoginName}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="操作人姓名">
						{{drawerLog.userRealName}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="请求路径">
						{{drawerLog.path}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="响应码">
						{{drawerLog.statusCode}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="源IP">
						{{drawerLog.sourceIp}}
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="请求时间">
						{{drawerLog.requestedAt}}
					</ElFormItem>
				</ElCol>
			</ElRow>
		</ElForm>
		<div style="max-width: 90%;">
			<div style="margin-top: 20px">
				<ElText>请求体</ElText>
				<StratoCodeBlock style="margin-top: 6px" language="json" v-model="drawerLog.requestBody" read-only />
			</div>
			<div style="margin-top: 20px">
				<ElText>响应体</ElText>
				<StratoCodeBlock style="margin-top: 6px" language="json" v-model="drawerLog.responseBody" read-only />
			</div>
		</div>

	</StratoDrawer>
</template>

<style scoped>

</style>
