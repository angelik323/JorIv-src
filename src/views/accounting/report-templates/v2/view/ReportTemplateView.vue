<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ReportTemplatesList')"
    >
      <section>
        <TabsComponent
          :tabs
          :tabActive
          :tabActiveIdx
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <div class="q-pa-lg">
          <InformationForm
            ref="informationFormRef"
            :section="tabActive"
            :action="'view'"
            :data="basic_data_form ? basic_data_form : undefined"
          />
          <section
            class="q-mt-lg"
            aria-label="Controles de navegación entre secciones"
          >
            <div class="row justify-end q-gutter-md">
              <Button
                class="custom"
                :disabled="tabActive === 'template'"
                label="Atrás"
                unelevated
                :outline="true"
                color="orange"
                @click="goToPreviousTab"
              />
              <Button
                class="custom"
                :label="tabActive === 'reports' ? 'Finalizar' : 'Continuar'"
                unelevated
                :outline="false"
                color="orange"
                @click="changeTabAndSubmit"
              />
            </div>
          </section>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//Components
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/Accounting/ReportTemplates/v2/InformationForm/InformationForm.vue'
//Logic
import ReportTemplateView from '@/views/accounting/report-templates/v2/view/ReportTemplateView'
const {
  informationFormRef,
  headerProperties,
  tabActive,
  tabActiveIdx,
  tabs,
  basic_data_form,

  changeTabAndSubmit,
  goToURL,
  goToPreviousTab,
} = ReportTemplateView()
</script>
