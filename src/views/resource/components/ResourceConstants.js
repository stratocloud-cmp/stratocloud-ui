export const ResourceStates = {
    NO_STATE:{
        name: '未创建',
        icon: 'Clock',
        type: 'info'
    },
    BUILD_ERROR:{
        name: '创建失败',
        icon: 'Warning',
        type: 'danger'
    },

    BUILDING:{
        name: '正在创建',
        icon: 'Loading',
        type: 'primary'
    },

    STARTED:{
        name: '已启动',
        icon: 'VideoPlay',
        type: 'success'
    },
    STOPPING:{
        name: '正在停止',
        icon: 'Loading',
        type: 'warning'
    },
    STOPPED:{
        name: '已停止',
        icon: 'SwitchButton',
        type: 'danger'
    },
    STARTING:{
        name: '正在启动',
        icon: 'Loading',
        type: 'primary'
    },
    RESTARTING:{
        name: '正在重启',
        icon: 'Loading',
        type: 'primary'
    },

    CONFIGURING:{
        name: '正在配置',
        icon: 'Loading',
        type: 'primary'
    },

    SHUTDOWN:{
        name: '待销毁',
        icon: 'SwitchButton',
        type: 'danger'
    },
    DESTROYING:{
        name: '正在销毁',
        icon: 'Loading',
        type: 'warning'
    },
    DESTROYED:{
        name: '已销毁',
        icon: 'Delete',
        type: 'danger'
    },

    ERROR:{
        name: '错误',
        icon: 'Warning',
        type: 'danger'
    },

    LOST:{
        name: '遗失',
        icon: 'QuestionFilled',
        type: 'warning'
    },
    UNKNOWN:{
        name: '未知',
        icon: 'QuestionFilled',
        type: 'warning'
    },

    AVAILABLE:{
        name: '可用',
        icon: 'CircleCheck',
        type: 'success'
    },
    UNAVAILABLE:{
        name: '不可用',
        icon: 'CircleClose',
        type: 'warning'
    },
    SOLD_OUT:{
        name: '已售罄',
        icon: 'SoldOut',
        type: 'warning'
    },

    ATTACHING:{
        name: '挂载中',
        icon: 'Loading',
        type: 'primary'
    },
    DETACHING:{
        name: '解除挂载中',
        icon: 'Loading',
        type: 'primary'
    },
    IN_USE:{
        name: '使用中',
        icon: 'Connection',
        type: 'warning'
    },
    IDLE:{
        name: '空闲',
        icon: 'CircleCheck',
        type: 'success'
    },

    HEALTH_CHECK_NORMAL: {
        name: '健康检查正常',
        icon: 'CircleCheck',
        type: 'success'
    },
    HEALTH_CHECK_ABNORMAL: {
        name: '健康检查异常',
        icon: 'Warning',
        type: 'error'
    },
    HEALTH_CHECK_UNAVAILABLE: {
        name: '未健康检查',
        icon: 'QuestionFilled',
        type: 'warning'
    },

    REBUILDING: {
        name: '重建中',
        icon: 'Loading',
        type: 'primary'
    },
    PAUSED: {
        name: '已暂停',
        icon: 'SwitchButton',
        type: 'warning'
    },
    SUSPENDED: {
        name: '已挂起',
        icon: 'SwitchButton',
        type: 'warning'
    },
    SHELVED:{
        name: '已搁置',
        icon: 'SwitchButton',
        type: 'warning'
    },

    INSUFFICIENT_RESOURCE: {
        name: '资源紧张',
        icon: 'Warning',
        type: 'warning'
    }
}


export const ResourceSyncStates = {
    NO_STATE:{
        name: '未同步',
        icon: 'Clock',
        type: 'info'
    },
    OK:{
        name: '正常',
        icon: 'Check',
        type: 'success'
    },

    NOT_FOUND:{
        name: '资源遗失',
        icon: 'Close',
        type: 'warning'
    },

    CONNECTION_ERROR:{
        name: '平台连接异常',
        icon: 'Warning',
        type: 'warning'
    },
}
