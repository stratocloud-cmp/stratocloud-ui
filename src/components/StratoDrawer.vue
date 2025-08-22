<script setup>
import StratoButton from '@/components/StratoButton.vue'
import {useDark} from '@vueuse/core'

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

const isDark = useDark()

</script>
<template>
    <ElDrawer :class="isDark ? 'strato-drawer-dark':'strato-drawer-light'" v-model="model">
        <template #header>
            <div :style="{fontSize: '20px',color: isDark ? 'white' : undefined}">
                {{ title }}
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
                <StratoButton :loading="loading" v-if="!noConfirm" type="primary" @click="onConfirm">
	                确定
                </StratoButton>
            </div>
        </template>
    </ElDrawer>
</template>

<style lang="scss">

.strato-drawer-dark{
    background: rgba(55, 55, 55, .5);
    backdrop-filter: blur(20px);
}

.strato-drawer-light{
	background: rgba(250, 250, 250);
}


</style>
