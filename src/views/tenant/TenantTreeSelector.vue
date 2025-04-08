<script setup>
import { describeTenantsTree } from '@/api/tenant';
import { ElTreeSelect } from 'element-plus';
import { onMounted, ref } from 'vue';

const tenantsTree = ref([])
const tenantId = defineModel()

onMounted(()=>{
    fetchTenantsTree()
})



function fetchTenantsTree(){
    describeTenantsTree({}).then(resp=>{
        tenantsTree.value = convertTreeNodes(resp.roots)
    })
}

function convertTreeNodes(nodes){
    const result = []
    if(!nodes) return result
    for(const node of nodes){
        result.push(convertTreeNode(node))
    }
    return result
}

function convertTreeNode(node){
    return {
        value: node.tenant.id,
        label: node.tenant.name,
        children: convertTreeNodes(node.children)
    }
}

</script>

<template>
    <ElTreeSelect
	    filterable
	    placeholder="请选择租户"
	    style="width: 100%;"
	    default-expand-all
	    v-model="tenantId"
	    :data="tenantsTree"
	    check-strictly />
</template>