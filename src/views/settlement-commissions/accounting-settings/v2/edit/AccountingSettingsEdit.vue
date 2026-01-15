<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountingSettingsList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="basic_data_form">
          <template #content-card>
            <div class="q-pa-xl">
              <BasicDataForm
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="edit"
                @update:data="basic_data_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/SettlementCommissions/AccountingSettings/v2/BasicDataForm.vue'

// Logic view
import useAccountingSettingsEdit from '@/views/settlement-commissions/accounting-settings/v2/edit/AccountingSettingsEdit'

const {
  basic_data_form,
  basicDataFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,

  onSubmit,
  goToURL,
} = useAccountingSettingsEdit()
</script>
