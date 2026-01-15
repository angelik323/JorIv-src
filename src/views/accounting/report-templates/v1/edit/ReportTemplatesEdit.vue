<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md" aria-label="Sección de edición de formulario">
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
              <InformationForm
                v-if="isLoaded"
                ref="informationFormRef"
                :tab-active="tabActive"
                :data="initialData"
                :action="'edit'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  outline
                  label="Atrás"
                  :left-icon="defaultIconsLucide.chevronLeft"
                  color-icon="#762344"
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
                  :right-icon="defaultIconsLucide.chevronRight"
                  color-icon="white"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="!isValid"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Actualizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="!isValid"
                  @click="handleSubmitForm"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import InformationForm from '@/components/Forms/Accounting/ReportTemplates/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useReportTemplatesEdit from './ReportTemplatesEdit'

const {
  nextTab,
  backTab,
  isValid,
  isLoaded,
  tabActive,
  initialData,
  filteredTabs,
  tabActiveIdx,
  handleGoToList,
  handleSubmitForm,
  headerProperties,
  informationFormRef,
  defaultIconsLucide,
} = useReportTemplatesEdit()
</script>
