<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BillingPeriodList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="billing_period_response">
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic-data'"
                :data="data_information_form"
                ref="basicDataFormRef"
                action="edit"
                @update:data="data_information_form = $event"
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
                  :disabled="!isFormValid"
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
import BasicDataForm from '@/components/Forms/SettlementCommissions/BillingPeriod/BasicDataForm.vue'

// Logic view
import useBillingPeriodEdit from '@/views/settlement-commissions/billing-period/v2/edit/BillingPeriodEdit'

const {
  billing_period_response,
  data_information_form,
  basicDataFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  isFormValid,

  onSubmit,
  goToURL,
} = useBillingPeriodEdit()
</script>
