<script setup>
import {onMounted, ref, watch} from 'vue';
import {cloneDeep, debounce, isEqual} from 'lodash';

const loading = ref(false)

const model = defineModel()

const props = defineProps({
    remoteMethod:{
		required: true
    },
    request:{
        default: {},
        required: true
    },
	labelGetter: {
		required: true,
		type: Function
	},
	valueGetter: {
		required: true,
		type: Function,
	},
	listGetter:{
		required: true,
		type: Function,
	},
	disabled: {
		required: false,
		default: false
	},
	disabledOptionPredicate: {
		required: false,
		type: Function,
		default: ()=>false,
	},
	placeholder: {
		required: false,
	},
	multiple: {
		required: false,
		type: Boolean,
		default: false
	},
	teleported: {
		required: false,
		default: false,
		type: Boolean
	}
})

const response = ref()

const listData = ref([])

const firstFetch = ref(false)

function fetchData(){
    return props.remoteMethod(props.request).then(resp=>{
		response.value = resp
        listData.value = props.listGetter(resp)

	    if(model.value){
		    onSelectChange(model.value)
	    }

	    if(listData.value && listData.value.length === 1 && !model.value){
		    const defaultValue = props.valueGetter(listData.value[0])
		    model.value = defaultValue
		    onSelectChange(defaultValue)
	    }


        loading.value = false
    }).catch(err=>{
        console.error(err)
    }).finally(()=>{
	    loading.value = false
	    firstFetch.value = false
    })
}

const debouncedFetchData = debounce(fetchData, 200)

const oldRequest = ref()

watch(()=>props.request, ()=>{
	if(isEqual(oldRequest.value, props.request)) return

	oldRequest.value = cloneDeep(props.request)

    loading.value = true
    debouncedFetchData()
},{deep: true})

onMounted(()=>{
	loading.value = true
	firstFetch.value = true
	debouncedFetchData()
})


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
		@change="onSelectChange"
		:placeholder="placeholder"
		:multiple="multiple"
		:teleported="teleported"
		clearable>
		<template #header v-if="$slots.header">
			<slot name="header"></slot>
		</template>
		<ElOption
			v-for="item in listData"
			:disabled="disabledOptionPredicate(item, response)"
			:key="props.valueGetter(item)"
			:label="props.labelGetter(item)"
			:value="props.valueGetter(item)">
			<slot :row="item"></slot>
		</ElOption>
	</ElSelect>
</template>