import {defineComponent, h} from 'vue'

export function getMenuItemIcon(menuName) {
    switch (menuName) {
        case '云主机':
            return 'Cpu'
        case '云硬盘':
            return resolveSvgIcon('Disk')
        case '磁盘类型':
            return resolveSvgIcon('Disk')
        case '云硬盘快照':
            return resolveSvgIcon('Disk')
        case '弹性网卡':
            return resolveSvgIcon('LocalIp')
        case '可用区':
            return 'Grid'
        case '集群':
            return 'Grid'
        case '宿主机':
            return 'Cpu'
        case '数据存储':
            return resolveSvgIcon('Disk')
        case '密钥对':
            return resolveSvgIcon('ApiKey')
        case '私有网络':
            return resolveSvgIcon('Vpc')
        case '子网':
            return resolveSvgIcon('LocalIp')
        case '弹性IP':
            return resolveSvgIcon('FloatingIp')
        case '带宽包':
            return resolveSvgIcon('FloatingIp')
        case '云主机规格':
            return 'Cpu'
        case '镜像':
            return 'CopyDocument'
        case '安全组':
            return resolveSvgIcon('Security')
        case '入站规则':
            return resolveSvgIcon('Security')
        case '出站规则':
            return resolveSvgIcon('Security')
        case '云账号':
            return resolveSvgIcon('ApiKey')
        case '租户管理':
            return 'House'
        case '用户管理':
            return 'User'
        case '角色管理':
            return 'UserFilled'
        case '用户组管理':
            return 'Avatar'
        case '我的工单':
            return 'User'
        case '待办工单':
            return 'Bell'
        case '已办工单':
            return 'MuteNotification'
        case '所有工单':
            return 'Document'
        case '任务':
            return 'List'
        case '任务类型':
            return 'List'
        case '定时任务':
            return 'AlarmClock'
        case '标签管理':
            return 'CollectionTag'
        case 'IP池':
            return resolveSvgIcon('LocalIp')
        case '流程管理':
            return resolveSvgIcon('Scheduler')
        case '资源栈蓝图':
            return 'Menu'
        case '资源栈':
            return 'Menu'
        case '负载均衡实例':
            return resolveSvgIcon('Vpc')
        case '监听器':
            return resolveSvgIcon('Vpc')
        case '后端服务':
            return resolveSvgIcon('LocalIp')
        case '后端服务器组':
            return resolveSvgIcon('LocalIp')
        case '转发规则':
            return resolveSvgIcon('LocalIp')
        case '服务器SSL证书':
            return resolveSvgIcon('ApiKey')
        case 'ACL':
            return resolveSvgIcon('LocalIp')
        case '健康检查器':
            return resolveSvgIcon('LocalIp')
        case 'LB可用区':
            return 'Grid'
        case 'LB规格':
            return resolveSvgIcon('Vpc')
        case '脚本库':
            return 'Tickets'
        case '软件库':
            return 'Box'
        case '非云主机':
            return 'Monitor'
        case '软件':
            return 'Box'
        case '初始化脚本':
            return 'Tickets'
        case '审计日志':
            return 'VideoCamera'
        case '通知方式':
            return 'MessageBox'
        case '通知策略':
            return 'MessageBox'
        case '通知记录':
            return 'Message'
    }

    return 'MostlyCloudy'
}



export function getSubMenuIcon(subMenuName) {
    switch (subMenuName) {
        case '云主机相关':
            return 'Cpu'
        case '存储':
            return 'Coin'
        case '网络':
            return resolveSvgIcon('Internet')
        case '负载均衡':
            return resolveSvgIcon('Vpc')
        case '其他':
            return 'Expand'
        case '运维自动化':
            return 'CoffeeCup'
    }

    return 'MostlyCloudy'
}

function resolveSvgIcon(name){
    return  defineComponent({
        setup(){
            return () => h(
                'img',{
                    src: `/svg/${name}.svg`
                }
            )
        }
    })
}

