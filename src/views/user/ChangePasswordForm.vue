<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus';
import { onMounted, ref } from 'vue';

const formData = defineModel({})

const formRef = ref()

defineExpose({validate})
function validate(callback) {
    formRef.value.validate(callback)
}

const rules = ref({
	password: [{required: true, message: '请输入密码'}]
})


onMounted(()=>{
    
})

</script>

<template>
    <ElForm ref="formRef" :model="formData" label-position="top" :rules="rules">
	    <ElFormItem label="新密码" prop="newPassword">
		    <ElInput
			    autocomplete="new-password"
			    type="password"
			    show-password
			    v-model="formData.newPassword"
			    placeholder="请输入新密码"
		    />
	    </ElFormItem>
    </ElForm>
</template>