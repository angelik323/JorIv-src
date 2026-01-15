<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('CommissionsCalculationList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-xl">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="create"
                @update:data="basic_data_form = $event"
              />

              <section class="mb-4">
                <div class="row justify-end q-gutter-md">
                  <Button
                    label="Crear calculos"
                    size="md"
                    no-caps
                    unelevated
                    :outline="false"
                    color="orange"
                    class="btn-filter custom"
                    :disabled="!isValidBasicDataForm"
                    @click="handleCreateCalculation"
                  />
                </div>
              </section>

              <ListCommission
                v-if="tabActive === 'basic-data' && showTableCommissions"
                :data="basic_data_form"
                :commissions="commissions_form"
                ref="listCommissionRef"
                action="create"
                @update:commissions="commissions_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="!isValidBasicDataForm || !showTableCommissions"
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
import BasicData from '@/components/Forms/SettlementCommissions/CommissionCalculation/v2/BasicData/BasicData.vue'
import ListCommission from '@/components/Forms/SettlementCommissions/CommissionCalculation/v2/ListCommissions/ListCommission.vue'

// Logic view
import useCommissionCalculationCreate from '@/views/settlement-commissions/commission-calculation/v2/create/CommissionCalculationCreate'

const {
  basic_data_form,
  basicDataFormRef,
  listCommissionRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  isValidBasicDataForm,
  showTableCommissions,
  commissions_form,

  onSubmit,
  goToURL,
  handleCreateCalculation,
} = useCommissionCalculationCreate()
</script>
