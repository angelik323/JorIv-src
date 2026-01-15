<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountingConsolidationList')"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tabActive="tabActive"
          :tabActiveIdx="tabActiveIdx"
        />

        <div class="q-pa-md">
          <BasicDataForm
            :action="'details'"
            ref="informationFormRef"
            :data="basic_data_form"
          />
          <section
            class="q-mt-lg"
            aria-label="Controles de navegación entre secciones"
          >
            <div class="row justify-end q-gutter-md">
              <Button
                class="custom"
                label="Finalizar"
                unelevated
                :outline="false"
                color="orange"
                @click="goToURL('AccountingConsolidationList')"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import BasicDataForm from '@/components/Forms/Accounting/AccountingConsolidation/v2/BasicDataForm.vue'

//Logica
import useAccountingConsolidationDetail from '@/views/accounting/accounting-consolidation/v2/detail/AccountingConsolidationDetail'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  basic_data_form,
  goToURL,
} = useAccountingConsolidationDetail()
</script>
