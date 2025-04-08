<script setup>
import { ElCascader, ElCascaderPanel } from 'element-plus';
import { onMounted, ref } from 'vue';
import { describePermissions, addPermissions, removePermissions } from '@/api/permission';

const options = ref([])

const props = defineProps({
    roleId: {
        required: true,
        type: String
    },
    permissionIds: {
        required: true,
        type: Array
    }
})

const selectedPermissionIds = ref([])

const newAddedPermissionIds = ref([])

const newRemovedPermissionIds = ref([])

const cascaderProps = { multiple: true }

function fetchPermissions(){
    describePermissions({}).then(resp=>{
        if(resp.permissions && resp.permissions.length>0){
            options.value = []
            for(let p of resp.permissions){
                let targetOption = options.value.find(v=>{return v.value===p.target})
                if(targetOption==undefined){
                    targetOption = {
                        value: p.target,
                        label: p.targetName,
                        children: []
                    }
                    options.value.push(targetOption)
                }
                targetOption.children.push({
                    value: p.id,
                    label: p.actionName,
                    children: []
                })
                if(props.permissionIds.indexOf(p.id)!=-1){
                    selectedPermissionIds.value.push([p.target, p.id])
                }
            }
        }
    })
}

function handlerSelect(values){
    let relatedPermissionIds = [...props.permissionIds, ...newAddedPermissionIds.value]
    relatedPermissionIds = relatedPermissionIds.filter(id=>!newRemovedPermissionIds.value.includes(id))

    let idsToAdd = values.filter(v=>relatedPermissionIds.find(id=>v[1]===id)==undefined).map(v=>v[1])
    let idsToRemove = relatedPermissionIds.filter(id=>values.find(v=>v[1]===id)==undefined)
    if(idsToRemove.length>0){
        removePermissions({
            roleId: props.roleId,
            permissionIds: idsToRemove
        }).then(resp=>{
            for(let id of idsToRemove){
                let index = newAddedPermissionIds.value.indexOf(id)
                if(index!==-1){
                    newAddedPermissionIds.value.splice(index, 1)
                }
                newRemovedPermissionIds.value.push(id)
            }
        })
        return
    }
    if(idsToAdd.length>0){
        addPermissions({
            roleId: props.roleId,
            permissionIds: idsToAdd
        }).then(resp=>{
            for(let id of idsToAdd){
                let index = newRemovedPermissionIds.value.indexOf(id)
                if(index!==-1){
                    newRemovedPermissionIds.value.splice(index, 1)
                }
                newAddedPermissionIds.value.push(id)
            }
        })
        return
    }
}

onMounted(()=>{
    fetchPermissions()
})

</script>

<template>
    <ElCascaderPanel
        size="large"
        v-model="selectedPermissionIds"
        style="width: fit-content;"
        :options="options"
        :props="cascaderProps"
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="15"
        clearable
        @change="handlerSelect"
    />
</template>

<style>
.el-cascader-menu__wrap.el-scrollbar__wrap{
    height: 600px;
}
</style>
