<script setup>
import RemoteScriptEditor from '@/views/script/RemoteScriptEditor.vue'
import CustomFormDefinition from '@/views/customform/CustomFormDefinition.vue'
import {ref} from 'vue'
import {QuestionFilled, Warning} from '@element-plus/icons-vue'

const model = defineModel({
	required: true,
	type: Object
})

const customFormRef = ref()

function validate(callback){
	customFormRef.value.validate(callback)
}

defineExpose({validate})

const tip = '<div>脚本中可使用双花括号{{字段键值}}的形式获取表单输入</div><div>软件操作脚本中使用{{依赖标识_属性键值}}形式以获取该依赖类型下所有目标的属性值</div><div>软件建立依赖/解除依赖脚本中使用{{依赖的软件标识_属性键值}}形式以获取依赖目标的属性值</div><div>打印output(key=value)可输出变量</div><div>软件脚本可打印output(serviceState=STARTED/STOPPED/ERROR)返回服务状态</div>'

</script>

<template>
	<div style="margin-top: 20px">
		<span>自定义表单字段</span>
	</div>
	<CustomFormDefinition ref="customFormRef" style="margin-top: 20px" v-model="model.customForm" />
	<div style="margin-top: 20px;margin-bottom: 20px;">
		<ElTooltip
			raw-content
			:content="tip">
			<ElLink>
				编写脚本
				<ElIcon><QuestionFilled /></ElIcon>
			</ElLink>
		</ElTooltip>

	</div>
	<RemoteScriptEditor v-model="model.remoteScript" />
</template>

<style scoped>

</style>
