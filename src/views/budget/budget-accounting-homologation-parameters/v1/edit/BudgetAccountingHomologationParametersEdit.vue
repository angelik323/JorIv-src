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
                :data="parameterData"
                action="edit"
              />

              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Actualizar"
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
import BasicDataForm from '@/components/Forms/Budget/BudgetAccountingHomologationParameters/BasicData/BasicDataForm.vue'

// Logic view
import useBudgetAccountingHomologationParametersEdit from '@/views/budget/budget-accounting-homologation-parameters/v1/edit/BudgetAccountingHomologationParametersEdit'

const {
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  parameterData,
  goToURL,
  onSubmit,
} = useBudgetAccountingHomologationParametersEdit()
</script>
