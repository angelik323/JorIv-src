<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsDefault.title"
      :breadcrumbs="headerPropsDefault.breadcrumbs"
    >
      <section class="q-my-md" aria-label="Sección de creación de formulario">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <!-- Forms -->

              <BasicDataForm
                v-if="isLoaded"
                v-show="tabActive === 'basic_data'"
                ref="basicDataFormRef"
              />

              <OperationDataForm
                v-show="tabActive === 'operation_data'"
                ref="operationDataFormRef"
              />

              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      0
                    "
                    :outline="true"
                    label="Atrás"
                    :leftIcon="defaultIconsLucide.chevronLeft"
                    :color-icon="'#762344'"
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
                    :color-icon="'white'"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="
                      filteredTabs.findIndex(
                        (tab) => tab.name === tabActive
                      ) ===
                      filteredTabs.length - 1
                    "
                    :outline="false"
                    label="Crear"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="handleSubmitForm"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useRegisterCancellationParticipationFicsCreate from './RegisterCancellationParticipationFicsCreate'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/RegisterCancellationParticipationFics/BasicDataForm/BasicDataForm.vue'
import OperationDataForm from '@/components/Forms/InvestmentPortfolio/RegisterCancellationParticipationFics/OperationDataForm/OperationDataForm.vue'

const {
  headerPropsDefault,
  defaultIconsLucide,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  operationDataFormRef,
  isLoaded,
  backTab,
  nextTab,
  handleSubmitForm,
} = useRegisterCancellationParticipationFicsCreate()
</script>
