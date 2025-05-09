<script setup>
import { ElMenu, ElMenuItem } from 'element-plus';
import {onMounted, ref, watch} from 'vue';
import { describeResourceCategories } from '@/api/resource'
import { useActiveMenuStore } from '@/stores/activeMenu'
import { useSessionStore } from '@/stores/session'
import {
	definedCloudConfigurationMenus,
	definedOrderMenus,
	definedResourceMenus,
	definedSystemConfigurationMenus
} from '@/layout/menu'
import StratoHeaderJobButton from "@/layout/StratoHeaderJobButton.vue";
import {useRouter} from 'vue-router'
import StratoHeaderUserConfigButton from '@/layout/StratoHeaderUserConfigButton.vue'
import StratoHeaderCartButton from '@/layout/StratoHeaderCartButton.vue'

const defaultActiveMenuIndex = ref('0')

const activeMenuStore = useActiveMenuStore()
const sessionStore = useSessionStore()

const resourceMenuList = ref([])
const orderMenuList = ref([])
const cloudConfigurationMenuList = ref([])
const systemConfigurationMenuList = ref([])

const router = useRouter()

async function initResourceMenuList(){
    await describeResourceCategories({}).then(resp=>{
        const menuList = []
        if(resp.resourceCategories && resp.resourceCategories.length>0){
            for(let category of resp.resourceCategories){
				if(hasPermission(category.categoryId)){
					menuList.push({
						menuName: category.categoryName,
						path: '/resource/list/'+category.categoryId,
						subMenuId: category.groupId,
						subMenuName: category.groupName,
					})
				}
            }
        }

	    for(let menu of definedResourceMenus){
		    if(hasPermission(menu.permissionTarget)){
			    menuList.push(menu)
		    }
	    }

        resourceMenuList.value = menuList
        if(menuList.length>0){
            topMenuItems.value.push(
                {
                    name: '云资源',
                    pathPrefix: '/resource/',
                    handler: resourceMenuHandler,
                    sideMenuList: resourceMenuList.value
                }
            )
        }
    })
}

function hasPermission(target){
	if(!sessionStore.session) return false

	if(sessionStore.session.roleType === 'SUPER_ADMIN' || sessionStore.session.roleType === 'TENANT_SUPER_ADMIN'){
		return true
	}

	return sessionStore.session.permissions[target]?.includes('READ');
}

async function initOrderMenuList(){
    for(let menu of definedOrderMenus){
		if(menu.path === '/order/all-orders' && sessionStore.isNormalUser)
			continue

        if(hasPermission(menu.permissionTarget)){
            orderMenuList.value.push(menu)
        }
    }

    if(orderMenuList.value.length>0){
        topMenuItems.value.push(
            {
                name: '工单与任务',
                pathPrefix: '/order/',
                handler: orderMenuHandler,
                sideMenuList: orderMenuList.value
            }
        )
    }
}

async function initCloudConfigurationMenuList(){
    for(let menu of definedCloudConfigurationMenus){
        if(hasPermission(menu.permissionTarget)){
            cloudConfigurationMenuList.value.push(menu)
        }
    }

    if(cloudConfigurationMenuList.value.length>0){
        topMenuItems.value.push(
            {
                name: '云管理',
                pathPrefix: '/cloud-configuration/',
                handler: cloudConfigurationMenuHandler,
                sideMenuList: cloudConfigurationMenuList.value
            }
        )
    }
}

async function initSystemConfigurationMenuList(){
	for(let menu of definedSystemConfigurationMenus){
		if(hasPermission(menu.permissionTarget)){
			systemConfigurationMenuList.value.push(menu)
		}
	}

	if(systemConfigurationMenuList.value.length>0){
		topMenuItems.value.push(
			{
				name: '系统管理',
				pathPrefix: '/system-configuration/',
				handler: systemConfigurationMenuHandler,
				sideMenuList: systemConfigurationMenuList.value
			}
		)
	}
}

const resourceMenuHandler = () =>{
    activeMenuStore.setCurrentSideMenus(resourceMenuList.value)
    if(resourceMenuList.value.length>0){
        activeMenuStore.setActiveMenu(resourceMenuList.value[0])
        router.push(resourceMenuList.value[0].path)
    }
}

