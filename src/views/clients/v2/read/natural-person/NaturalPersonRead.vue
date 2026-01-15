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
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <!-- INFORMATION -->
            <InformationFormNaturalIndirect
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'view'"
              v-model:data="data_information_form"
              :client_person_type="client_person_type"
            />

            <!-- TRIBUTARY -->
            <TributaryFormNaturalIndirect
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'view'"
              :settlement_formulas_list="settlement_formulas_list"
              v-model:data="data_tributary_form"
            />

            <!-- FINANCE -->
            <FinanceFormNaturalIndirect
              v-if="tabActive === 'finance'"
              ref="formFinance"
              :action="'view'"
              v-model:data="data_finance_form"
            />

            <!-- PEP -->
            <PepFormNaturalIndirect
              v-if="tabActive === 'pep'"
              ref="formPep"
              :action="'view'"
              v-model:data="dataPepForm"
            />

            <!-- INVESTOR -->
            <InvestorFormIndirect
              v-if="tabActive === 'investor'"
              ref="formInvestor"
              :action="'view'"
              v-model:data="investorIndirectDataForm"
            />

            <!-- DOCUMENT -->
            <DocumentForm
              v-if="tabActive === 'document'"
              ref="formDocument"
              :action="'view'"
              :data="documentIndirectDataForm"
              :dataTributaryForm="data_tributary_form"
              :dataPepForm="dataPepForm"
              @update:document-indirect-data-form="
                documentIndirectDataForm = $event
              "
            />

            <!-- ACTIONS -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <!-- BACK -->
                <Button
                  v-if="tabActiveIdx > 0"
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

                <!-- NEXT -->
                <Button
                  v-if="tabActiveIdx < filteredTabs.length - 1"
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
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
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
/* Components */
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Information/InformationForm.vue'
import TributaryFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Tributary/TributaryForm.vue'
import FinanceFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Finance/FinanceForm.vue'
import PepFormNaturalIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/pep/PepForm.vue'
import InvestorFormIndirect from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Investor/InvestorForm.vue'
import DocumentForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/document/DocumentForm.vue'

/* Logic */
import readNaturalPerson from '@/views/clients/v2/read/natural-person/NaturalPersonRead'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,

  settlement_formulas_list,

  /* DATA */
  data_information_form,
  data_tributary_form,
  data_finance_form,
  dataPepForm,
  investorIndirectDataForm,
  documentIndirectDataForm,

  client_person_type,

  /* ACTIONS */
  nextTab,
  backTab,
  onSubmit,
} = readNaturalPerson()
</script>
