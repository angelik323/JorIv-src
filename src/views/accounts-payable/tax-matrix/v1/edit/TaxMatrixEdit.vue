<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <TaxMatrixForm
              v-show="tabActive === 'rft'"
              ref="taxMatrixFormRFTRef"
              action="edit"
              :data="getCurrentTabData"
              taxType="RFT"
            />

            <TaxMatrixForm
              v-show="tabActive === 'riv'"
              ref="taxMatrixFormRIVRef"
              action="edit"
              :data="getCurrentTabData"
              taxType="RIV"
            />

            <TaxMatrixForm
              v-show="tabActive === 'ric'"
              ref="taxMatrixFormRICRef"
              action="edit"
              :data="getCurrentTabData"
              taxType="RIC"
            />

            <TaxMatrixForm
              v-show="tabActive === 'rte'"
              ref="taxMatrixFormRTERef"
              action="edit"
              :data="getCurrentTabData"
              taxType="RTE"
            />

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  :outline="true"
                  label="Atrás"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  :colorIcon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  :colorIcon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  :outline="false"
                  label="Actualizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmit"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TaxMatrixForm from '@/components/Forms/AccountsPayable/TaxMatrix/TaxMatrixForm.vue'

// Logic
import useTaxMatrixEdit from '@/views/accounts-payable/tax-matrix/v1/edit/TaxMatrixEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  getCurrentTabData,
  taxMatrixFormRFTRef,
  taxMatrixFormRIVRef,
  taxMatrixFormRICRef,
  taxMatrixFormRTERef,
  defaultIconsLucide,
  nextTab,
  backTab,
  handleSubmit,
  handleGoToList,
} = useTaxMatrixEdit()
</script>
