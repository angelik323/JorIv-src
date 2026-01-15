<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ClientsList')"
    >
      <section>
        <TabsComponent
          :tabs
          :tabActive
          :tabActiveIdx
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <BasicInformationForm
              v-if="tabActive === 'information'"
              ref="formBasicInformation"
              :action="'view'"
              :data="basicInformationDataForm"
              @update:basic-data-form="basicInformationDataForm = $event"
            />

            <template v-if="tabActive === 'legal_representation'">
              <LegalRepresentationForm
                v-if="client_person_type === ClientPersonType.LEGAL_DIRECT"
                ref="formLegalRepresentation"
                :action="'view'"
                :legal-representation-data-form="legalRepresentationDataForm"
                @update:legal-representation-data-form="
                  legalRepresentationDataForm = $event ?? null
                "
              />
              <LegalRepresentationList
                v-if="client_person_type === ClientPersonType.LEGAL_INDIRECT"
                ref="formLegalRepresentation"
                :action="'view'"
                :legal-representation-data-list="legalRepresentationDataList"
                @update:legal-representation-data-list="
                  legalRepresentationDataList = $event
                "
              />
            </template>

            <template v-if="tabActive === 'corporate'">
              <DirectCorporateForm
                v-if="client_person_type === ClientPersonType.LEGAL_DIRECT"
                ref="formCorporateDirect"
                :data="directCorporateDataForm"
                action="view"
                @update:data="directCorporateDataForm = $event"
              />
              <IndirectCorporateForm
                v-else
                ref="formCorporateIndirect"
                :data="indirectCorporateDataForm"
                action="view"
                @update:data="indirectCorporateDataForm = $event"
              />
            </template>

            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'view'"
              :tributary-data-form="tributaryDataForm"
              :basic-information-data-form="basicInformationDataForm"
              @update:tributary-data-form="tributaryDataForm = $event ?? null"
            />

            <ShareholdersForm
              v-if="tabActive === 'shareholders'"
              ref="formShareholders"
              :data="shareholdersDataForm"
              action="view"
              @update:data="shareholdersDataForm = $event"
            />

            <ManagerForm
              v-if="tabActive === 'manager'"
              ref="formManager"
              :action="'view'"
              :manager-data-form="managerDataForm"
              @update:manager-data-form="managerDataForm = $event"
            />

            <InvestorFormIndirect
              v-if="
                tabActive === 'investor' &&
                client_person_type === ClientPersonType.LEGAL_INDIRECT
              "
              ref="formInvestor"
              :action="'view'"
              :data="investorIndirectDataForm"
              @update:investor-indirect-data-form="
                investorIndirectDataForm = $event
              "
            />

            <DocumentFormIndirect
              v-if="
                tabActive === 'documents' &&
                client_person_type === ClientPersonType.LEGAL_INDIRECT
              "
              ref="formDocumentsIndirect"
              :action="'view'"
              @update:data="documentIndirectForm = $event"
              :data="documentIndirectForm"
              :tributary-data-form="tributaryDataForm"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  :left-icon="defaultIconsLucide.back"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :right-icon="defaultIconsLucide.next"
                  size="md"
                  :outline="false"
                  unelevated
                  color="orange"
                  color-icon="white"
                  class="custom"
                  @click="nextTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  :outline="false"
                  unelevated
                  color="orange"
                  color-icon="white"
                  class="custom"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import BasicInformationForm from '@/components/Forms/Clients/v2/LegalPerson/BasicInformation/BasicInformationForm.vue'
import LegalRepresentationForm from '@/components/Forms/Clients/v2/LegalPerson/LegalRepresentation/LegalRepresentationForm.vue'
import LegalRepresentationList from '@/components/Lists/Clients/LegalPerson/LegalRepresentation/LegalRepresentationList.vue'
import DirectCorporateForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Direct/CorporateForm.vue'
import IndirectCorporateForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Indirect/CorporateForm.vue'
import TributaryForm from '@/components/Forms/Clients/v2/LegalPerson/Tributary/TributaryForm.vue'
import ShareholdersForm from '@/components/Forms/Clients/v2/LegalPerson/Shareholders/ShareholdersForm.vue'
import ManagerForm from '@/components/Forms/Clients/v2/LegalPerson/Manager/ManagerForm.vue'
import InvestorFormIndirect from '@/components/Forms/Clients/v2/LegalPerson/Investor/InvestorForm.vue'
import DocumentFormIndirect from '@/components/Forms/Clients/v2/LegalPerson/Document/Documentform.vue'

// Logic view
import useLegalPersonRead from '@/views/clients/v2/read/legal-person/LegalPersonRead'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  ClientPersonType,
  client_person_type,
  defaultIconsLucide,

  formBasicInformation,
  formLegalRepresentation,
  formCorporateDirect,
  formCorporateIndirect,
  formTributary,
  formShareholders,
  formManager,
  formInvestor,
  formDocumentsIndirect,

  basicInformationDataForm,
  legalRepresentationDataForm,
  legalRepresentationDataList,
  directCorporateDataForm,
  indirectCorporateDataForm,
  tributaryDataForm,
  shareholdersDataForm,
  managerDataForm,
  investorIndirectDataForm,
  documentIndirectForm,

  goToURL,
  nextTab,
  backTab,
  onSubmit,
} = useLegalPersonRead()
</script>
