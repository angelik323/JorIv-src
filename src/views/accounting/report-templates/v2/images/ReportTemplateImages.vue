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
          <LogoDataForm ref="logoDataFormRef" :action="tabActive" />
          <section
            class="q-mt-lg"
            aria-label="Controles de navegación entre secciones"
          >
            <div class="row justify-end q-gutter-md">
              <Button
                v-if="tabActive === 'signature'"
                :outline="true"
                label="Atrás"
                unelevated
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="tabActive = 'logo'"
              />
              <Button
                class="custom"
                :label="tabActive === 'logo' ? 'Continuar' : 'Crear'"
                unelevated
                :outline="false"
                color="orange"
                @click="changeTab"
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
import LogoDataForm from '@/components/Forms/Accounting/ReportTemplates/v2/ImagesForm/LogoData/LogoDataForm.vue'

//Logic
import ReportTemplateImages from '@/views/accounting/report-templates/v2/images/ReportTemplateImages'
const {
  //Header and tabs
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,

  //Navigate
  changeTab,
  goToURL,
} = ReportTemplateImages()
</script>
