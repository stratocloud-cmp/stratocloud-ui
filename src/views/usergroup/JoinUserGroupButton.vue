<script setup>
import {ref} from 'vue'
import StratoDrawer from '@/components/StratoDrawer.vue'
import {createJob} from '@/api/job.js'
import {useActiveJobStore} from '@/stores/activeJob.js'
import JoinUserGroupForm from '@/views/usergroup/JoinUserGroupForm.vue'

const activeJobStore = useActiveJobStore()

const drawerFlag = ref(false)

const drawerLoading = ref(false)

function openDrawer(){
	drawerFlag.value = true
}

const formData = ref({})

const formRef = ref()

const emits = defineEmits(['confirm'])

function confirmJoin(){
	formRef.value.validate(valid=>{
		if(!valid) return
		drawerLoading.value = true
		createJob({
			jobType: 'JOIN_USER_GROUP',
			jobParameters: formData.value
		}).then(resp=>{
			drawerFlag.value = false
			activeJobStore.setActiveJobId(resp.jobId)
			emits('confirm')
		}).finally(()=>{
			drawerLoading.value = false
		})
	})
}
</script>

<template>
	<ElButton
		@click="openDrawer"
		type="primary"
		link
	>找不到期望的用户组?&nbsp;点击此处申请加入</ElButton>
	<StratoDrawer v-model="drawerFlag" title="申请加入用户组" @onConfirm="confirmJoin" :loading="drawerLoading">
		<JoinUserGroupForm ref="formRef" v-model="formData" />
	</StratoDrawer>
</template>

<style scoped>

</style>