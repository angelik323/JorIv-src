<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('FiscalChargeManagementList')"
    ></ContentComponent>
    <section class="q-my-md">
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'information'"
            action="edit"
            ref="basicDataFormRef"
            :data="basic_data_form"
            @update:data="basic_data_form = $event"
          />

          <section class="mx-2 mb-2">
            <q-separator></q-separator>
            <div class="row justify-end">
              <Button
                label="Actualizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom mt-2"
                @click="handleEdit"
              />
            </div>
          </section>
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
//Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/FiscalChargeManagement/BasicDataForm.vue'

//Logic
import useFiscalChargeManagementEdit from '@/views/accounts-payable/fiscal-charge-management/v1/edit/FiscalChargeManagementEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basic_data_form,
  handleEdit,
  goToURL,
} = useFiscalChargeManagementEdit()
</script>
