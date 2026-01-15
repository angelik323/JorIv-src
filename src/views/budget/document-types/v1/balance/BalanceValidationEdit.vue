<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetDocumentTypesList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-show="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                action="edit"
                :data="documentTypeData"
                :readonly="true"
                @update:balance_validation="hasBalanceValidation = $event"
              />
              <SingleBalanceValidationForm
                v-show="tabActive === 'balance_validation'"
                ref="balanceValidationFormRef"
                action="edit"
                :data="balanceValidationData"
              />

              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="tabActive === 'basic_data'"
                    class="custom"
                    label="Continuar"
                    unelevated
                    outline
                    color="orange"
                    @click="nextTab"
                    :disabled="!hasBalanceValidation"
                  />
                  <Button
                    v-if="tabActive !== 'basic_data'"
                    class="custom"
                    label="Atrás"
                    unelevated
                    outline
                    color="orange"
                    @click="previousTab"
                    :disabled="!hasBalanceValidation"
                  />
                  <Button
                    class="custom"
                    label="Actualizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="onSubmit"
                    :disabled="
                      hasBalanceValidation && tabActive === 'basic_data'
                    "
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import BasicDataForm from '@/components/Forms/Budget/DocumentTypes/BasicData/BasicDataForm.vue'
import SingleBalanceValidationForm from '@/components/Forms/Budget/DocumentTypes/SingleBalanceValidation/SingleBalanceValidationForm.vue'

// Logic view
import useBalanceValidationEdit from '@/views/budget/document-types/v1/balance/BalanceValidationEdit'

const {
  basicDataFormRef,
  balanceValidationFormRef,
  balanceValidationData,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  hasBalanceValidation,
  documentTypeData,
  goToURL,
  nextTab,
  onSubmit,
  previousTab,
} = useBalanceValidationEdit()
</script>
