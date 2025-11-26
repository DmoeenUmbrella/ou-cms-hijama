<script setup>
import { ref, computed, onMounted } from 'vue'
import { mdiTableBorder, mdiPlusCircle } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useCustomersStore } from '@/stores/useCustomersStore'

import SectionMain from '@/components/ui/SectionMain.vue'
import CardBox from '@/components/ui/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CardBoxModal from '@/components/ui/CardBoxModal.vue'
import ClientsTable from '@/components/ui/ClientsTable.vue'
import CustomerForm from '@/components/customers/CustomerForm.vue'
import BaseButtons from '@/components/ui/BaseButtons.vue'
import FormFilePicker from '@/components/ui/FormFilePicker.vue'

const { t } = useI18n()
const customersStore = useCustomersStore()

const isModalActive = ref(false)
const isEditing = computed(() => customersStore.isCustomerFormEditing)
// Title based on edit state
const modalTitle = computed(() =>
    isEditing.value ? t('edit_customer_title') : t('add_new_customer_title')
)

// Determine button label (Create vs Update)
const modalButtonLabel = computed(() =>
    isEditing.value ? t('edit_customer_title') : t('add_customer_btn')
)

const openCreateModal = () => {
    customersStore.resetCustomerForm()
    isModalActive.value = true
}

const closeModal = () => {
    customersStore.resetCustomerForm()
    isModalActive.value = false
}

const handleCustomerModalSave = async () => {
    // Trigger the store action to save (create or update)
    const isValid = await customersStore.saveCustomer()
    if (isValid) {
        closeModal()
    }
}

onMounted(() => {
    customersStore.fetchClients()
})
const handleImport = () => {

}
</script>

<template>
    <LayoutAuthenticated>
        <!-- Create/Edit Customer Modal -->
        <CardBoxModal v-model="isModalActive" :title="modalTitle" :buttonLabel="modalButtonLabel" :large="true"
            has-cancel @confirm="handleCustomerModalSave" @cancel="closeModal" persist>
            <CustomerForm :isEditing="isEditing" />
        </CardBoxModal>

        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiTableBorder" :title="t('customers.title')" main>
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <FormFilePicker :label="t('button.import')" color="danger" />
                    <BaseButton :label="`${t('add_new_customer_title')}`" color="info" @click="openCreateModal" />
                </BaseButtons>
            </SectionTitleLineWithButton>

            <CardBox class="mb-6" has-table>
                <ClientsTable checkable />
            </CardBox>

        </SectionMain>
    </LayoutAuthenticated>
</template>