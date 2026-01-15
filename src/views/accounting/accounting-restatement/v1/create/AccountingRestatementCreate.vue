<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AccountingRestatementList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'terminos'">
              <TermsForm />
            </div>
            <div v-else-if="tabActive === 'ejecutar'">
              <TermsForm action="ejecutar" />
            </div>
            <div v-else-if="tabActive === 'Informe de procesos'">
              <TermsForm action="informe" />
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TermsForm from '@/components/Forms/Accounting/AccountingRestatement/Terms/TermsForm.vue'
import useAccountingRestatementCreate from '@/views/accounting/accounting-restatement/v1/create/AccountingRestatementCreate'

const { headerProps, filteredTabs, tabActive, tabActiveIdx } =
  useAccountingRestatementCreate()
</script>
