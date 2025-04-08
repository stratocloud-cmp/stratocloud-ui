<script setup>
import StratoButton from '@/components/StratoButton.vue'

const props = defineProps(
    {
        'title':{}, 
        'noConfirm': {
            default: false,
            required: false,
            type: Boolean
        },
	    loading: {
			required: false,
		    default: false,
		    type: Boolean
	    },
	    customFooter: {
		    required: false,
		    default: false,
		    type: Boolean
	    }
    }
)

const model = defineModel()

const emit = defineEmits(['onClose', 'onConfirm'])



function onClose(){
    model.value = false
    emit('onClose')
}

function onConfirm(){
    emit('onConfirm')
}

</script>
<template>
    <ElDrawer v-model="model">
        <template #header>
            <div style="font-size: 20px; color: white;">
                {{ props.title }}
            </div>
        </template>
        <template #default>
            <slot></slot>
        </template>
	    <template v-if="customFooter" #footer>
		    <slot name="footer"></slot>
	    </template>
        <template v-else #footer>
            <div style="flex: auto">
	            <div style="float: left">
		            <slot name="footer" />
	            </div>

                <StratoButton @click="onClose">
	                关闭
                </StratoButton>
                <StratoButton :loading="loading" v-if="!props.noConfirm" type="primary" @click="onConfirm">
	                确定
                </StratoButton>
            </div>
        </template>
    </ElDrawer>
</template>

<style lang="scss">

.el-drawer{
    background: rgba(55, 55, 55, .5);
    backdrop-filter: blur(20px);
}


</style>