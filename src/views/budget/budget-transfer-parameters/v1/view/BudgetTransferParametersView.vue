<template>
  <section class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goBack()"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard v-if="budget_transfer" class="movements-table">
          <template #content-card>
            <TransferBusinessesForm
              v-show="tabActive === 'businesses'"
              action="view"
              :data="business_form_data || undefined"
            />

            <TransferAreasForm
              v-show="tabActive === 'areas'"
              action="view"
              :data="area_form_data || undefined"
              :document-type="
                business_form_data?.budget_document_type_id ?? null
              "
              :one-to-one="Boolean(business_form_data?.one_to_one)"
              :code="business_form_data?.code ?? null"
            />

            <TransferSectorsForm
              v-show="tabActive === 'sectors'"
              action="view"
              :data="sector_form_data || undefined"
              :document-type="
                business_form_data?.budget_document_type_id ?? null
              "
              :one-to-one="Boolean(business_form_data?.one_to_one)"
              :code="business_form_data?.code ?? null"
            />
            <section class="q-mx-lg q-mb-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="tabActiveIdx > 0"
                  label="Atrás"
                  :left-icon="defaultIconsLucide.back"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />
                <Button
                  v-if="tabActiveIdx < tabs.length - 1"
                  label="Continuar"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  outline
                  :color="true ? 'orange' : 'grey'"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />
                <Button
                  :outline="false"
                  class-custom="custom"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goBack"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </section>
</template>

<script lang="ts" setup>
//Core
import TransferBusinessesForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferBusinesses/InformationForm.vue'
import TransferSectorsForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferSectors/InformationForm.vue'
import TransferAreasForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferAreas/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
//Logic View
import useBudgetTransferParametersView from '@/views/budget/budget-transfer-parameters/v1/view/BudgetTransferParametersView'

const {
  budget_transfer,
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  business_form_data,
  area_form_data,
  sector_form_data,
  defaultIconsLucide,
  tabs,
  backTab,
  nextTab,
  goBack,
} = useBudgetTransferParametersView()
</script>

<style
  lang="scss"
  scoped
  src="@/views/budget/budget-transfer-parameters/v1/view/BudgetTransferParametersView.scss"
></style>
