<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetAccountingHomologationParametersList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-show="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                action="create"
              />
              <BudgetDataForm
                v-show="tabActive === 'budget_data'"
                ref="budgetDataFormRef"
                action="create"
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
                  />
                  <Button
                    v-if="tabActive !== 'basic_data'"
                    class="custom"
                    label="Atrás"
                    unelevated
                    outline
                    color="orange"
                    @click="previousTab"
                  />
                  <Button
                    v-if="tabActive === 'budget_data'"
                    class="custom"
                    label="Crear"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="onSubmit"
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
import BasicDataForm from '@/components/Forms/Budget/AccountingBudgetHomologationParameters/BasicData/BasicDataForm.vue'
import BudgetDataForm from '@/components/Forms/Budget/AccountingBudgetHomologationParameters/BudgetData/BudgetDataForm.vue'

// Logic view
import useAccountingBudgetHomologationParametersCreate from '@/views/budget/budget-accounting-homologation-parameters/v1/create/AccountingBudgetHomologationParametersCreate'

const {
  basicDataFormRef,
  budgetDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  nextTab,
  goToURL,
  onSubmit,
  previousTab,
} = useAccountingBudgetHomologationParametersCreate()
</script>
