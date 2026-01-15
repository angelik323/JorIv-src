<script lang="ts" src="./NaturalPersonEdit.ts" />

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
        <VCard v-if="natural_client_request">
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'edit'"
              :data="natural_client_request"
            />
            <TributaryForm
              v-if="tabActive === 'tributary'"
              ref="formTributary"
              :action="'edit'"
              :data="natural_client_request"
            />
            <FinanceForm
              v-if="tabActive === 'finance'"
              ref="formFinance"
              :action="'edit'"
              :data="natural_client_request"
            />
            <PepForm
              v-if="tabActive === 'pep'"
              ref="formPep"
              :action="'edit'"
              :data="natural_client_request"
            />
            <EstateForm
              v-if="tabActive === 'estate'"
              ref="formEstate"
              :action="'edit'"
              :data="natural_client_request"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              ref="formInvestor"
              :action="'edit'"
              :data="natural_client_request"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              ref="formDocument"
              :action="'edit'"
              :data="natural_client_request"
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
                  @click="nextTab()"
                />

                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
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
