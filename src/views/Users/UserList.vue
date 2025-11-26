<script setup>
import { ref, computed, onMounted } from 'vue'
import { mdiAccountGroup, mdiPlusCircle } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/useUsersStore'

import SectionMain from '@/components/ui/SectionMain.vue'
import CardBox from '@/components/ui/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CardBoxModal from '@/components/ui/CardBoxModal.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import UserForm from '@/components/users/UserForm.vue'

const { t } = useI18n()
const usersStore = useUsersStore()

const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const userToDelete = ref(null)

const modalTitle = computed(() =>
    usersStore.isUserFormEditing ? t('users.edit_title') : t('users.add_new_title')
)

const modalButtonLabel = computed(() =>
    usersStore.isUserFormEditing ? t('button.update') : t('button.save')
)

const openCreateModal = () => {
    usersStore.resetUserForm()
    isModalActive.value = true
}

const closeModal = () => {
    usersStore.resetUserForm()
    isModalActive.value = false
}

const handleUserSave = () => {
    const success = usersStore.saveUser()
    if (success) {
        closeModal()
    }
}

const handleEditUser = (user) => {
    usersStore.loadUserForEdit(user)
    isModalActive.value = true
}

const handleDeleteConfirmation = (user) => {
    userToDelete.value = user
    isModalDangerActive.value = true
}

const handleConfirmDelete = () => {
    if (userToDelete.value) {
        usersStore.deleteUser(userToDelete.value.id)
        isModalDangerActive.value = false
        userToDelete.value = null
    }
}

onMounted(() => {
    usersStore.fetchUsers()
})
</script>

<template>
    <LayoutAuthenticated>
        <!-- Create/Edit User Modal -->
        <CardBoxModal v-model="isModalActive" :title="modalTitle" :buttonLabel="modalButtonLabel" :large="true"
            has-cancel @confirm="handleUserSave" @cancel="closeModal" persist>
            <UserForm />
        </CardBoxModal>

        <!-- Delete Confirmation -->
        <CardBoxModal v-model="isModalDangerActive" :title="t('button.delete')" button="danger" has-cancel
            @confirm="handleConfirmDelete">
            <p>
                {{ t('users.delete_user_note') }}
                <span class="font-bold">{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</span>?
            </p>
        </CardBoxModal>

        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiAccountGroup" :title="t('users.title')" main>
                <BaseButton :label="t('users.add_btn')" color="success" :icon="mdiPlusCircle"
                    @click="openCreateModal" />
            </SectionTitleLineWithButton>

            <CardBox class="mb-6" has-table>
                <UsersTable @edit="handleEditUser" @delete="handleDeleteConfirmation" />
            </CardBox>

        </SectionMain>
    </LayoutAuthenticated>
</template>