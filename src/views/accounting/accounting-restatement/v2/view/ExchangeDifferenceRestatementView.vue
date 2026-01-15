<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountingRestatementList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <div class="q-pa-lg">
          <InformationForm
            ref="informationFormRef"
            :action="'view'"
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
                @click="goToURL('AccountingRestatementList')"
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
import InformationForm from '@/components/Forms/Accounting/AccountingRestatement/InformationForm/v2/InformationForm.vue'

//Logic
import ExchangeDifferenceRestatementView from '@/views/accounting/accounting-restatement/v2/view/ExchangeDifferenceRestatementView'

const {
  //Header and tabs
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,

  //Form data and refs
  basic_data_form,
  informationFormRef,
  //Navigate
  goToURL,
} = ExchangeDifferenceRestatementView()
</script>
