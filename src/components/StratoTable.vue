<script setup>
import { ElPagination, ElTable } from 'element-plus';
import {onMounted, onUnmounted, ref, watch} from 'vue';
import { debounce } from 'lodash'

const loading = ref(false)

const props = defineProps({
    showSelection: {
        default: true,
        required: false
    },
    remoteMethod:{},
    pagingRequest:{
        default: {},
        required: false
    },
    defaultPageSize: {
        default: 10,
        required: false
    },
	maxHeight:{
		default: '550',
		required: false
	},
	size:{
		default: undefined,
		required: false
	},
	rowKeyGetter: {
		required: false,
		type: Function,
		default: item=>item.id
	},
	sortedBy: {
		required: false,
		default: undefined
	},
	direction: {
		required: false,
		default: undefined
	},
})

const pagination = ref({
    current: 1,
    size: props.defaultPageSize,
    total: 0,
	sortedBy: props.sortedBy,
	direction: props.direction
})

const listData = ref([])

const emit = defineEmits(['selectionChange', 'filterChange', 'listChange'])

defineExpose({fetchData, getTotal})

function onSelectionChange(selectedRows){
    emit('selectionChange', selectedRows)
}

function onFilterChange(newFilters){
    emit('filterChange', newFilters)
}

function onSortChange(change){
    if(change.order==='descending'){
        pagination.value.sortedBy = change.prop
        pagination.value.direction = 'DESC'
    }else if(change.order==='ascending'){
        pagination.value.sortedBy = change.prop
        pagination.value.direction = 'ASC'
    }else{
        pagination.value.sortedBy = props.sortedBy
        pagination.value.direction = props.direction
    }
}

function getTotal(){
	return pagination.value.total
}

function fetchDataQuietly() {
	const req = {
		current: pagination.value.current - 1,
		size: pagination.value.size,
		sortedBy: pagination.value.sortedBy,
		direction: pagination.value.direction,
		...props.pagingRequest
	}

	return props.remoteMethod(req).then(resp => {
		pagination.value.total = parseInt(resp.totalElements)
		listData.value = resp.content
		emit('listChange', listData.value)
	}).finally(()=>{
		loading.value = false
	})
}

const tableRef = ref()

function fetchData(){
	return fetchDataQuietly().finally(()=>{
		tableRef.value?.clearSelection()
	})
}

const debouncedFetchData = debounce(fetchData, 200)

const fetchDataIntervalId = ref()

onMounted(()=>{
    loading.value = true
    debouncedFetchData()

	fetchDataIntervalId.value = setInterval(fetchDataQuietly, 10000)
})

onUnmounted(()=>{
	clearInterval(fetchDataIntervalId.value)
})

watch(props.pagingRequest, ()=>{
    loading.value = true
    debouncedFetchData()
})

watch(
    [
        ()=>pagination.value.size, 
        ()=>pagination.value.current,
        ()=>pagination.value.sortedBy,
        ()=>pagination.value.direction,
    ],
    ()=>{
        loading.value = true
        debouncedFetchData()
    }
)

</script>

<template>
	<ElTable
		ref="tableRef"
		v-loading="loading"
		:data="listData"
		:size="props.size"
		@selection-change="onSelectionChange"
		:row-key="rowKeyGetter"
		@filter-change="onFilterChange"
		@sort-change="onSortChange"
		:max-height="props.maxHeight"
		show-overflow-tooltip
		:tooltip-options="{placement: 'bottom', enterable: true}"
		style="min-height: 100px"
	>
		<slot></slot>
	</ElTable>
    <ElPagination
        :page-sizes="[10,20,50,100]"
        style="width: 100%; margin-top: 10px; display: flex; justify-content: right"
        v-model:current-page="pagination.current"
        :total="pagination.total"
        v-model:page-size="pagination.size"
        @size-change="()=>{}"
        :pager-count="11"
        :size="props.size"
        :layout="props.size==='small'?'prev, pager, next, total':'prev, pager, next, total, jumper, sizes'"
    />
</template>