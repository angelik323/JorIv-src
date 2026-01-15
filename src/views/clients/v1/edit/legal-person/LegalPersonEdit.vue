<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('ClientsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard v-if="legal_client_request">
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'edit'"
              :data="legal_client_request"
            />
            <LegalRepresentationForm
              v-if="tabActive === 'legal_representation'"
              ref="formLegalRepresentation"
              :action="'edit'"
              :data="legal_client_request"
            />
            <CorporativeForm
              v-if="tabActive === 'corporative'"
              ref="formCorporative"
              :action="'edit'"
              :data="legal_client_request"
            />
            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'edit'"
              :data="legal_client_request"
            />
            <ShareholderForm
              v-if="tabActive === 'shareholder'"
              ref="formShareholder"
              :action="'edit'"
              :data="legal_client_request"
            />
            <ManagerForm
              v-if="tabActive === 'manager'"
              ref="formManager"
              :action="'edit'"
              :data="legal_client_request"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              ref="formInvestor"
              :action="'edit'"
              :data="legal_client_request"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              ref="formDocument"
              :action="'edit'"
              :data="legal_client_request"
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
                  label="Actualizar"
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
import useLegalPersonEdit from '@/views/clients/v1/edit/legal-person/LegalPersonEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  legal_client_request,

  formInformation,
  formLegalRepresentation,
  formCorporative,
  formTributary,
  formShareholder,
  formManager,
  formInvestor,
  formDocument,

  handlerGoTo,
  onSubmit,
  nextTab,
  backTab,
} = useLegalPersonEdit()
</script>
