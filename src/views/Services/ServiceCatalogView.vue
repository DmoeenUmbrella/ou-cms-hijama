<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServicesStore } from '@/stores/useServicesStore.js'
import { mdiViewList, mdiPlusCircle } from '@mdi/js'
import SectionMain from '@/components/ui/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CardBoxModal from '@/components/ui/CardBoxModal.vue'
import ServiceTable from '@/components/services/ServiceTable.vue'
import ServiceFormModal from '@/components/services/ServiceFormModal.vue' // Imports the form component
import CardBox from '@/components/ui/CardBox.vue'

const { t } = useI18n()
const servicesStore = useServicesStore()

// Modal State
const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const serviceToDelete = ref(null)

// Form Management State
const isEditing = ref(false)
const serviceToEdit = computed(() => servicesStore.formService)

onMounted(() => {
    servicesStore.fetchServices()
})

const modalTitle = computed(() =>
    isEditing.value ? t('service.edit_title') : t('service.add_new_title')
)

// Handlers for Table Events
const handleEditService = (service) => {
    servicesStore.loadServiceForEdit(service)
    isEditing.value = true
    isModalActive.value = true
}

const handleOpenAddModal = () => {
    servicesStore.resetServiceForm()
    isEditing.value = false
    isModalActive.value = true
}

const handleDeleteConfirmation = (service) => {
    serviceToDelete.value = service
    isModalDangerActive.value = true
}

const handleConfirmDelete = () => {
    if (serviceToDelete.value) {
        servicesStore.deleteService(serviceToDelete.value.id)
        isModalDangerActive.value = false
        serviceToDelete.value = null
    }
}

const handleSaveService = async () => {
    let isValid = false;
    if (isEditing.value) {
        isValid = await servicesStore.updateService(serviceToEdit.value);
    } else {
        isValid = await servicesStore.addService(serviceToEdit.value);
    }
    if (isValid) {
        closeModal();
    }
}

const closeModal = () => {
    isModalActive.value = false
}
</script>

<template>
    <LayoutAuthenticated>
        <!-- Add/Edit Service Modal -->
        <CardBoxModal v-model="isModalActive" :title="modalTitle" button="info"
            :button-label="isEditing ? t('button.save') : t('service.add_service_btn')" :has-footer="false"
            :large="true" @confirm="handleSaveService" @cancel="closeModal" hasCancel persist>

            <ServiceFormModal :is-editing="isEditing" />
        </CardBoxModal>

        <!-- Delete Confirmation Modal -->
        <CardBoxModal v-model="isModalDangerActive" :title="t('service.delete_service')" button="danger" has-cancel
            @confirm="handleConfirmDelete">
            <p>
                {{ t('service.delete_service_note') }}
                <span class="font-bold">{{ serviceToDelete?.name }}</span>?
            </p>
        </CardBoxModal>

        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiViewList" :title="t('service.title')" main>
                <BaseButton :label="t('service.add_btn')" color="info" @click="handleOpenAddModal" />
            </SectionTitleLineWithButton>

            <CardBox :title="t('service.all_services')" has-table>
                <ServiceTable @edit="handleEditService" @delete="handleDeleteConfirmation" />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>