const orderMenuHandler = () =>{
    activeMenuStore.setCurrentSideMenus(orderMenuList.value)
    if(orderMenuList.value.length>0){
        activeMenuStore.setActiveMenu(orderMenuList.value[0])
        router.push(orderMenuList.value[0].path)
    }
}

const cloudConfigurationMenuHandler = () =>{
    activeMenuStore.setCurrentSideMenus(cloudConfigurationMenuList.value)
    if(cloudConfigurationMenuList.value.length>0){
        activeMenuStore.setActiveMenu(cloudConfigurationMenuList.value[0])
        router.push(cloudConfigurationMenuList.value[0].path)
    }
}

const systemConfigurationMenuHandler = () =>{
	activeMenuStore.setCurrentSideMenus(systemConfigurationMenuList.value)
	if(systemConfigurationMenuList.value.length>0){
		activeMenuStore.setActiveMenu(systemConfigurationMenuList.value[0])
		router.push(systemConfigurationMenuList.value[0].path)
	}
}

const topMenuItems = ref([])

function ensureCurrentRoute() {
	const currentPath = router.currentRoute.value.path

	activeMenuStore.setActiveMenu(undefined)

	for(let i=0; i < topMenuItems.value.length; i++){
		const topMenuItem = topMenuItems.value[i]
		for (let sideMenu of topMenuItem.sideMenuList){
			if (currentPath === sideMenu.path) {
				activeMenuStore.setCurrentSideMenus(topMenuItem.sideMenuList)
				activeMenuStore.setActiveMenu(sideMenu)
				defaultActiveMenuIndex.value = i+''
				return true
			}
		}
	}
	console.warn(`Menu of path ${currentPath} not found.`)
	return false
}

watch(router.currentRoute, ()=>{
	ensureCurrentRoute();
})

onMounted(async ()=>{
    await initResourceMenuList()
    await initOrderMenuList()
    await initCloudConfigurationMenuList()
	await initSystemConfigurationMenuList()

	if(!activeMenuStore.activeMenu){
		topMenuItems.value[defaultActiveMenuIndex.value].handler()
		return
	}

    if(activeMenuStore.activeMenu){
		if(!ensureCurrentRoute()){
			for(let i=0;i<topMenuItems.value.length;i++){
				if(activeMenuStore.activeMenu.path.startsWith(topMenuItems.value[i].pathPrefix)){
					activeMenuStore.setCurrentSideMenus(topMenuItems.value[i].sideMenuList)
					defaultActiveMenuIndex.value = i+''
					return
				}
			}
			topMenuItems.value[defaultActiveMenuIndex.value].handler()
		}
    }
})

</script>
<template>
    <div class="strato-header">
        <img style="margin-left: 5px;" src="/svg/StratoCloudSmall.svg" alt="StratoCloud"/>
        <ElMenu :default-active="defaultActiveMenuIndex" style="margin-right: 200px;border: 0;" mode="horizontal" :ellipsis="false">
            <ElMenuItem
                class="strato-menu-item"
                v-for="(item, index) in topMenuItems"
                @click="item.handler"
                :index="index+''"
            >
                {{item.name}}
            </ElMenuItem>
        </ElMenu>
	    <div style="float: right;margin-right: 6px">
		    <ElButtonGroup>
			    <StratoHeaderCartButton />
			    <StratoHeaderJobButton v-if="hasPermission('Job')" />
			    <StratoHeaderUserConfigButton  />
		    </ElButtonGroup>
	    </div>
    </div>
</template>
<!--suppress CssUnusedSymbol -->
<style scoped>
.strato-header{
    height: 100%;
    width: 100%;
	min-width: 100%;
    padding: 2px;
    display: flex;
	justify-content: space-between;
    align-items: center;
}
.strato-menu-item{
    font-size: 18px;
}
.strato-menu-item:hover{
    background-color: rgba(7, 0, 112, 0.25);
}
.is-active{
    background-color: rgba(7, 0, 112, 0.25);
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
    background-color: rgba(7, 0, 112, 0.25);
}
</style>
