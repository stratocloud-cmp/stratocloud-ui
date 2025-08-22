<template>
    <template v-if="activeMenuStore.activeMenu">
	    <ElMenu
		    :class="isDark ? 'strato-menu':'strato-menu-light'"
		    router
		    :default-active="activeMenuStore.activeMenu.path"
		    unique-opened
	    >
		    <template v-for="item in menus">
			    <template v-if="item.subMenuId">
				    <ElSubMenu :index="item.subMenuId">
					    <template #title>
						    <ElIcon>
							    <component :is="getSubMenuIcon(item.subMenuName)" />
						    </ElIcon>
						    <span style="font-size: 18px">
							    {{item.subMenuName}}
						    </span>
					    </template>
					    <template v-for="subItem in item.items">
						    <ElMenuItem
							    :class="isDark ? 'strato-menu-item':'strato-menu-item-light'"
							    :index="subItem.path"
							    @click="setActiveMenu(subItem)"
						    >
							    <span>
								    <ElIcon>
									    <component :is="getMenuItemIcon(subItem.menuName)" />
								    </ElIcon>
								    {{subItem.menuName}}
							    </span>
						    </ElMenuItem>
					    </template>
				    </ElSubMenu>
			    </template>
			    <template v-else>
				    <ElMenuItem
					    :class="isDark ? 'strato-menu-item':'strato-menu-item-light'"
					    :index="item.path"
					    @click="setActiveMenu(item)"
				    >
					    <span>
						    <ElIcon>
							    <component :is="getMenuItemIcon(item.menuName)" />
						    </ElIcon>
						    {{item.menuName}}
					    </span>
				    </ElMenuItem>
			    </template>
		    </template>

	    </ElMenu>
    </template>
</template>
<script setup>
import { ElMenu, ElMenuItem } from 'element-plus';
import {computed, onMounted} from 'vue';
import { useActiveMenuStore } from '@/stores/activeMenu'
import {getMenuItemIcon, getSubMenuIcon} from '@/layout/MenuIcon.js'
import {useRouter} from 'vue-router'
import {useDark} from '@vueuse/core'

const router = useRouter()

const activeMenuStore = useActiveMenuStore()

const menus = computed(() => {
	const subMenus = []
	const menusItems = []

	if(activeMenuStore.currentSideMenus){
		for (let m of activeMenuStore.currentSideMenus) {
			if(m.subMenuId && m.subMenuName){
				let subMenu = subMenus.find(s=>s.subMenuId === m.subMenuId)
				if(!subMenu){
					subMenu = {
						subMenuId: m.subMenuId,
						subMenuName: m.subMenuName,
						items: []
					}
					subMenus.push(subMenu)
				}

				subMenu.items.push(m)
			}else {
				menusItems.push(m)
			}
		}
	}

	return [...subMenus, ...menusItems]
})


function setActiveMenu(menuItem){
    activeMenuStore.setActiveMenu(menuItem)
}


onMounted(()=>{
    if(activeMenuStore.activeMenu){
        router.push(activeMenuStore.activeMenu.path)
    }
})

const isDark = useDark()
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.strato-menu{
    height: 100%;
	border: 0;
}
.strato-menu-light{
	height: 100%;
	border: 0;
}
.strato-menu-item{
    font-size: 18px;
}
.strato-menu-item-light{
	font-size: 18px;
}
</style>
