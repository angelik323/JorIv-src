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
              ref="business_data_ref"
              v-show="tabActive === 'businesses'"
              action="edit"
              :data="business_form_data || undefined"
            />
            <TransferAreasForm
              ref="area_data_ref"
              v-show="tabActive === 'areas'"
              action="edit"
              :data="area_form_data || undefined"
              :document-type="
                business_form_data?.budget_document_type_id ?? null
              "
              :one-to-one="Boolean(business_form_data?.one_to_one)"
              :code="business_form_data?.code ?? null"
            />
            <TransferSectorsForm
              ref="sectors_data_ref"
              v-show="tabActive === 'sectors'"
              action="edit"
              :data="sector_form_data || undefined"
              :document-type="
                business_form_data?.budget_document_type_id ?? null
              "
              :one-to-one="Boolean(business_form_data?.one_to_one)"
              :code="business_form_data?.code ?? null"
            />

            <!-- Validate Button -->
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
                  v-if="
                    validateRouter(
                      'Budget',
                      'BudgetTransferParametersList',
                      'edit'
                    )
                  "
                  :outline="false"
                  class-custom="custom"
                  label="Actualizar"
                  size="md"
                  :color="true ? 'orange' : 'grey'"
                  @click="onSubmit"
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
//Components
import TransferBusinessesForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferBusinesses/InformationForm.vue'
import TransferSectorsForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferSectors/InformationForm.vue'
import TransferAreasForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferAreas/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

//Logic View
import useBudgetTransferParametersEdit from '@/views/budget/budget-transfer-parameters/v1/edit/BudgetTransferParametersEdit'

const {
  budget_transfer,
  headerProps,
  tabs,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  business_form_data,
  area_form_data,
  sector_form_data,
  business_data_ref,
  area_data_ref,
  sectors_data_ref,
  validateRouter,
  onSubmit,
  nextTab,
  backTab,
  goBack,
} = useBudgetTransferParametersEdit()
</script>

<style
  lang="scss"
  scoped
  src="@/views/budget/budget-transfer-parameters/v1/edit/BudgetTransferParametersEdit.scss"
></style>
