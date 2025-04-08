<script setup>
import {computed, ref} from "vue";
import CartItem from '@/views/cart/CartItem.vue'

const popOverVisible = ref(false)

const totalCartItems = computed(()=>cartItemRef.value?.getTotal())

const cartItemRef = ref()


</script>

<template>
	<ElPopover v-model:visible="popOverVisible" placement="bottom-end" :width="800" trigger="click">
		<template #reference>
			<!--suppress JSValidateTypes -->
			<ElBadge :is-dot="totalCartItems > 0" type="warning" :offset="[-10, 10]">
				<ElButton size="large" class="job-button" icon="ShoppingCart" />
			</ElBadge>
		</template>
		<CartItem ref="cartItemRef" />
	</ElPopover>
</template>

<style lang="scss">
.job-button{
	color: white;
	border: 0;
}
.job-button:hover{
	background-color: rgba(7, 0, 112, 0.25);
	color: white;
}
.el-popover.el-popper{
	background: rgba(55, 55, 55, .5);
	backdrop-filter: blur(20px);
}
</style>