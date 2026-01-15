<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ClientsList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard v-if="legalData">
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <LegalRepresentationForm
              v-if="tabActive === 'legal_representation'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <CorporativeForm
              v-if="tabActive === 'corporative'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <ShareholderForm
              v-if="tabActive === 'shareholder'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <ManagerForm
              v-if="tabActive === 'manager'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              ref=""
              :action="'view'"
              :data="legalData"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              ref=""
              :action="'view'"
              :data="legalData"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  icon="mdi-chevron-left"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />

                <q-btn
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  icon-right="mdi-chevron-right"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab()"
                />

                <q-btn
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/Clients/LegalEntity/InformationForm/InformationForm.vue'
import LegalRepresentationForm from '@/components/Forms/Clients/LegalEntity/legal_representation/LegalRepresentationForm.vue'
import CorporativeForm from '@/components/Forms/Clients/LegalEntity/corporative/CorporativeForm.vue'
import TributaryForm from '@/components/Forms/Clients/LegalEntity/tributary/TributaryForm.vue'
import ShareholderForm from '@/components/Forms/Clients/LegalEntity/shareholder/ShareholderForm.vue'
import ManagerForm from '@/components/Forms/Clients/LegalEntity/manager/ManagerForm.vue'
import InvestorForm from '@/components/Forms/Clients/LegalEntity/investor/InvestorForm.vue'
import DocumentForm from '@/components/Forms/Clients/LegalEntity/document/DocumentForm.vue'

// Logic view
import useLegalEntity from '@/views/clients/v1/read/legal-person/LegalPersonRead'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  legalData,

  onSubmit,
  nextTab,
  backTab,
} = useLegalEntity()
</script>
