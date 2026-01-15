<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <AccountingParametersMovementsForm
              v-if="tabActive === 'information'"
              ref="accountingParametersMovementsFormRef"
              :action="'create'"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end">
                <Button
                  label="Crear"
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
import AccountingParametersMovementsForm from '@/components/Forms/Fics/AccountingParameters/AccountingParametersMovements/AccountingParametersMovementsForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useAccountingParametersMovementsCreate from '@/views/fics/accounting-parameters/accounting-parameters-movements/v1/create/AccountingParametersMovementsCreate'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  accountingParametersMovementsFormRef,
} = useAccountingParametersMovementsCreate()
</script>
