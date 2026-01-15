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
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <BasicInformationForm
              v-if="tabActive === 'information'"
              ref="formBasicInformation"
              :action="'create'"
              :data="basicInformationDataForm"
              @update:basic-data-form="basicInformationDataForm = $event"
            />

            <template v-if="tabActive === 'legal_representation'">
              <LegalRepresentationForm
                v-if="client_person_type === ClientPersonType.LEGAL_DIRECT"
                ref="formLegalRepresentation"
                :action="'create'"
                :legal-representation-data-form="legalRepresentationDataForm"
                @update:legal-representation-data-form="
                  legalRepresentationDataForm = $event ?? null
                "
              />
              <LegalRepresentationList
                v-if="client_person_type === ClientPersonType.LEGAL_INDIRECT"
                ref="formLegalRepresentation"
                :action="'create'"
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
                action="create"
                @update:data="directCorporateDataForm = $event"
              />
              <IndirectCorporateForm
                v-else
                ref="formCorporateIndirect"
                :data="indirectCorporateDataForm"
                action="create"
                @update:data="indirectCorporateDataForm = $event"
              />
            </template>

            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'create'"
              :tributary-data-form="tributaryDataForm"
              :basic-information-data-form="basicInformationDataForm"
              @update:tributary-data-form="tributaryDataForm = $event ?? null"
            />

            <ShareholdersForm
              v-if="tabActive === 'shareholders'"
              ref="formShareholders"
              :data="shareholdersDataForm"
              action="create"
              @update:data="shareholdersDataForm = $event"
            />

            <ManagerForm
              v-if="tabActive === 'manager'"
              ref="formManager"
              :action="'create'"
              :manager-data-form="managerDataForm"
              @update:manager-data-form="managerDataForm = $event"
            />

            <template v-if="tabActive === 'investor'">
              <InvestorFormDirect
                v-if="client_person_type === ClientPersonType.LEGAL_DIRECT"
                ref="formInvestor"
                :action="'create'"
              />
              <InvestorFormIndirect
                v-if="client_person_type === ClientPersonType.LEGAL_INDIRECT"
                ref="formInvestor"
                :action="'create'"
                :data="investorIndirectDataForm"
                @update:investor-indirect-data-form="
                  investorIndirectDataForm = $event
                "
              />
            </template>

            <DocumentFormIndirect
              v-if="
                tabActive === 'documents' &&
                client_person_type === ClientPersonType.LEGAL_INDIRECT
              "
              ref="formDocumentsIndirect"
              :action="'create'"
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
                  :disabled="exist_client"
                  @click="nextTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Crear"
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
import ShareholdersForm from '@/components/Forms/Clients/v2/LegalPerson/Shareholders/ShareholdersForm.vue'
import TributaryForm from '@/components/Forms/Clients/v2/LegalPerson/Tributary/TributaryForm.vue'
import InvestorFormIndirect from '@/components/Forms/Clients/v2/LegalPerson/Investor/InvestorForm.vue'
import DocumentFormIndirect from '@/components/Forms/Clients/v2/LegalPerson/Document/Documentform.vue'
import InvestorFormDirect from '@/components/Forms/Clients/LegalEntity/investor/InvestorForm.vue'
import ManagerForm from '@/components/Forms/Clients/v2/LegalPerson/Manager/ManagerForm.vue'

// Logic view
import useLegalPersonCreate from '@/views/clients/v2/create/legal-person/LegalPersonCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  ClientPersonType,
  client_person_type,
  exist_client,
  defaultIconsLucide,

  formBasicInformation,
  formLegalRepresentation,
  formTributary,
  formCorporateDirect,
  formCorporateIndirect,
  formManager,
  formShareholders,
  formInvestor,
  formDocumentsIndirect,

  basicInformationDataForm,
  legalRepresentationDataForm,
  legalRepresentationDataList,
  directCorporateDataForm,
  indirectCorporateDataForm,
  shareholdersDataForm,
  tributaryDataForm,
  investorIndirectDataForm,
  managerDataForm,
  documentIndirectForm,

  goToURL,
  nextTab,
  backTab,
  onSubmit,
} = useLegalPersonCreate()
</script>
