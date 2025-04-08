<script setup>
import { ElPagination } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import {cloneDeep, debounce, isEqual} from 'lodash'

const loading = ref(false)

const model = defineModel()

const props = defineProps({
    remoteMethod:{
		required: true
    },
    pagingRequest:{
        default: {},
        required: false
    },
    defaultPageSize: {
        default: 5,
        required: false
    },
	labelGetter: {
		required: true,
		type: Function
	},
	valueGetter: {
		required: false,
		type: Function,
		default: item=>item.id
	},
	searchAttribute: {
		required: false,
		default: 'search'
	},
	disabled: {
		required: false,
		default: false
	},
	sortedBy: {
		required: false,
		default: undefined
	},
	direction: {
		required: false,
		default: undefined
	},
	disabledOptionFlagGetter: {
		required: false,
		type: Function,
		default: ()=>false
	},
	placeholder: {
		required: false,
	},
	multiple: {
		required: false,
		default: false,
		type: Boolean
	},
	idFilterKey: {
		required: false,
		default: undefined,
		type: String
	},
	multipleLimit: {
		required: false,
		default: undefined,
		type: Number
	},
	allowCreate: {
		required: false,
		default: false,
		type: Boolean
	},
	teleported: {
		required: false,
		default: false,
		type: Boolean
	}
})

function getDefaultPageSize(){
	if(!props.multiple){
		return props.defaultPageSize
	}

	if(model.value instanceof Array){
		const len = model.value.length

		if(len<=props.defaultPageSize) return props.defaultPageSize

		if(len<=5) return 5
		else if(len<=10) return 10
		else if(len<=20) return 20
		else if(len<=50) return 50
		else return 100
	}

	return props.defaultPageSize
}

const pagination = ref({
    current: 1,
    size: getDefaultPageSize(),
    total: 0,
    sortedBy: props.sortedBy,
    direction: props.direction
})

const listData = ref([])

const searchAttributes = ref({})

function fetchData(){
    const req = {
        current: pagination.value.current-1,
        size: pagination.value.size,
        sortedBy: pagination.value.sortedBy,
        direction: pagination.value.direction,
        ...props.pagingRequest,
	    ...searchAttributes.value
    }

	if(props.idFilterKey){
		if(props.multiple){
			if(firstFetch.value){
				req[props.idFilterKey] = model.value
			} else {
				req[props.idFilterKey] = undefined
			}
		} else {
			if(firstFetch.value && model.value){
				req[props.idFilterKey] = [model.value]
			} else {
				req[props.idFilterKey] = undefined
			}
		}
	}

    return props.remoteMethod(req).then(resp=>{
        pagination.value.total = parseInt(resp.totalElements)
        listData.value = resp.content

		if(firstFetch.value){
			onSelectChange(model.value)
		}


        loading.value = false
    }).catch(err=>{
        console.error(err)
        loading.value = false
    }).finally(()=>{
		firstFetch.value = false
    })
}

const debouncedFetchData = debounce(fetchData, 200)

const firstFetch = ref(false)

onMounted(()=>{
    loading.value = true
	firstFetch.value = true
    debouncedFetchData()
})


const oldPagingRequest = ref()
watch(()=>props.pagingRequest, ()=>{
	if(isEqual(oldPagingRequest.value, props.pagingRequest)){
		return
	}

	oldPagingRequest.value = cloneDeep(props.pagingRequest)

    loading.value = true
    debouncedFetchData()
},{deep: true})

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

function onFilter(value){
	searchAttributes.value[props.searchAttribute] = value
	loading.value = true
	debouncedFetchData()
}

const emits = defineEmits(['change'])

function getItemByOptionValue(value){
	for(let item of listData.value){
		if(props.valueGetter(item) === value){
			return item
		}
	}
	return undefined
}

function onSelectChange(value){
	if(value){
		emits('change',getItemByOptionValue(value))
	}else {
		emits('change',undefined)
	}
}



</script>

<template>
	<ElSelect
		:disabled="props.disabled"
		:loading="loading"
		v-model="model"
		filterable
		:filter-method="onFilter"
		@change="onSelectChange"
		:placeholder="placeholder"
		:multiple="multiple"
		:multiple-limit="multipleLimit"
		:allow-create="allowCreate"
		:teleported="teleported"
		clearable
	>
		<template #header v-if="$slots.header">
			<slot name="header"></slot>
		</template>
		<ElOption
			v-for="item in listData"
			:key="props.valueGetter(item)"
			:label="props.labelGetter(item)"
			:value="props.valueGetter(item)"
			:disabled="props.disabledOptionFlagGetter(item)"
		>
			<slot :row="item"></slot>
		</ElOption>
		<template #footer>
			<ElPagination
				style="width: 100%; display: flex; justify-content: right"
				v-model:current-page="pagination.current"
				:total="pagination.total"
				v-model:page-size="pagination.size"
				@size-change="()=>{}"
				:pager-count="11"
				size="small"
				layout="prev, pager, next, total" />
		</template>
	</ElSelect>
</template>
