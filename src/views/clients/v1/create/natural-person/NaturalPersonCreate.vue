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
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'create'"
            />
            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'create'"
            />
            <FinanceForm
              v-if="tabActive === 'finance'"
              ref="formFinance"
              :action="'create'"
            />
            <PepForm
              v-if="tabActive === 'pep'"
              ref="formPep"
              :action="'create'"
            />
            <EstateForm
              v-if="tabActive === 'estate'"
              ref="formEstate"
              :action="'create'"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              ref="formInvestor"
              :action="'create'"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              ref="formDocument"
              :action="'create'"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
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
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                      filteredTabs.length - 1
                  "
                  label="Continuar"
                  icon-right="mdi-chevron-right"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="exist_client"
                  @click="nextTab()"
                />

                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  label="Crear"
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
import InformationForm from '@/components/Forms/Clients/NaturalEntity/information/InformationForm.vue'
import TributaryForm from '@/components/Forms/Clients/NaturalEntity/tributary/TributaryForm.vue'
import FinanceForm from '@/components/Forms/Clients/NaturalEntity/finance/FinanceForm.vue'
import PepForm from '@/components/Forms/Clients/NaturalEntity/pep/PepForm.vue'
import EstateForm from '@/components/Forms/Clients/NaturalEntity/estate/EstateForm.vue'
import InvestorForm from '@/components/Forms/Clients/NaturalEntity/investor/InvestorForm.vue'
import DocumentForm from '@/components/Forms/Clients/NaturalEntity/document/DocumentForm.vue'

// Logic view
import useNaturalEntity from '@/views/clients/v1/create/natural-person/NaturalPersonCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,

  formInformation,
  formTributary,
  formFinance,
  formPep,
  formEstate,
  formInvestor,
  formDocument,
  exist_client,

  nextTab,
  backTab,
  onSubmit,
} = useNaturalEntity()
</script>
