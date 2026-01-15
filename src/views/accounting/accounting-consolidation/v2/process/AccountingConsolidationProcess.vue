<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AccountingConsolidationList' })"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <div class="q-pa-md">
          <BasicDataForm
            :action="'process'"
            ref="informationFormRef"
            @update:data="basic_data_form = $event"
          />

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

// Form component
import BasicDataForm from '@/components/Forms/Accounting/AccountingConsolidation/v2/BasicDataForm.vue'

// Logic View
import useAccountingConsolidationProcess from '@/views/accounting/accounting-consolidation/v2/process/AccountingConsolidationProcess'

const {
  //Header and tabs properties
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  goToURL,
  //Form refs and data
  basic_data_form,
} = useAccountingConsolidationProcess()
</script>
