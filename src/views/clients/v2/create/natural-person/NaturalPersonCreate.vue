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
      <section>
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <InformationFormNaturalIndirect
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'create'"
              v-model:data="data_information_form"
            />
            <TributaryFormNaturalIndirect
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'create'"
              :settlement_formulas_list="settlement_formulas_list"
              v-model:data="data_tributary_form"
              :third-party="clientFullName"
            />
            <FinanceFormNaturalIndirect
              v-if="tabActive === 'finance'"
              ref="formFinance"
              :action="'create'"
              v-model:data="data_finance_form"
            />
            <PepForm
              v-if="tabActive === 'pep'"
              ref="formPep"
              :action="'create'"
              v-model:data="dataPepForm"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              ref="formInvestor"
              :action="'create'"
              v-model:data="investorIndirectDataForm"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              ref="formDocument"
              :action="'create'"
              :data="documentIndirectDataForm"
              :dataTributaryForm="data_tributary_form"
              :dataPepForm="dataPepForm"
              @update:document-indirect-data-form="
                documentIndirectDataForm = $event
              "
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  :left-icon="defaultIconsLucide.back"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                      filteredTabs.length - 1
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
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Information/InformationForm.vue'
import TributaryFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Tributary/TributaryForm.vue'
import FinanceFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Finance/FinanceForm.vue'
import PepForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/pep/PepForm.vue'
import InvestorForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Investor/InvestorForm.vue'
import DocumentForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/document/DocumentForm.vue'

// Logic view
import useNaturalEntity from '@/views/clients/v2/create/natural-person/NaturalPersonCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,

  formInformation,
  formTributary,
  formFinance,
  formPep,
  formInvestor,
  formDocument,

  exist_client,

  data_information_form,

  data_tributary_form,
  data_finance_form,
  clientFullName,
  settlement_formulas_list,
  nextTab,
  backTab,
  dataPepForm,
  investorIndirectDataForm,
  documentIndirectDataForm,
  onSubmit,
} = useNaturalEntity()
</script>
