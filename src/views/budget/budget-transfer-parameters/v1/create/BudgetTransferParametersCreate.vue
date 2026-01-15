<template>
  <section class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goBack"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard class="movements-table">
          <template #content-card>
            <TransferBusinessesForm
              ref="business_data_ref"
              v-show="tabActive === 'businesses'"
              action="create"
              @documentType="handleDocumentType"
            />
            <TransferAreasForm
              ref="area_data_ref"
              v-show="tabActive === 'areas'"
              action="create"
              :documentType="documentType"
            />
            <TransferSectorsForm
              ref="sectors_data_ref"
              v-show="tabActive === 'sectors'"
              action="create"
              :documentType="documentType"
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
                      'create'
                    )
                  "
                  :outline="false"
                  class-custom="custom"
                  label="Crear"
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

//Logic view
import useBudgetTransferParametersCreate from '@/views/budget/budget-transfer-parameters/v1/create/BudgetTransferParametersCreate'

const {
  headerProps,
  tabs,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  business_data_ref,
  area_data_ref,
  sectors_data_ref,
  documentType,
  handleDocumentType,
  validateRouter,
  onSubmit,
  nextTab,
  backTab,
  goBack,
} = useBudgetTransferParametersCreate()
</script>

<style
  lang="scss"
  scoped
  src="@/views/budget/budget-transfer-parameters/v1/create/BudgetTransferParametersCreate.scss"
></style>
