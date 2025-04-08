import CreateUserGroupForm from '@/views/usergroup/CreateUserGroupForm.vue'
import InviteUserForm from '@/views/usergroup/InviteUserForm.vue'
import JoinUserGroupForm from '@/views/usergroup/JoinUserGroupForm.vue'
import RemoveUsersFromGroupForm from '@/views/usergroup/RemoveUsersFromGroupForm.vue'
import UpdateUserGroupForm from '@/views/usergroup/UpdateUserGroupForm.vue'
import SynchronizeAccountsForm from '@/views/account/SynchronizeAccountsForm.vue'
import ChangeEssentialTargetForm from '@/views/resource/forms/relationship/ChangeEssentialTargetForm.vue'
import ConnectResourcesForm from '@/views/resource/forms/relationship/ConnectResourcesForm.vue'
import CreateResourceForm from '@/views/resource/forms/create/CreateResourceForm.vue'
import RecycleResourcesForm from '@/views/resource/forms/recycle/RecycleResourcesForm.vue'
import RunResourcesActionForm from '@/views/resource/forms/action/RunResourcesActionForm.vue'
import DisconnectResourcesForm from '@/views/resource/forms/relationship/DisconnectResourcesForm.vue'
import RestoreResourcesForm from '@/views/resource/forms/recycle/RestoreResourcesForm.vue'
import SynchronizeResourcesForm from '@/views/resource/forms/action/SynchronizeResourcesForm.vue'
import {defineComponent, h, ref} from 'vue'
import BatchFormWrapper from '@/views/order/BatchFormWrapper.vue'
import TransferResourcesForm from '@/views/resource/forms/ownership/TransferResourcesForm.vue'
import FormDataPathWrapper from '@/views/order/FormDataPathWrapper.vue'
import ClaimResourcesForm from '@/views/resource/forms/ownership/ClaimResourcesForm.vue'
import CreateStacksForm from '@/views/stack/actions/CreateStacksForm.vue'
import RecycleStacksForm from '@/views/stack/actions/RecycleStacksForm.vue'
import TransferStacksForm from '@/views/stack/actions/TransferStacksForm.vue'
import DeleteUserGroupsForm from '@/views/usergroup/DeleteUserGroupsForm.vue'

export function isOrderStatusEditable(orderStatus) {
    const allowedStatuses = [
        'AWAIT_SUBMIT', 'REJECTED', 'PROCESS_ROLLED_BACK', 'AWAIT_APPROVAL', 'AWAIT_CONFIRM'
    ]
    return allowedStatuses.includes(orderStatus)
}

export function getJobFormDefaultData(jobType){
    switch (jobType){
        case 'BATCH_CHANGE_ESSENTIAL_REQUIREMENTS':
            return {changes: []}
        case 'BATCH_CONNECT_RESOURCES':
            return {connections: []}
        case 'BATCH_CREATE_RESOURCES':
            return {resources: []}
        case 'BATCH_RECYCLE_RESOURCES':
            return {resources: []}
        case 'BATCH_RUN_RESOURCE_ACTIONS':
            return {actions: []}
        case 'TRANSFER_RESOURCES':
            return {transfers: []}
        case 'CLAIM_RESOURCES':
            return {claims: []}
        default:
            return {}
    }
}

export function getJobFormComponentByJobType(jobType, orderStatus) {
    switch (jobType) {
        case 'CREATE_USER_GROUP': return CreateUserGroupForm
        case 'INVITE_USERS_TO_GROUP': return InviteUserForm
        case 'JOIN_USER_GROUP': return JoinUserGroupForm
        case 'REMOVE_USERS_FROM_GROUP': return RemoveUsersFromGroupForm
        case 'UPDATE_USER_GROUP': return UpdateUserGroupForm
        case 'DELETE_USER_GROUPS': return DeleteUserGroupsForm

        case 'SYNCHRONIZE_ACCOUNTS': return SynchronizeAccountsForm

        case 'BATCH_CHANGE_ESSENTIAL_REQUIREMENTS':
            return wrapBatchForm(ChangeEssentialTargetForm, orderStatus, 'changes', '变更')
        case 'BATCH_CONNECT_RESOURCES':
            return wrapBatchForm(ConnectResourcesForm, orderStatus, 'connections', '资源关系')
        case 'BATCH_DISCONNECT_RESOURCES':
            return DisconnectResourcesForm
        case 'BATCH_CREATE_RESOURCES':
            return wrapBatchForm(CreateResourceForm, orderStatus, 'resources', '资源')
        case 'BATCH_RECYCLE_RESOURCES':
            return wrapFormDataPath(RecycleResourcesForm, 'resources')
        case 'BATCH_RESTORE_RESOURCES':
            return RestoreResourcesForm
        case 'BATCH_RUN_RESOURCE_ACTIONS':
            return wrapFormDataPath(RunResourcesActionForm, 'actions')

        case 'SYNCHRONIZE_RESOURCES':
            return SynchronizeResourcesForm

        case 'TRANSFER_RESOURCES':
            return wrapFormDataPath(TransferResourcesForm, 'transfers')

        case 'CLAIM_RESOURCES':
            return wrapFormDataPath(ClaimResourcesForm, 'claims')

        case 'CREATE_RESOURCE_STACKS':
            return CreateStacksForm

        case 'RECYCLE_RESOURCE_STACKS':
            return RecycleStacksForm

        case 'TRANSFER_STACKS':
            return TransferStacksForm

    }
}

function wrapBatchForm(form, orderStatus, itemsPath, cardTitle){
    const editable = isOrderStatusEditable(orderStatus)
    const formWrapperRef = ref()
    return defineComponent({
        setup(){
            return () => h(BatchFormWrapper, {
                formComponent: form,
                itemsPath: itemsPath,
                cardTitle: cardTitle,
                enableEdit: editable,
                ref: formWrapperRef,
            })
        },
        expose: ['validate'],
        methods: {
            validate(callback){
                formWrapperRef.value.validate(callback)
            }
        }
    })
}

function wrapFormDataPath(form, formDataPath){
    const formWrapperRef = ref()
    return defineComponent({
        setup(){
            return () => h(FormDataPathWrapper, {
                formComponent: form,
                formDataPath: formDataPath,
                ref: formWrapperRef,
            })
        },
        expose: ['validate'],
        methods: {
            validate(callback){
                formWrapperRef.value.validate(callback)
            }
        }
    })
}
