<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'TrustBusinessesList' })"
    >
      <section>
        <TabsComponent
          :tabActive
          :tabs
          :tabActiveIdx
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard v-if="trust_business_response">
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="informationFormRef"
                action="view"
                :data="trust_business_response"
              />
              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="documentsFormRef"
                action="view"
                :data="trust_business_response"
              />
            </div>

            <section v-if="tabActive === 'information'" class="register">
              <div class="q-px-lg q-mt-lg">
                <div class="q-mb-lg q-mt-lg q-px-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Registros
                  </p>
                </div>

                <!-- Registers expansions -->
                <q-list>
                  <q-expansion-item
                    v-for="register in register_expansion"
                    :key="register.name"
                    class="q-mb-md"
                    expand-icon-class="text-black expansion-icon"
                  >
                    <template #header>
                      <q-item-section>
                        <div class="row q-col-gutter-sm">
                          <div class="col-sm-12 col-md-9 center-content">
                            <p class="text-weight-light text-h6 mb-0">
                              {{ register.label }}
                            </p>
                          </div>
                        </div>
                      </q-item-section>
                    </template>

                    <VCard v-if="register.name === 'accounting'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <AccountingTrustBusiness
                            ref="accounting_trust_business_form_ref"
                            action="view"
                            :data="trust_business_response.accounting"
                            @update:models="getAccountingModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'treasury'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <TreasuryTrustBusiness
                            ref="treasury_trust_business_form_ref"
                            action="view"
                            :data="getTreasuryModels"
                          />
                        </div>
                      </template>
                    </VCard>
                    <VCard
                      v-if="
                        register.name === 'derived_contracting' &&
                        isDerivateEnabled
                      "
                    >
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <DerivedContracting
                            ref="derived_contracting_trut_business_form_ref"
                            action="view"
                            :data="getDerivedContractingModels"
                            @update:models="
                              getDerivedContractingModels = $event
                            "
                          />
                        </div>
                      </template>
                    </VCard>
                    <VCard v-if="register.name === 'budget' && isBudgetEnabled">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <Budget
                            ref="budget_trust_business_form_ref"
                            action="view"
                            :data="getBudgetModels"
                            @update:models="getBudgetModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>
                    <VCard
                      v-if="
                        [
                          'trustor',
                          'participation_beneficiaries',
                          'obligation_beneficiaries',
                          'consortium_members',
                        ].includes(register.name)
                      "
                    >
                      <template #content-card>
                        <section class="q-mt-xl q-px-md">
                          <TableList
                            :loading="tablePropsEntity.loading"
                            :rows="
                              tablePropsEntity.rows?.filter(
                                (item) =>
                                  item.type_resource === register.type_resource
                              )
                            "
                            :columns="tablePropsEntity.columns"
                            :custom-columns="['actions']"
                            :rowsPerPageOptions="[7]"
                            :hide-header="
                              !tablePropsEntity.rows?.some(
                                (item) =>
                                  item.type_resource === register.type_resource
                              )
                            "
                          >
                            <template #custom-no-data>
                              <div
                                class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                              >
                                <img
                                  src="@/assets/images/icons/no_data_2.svg"
                                  alt="No hay datos para mostrar"
                                  width="180px"
                                />
                                <p class="text-weight-bold text-h5 text-center">
                                  No hay datos para mostrar
                                </p>
                              </div>
                            </template>
                          </TableList>
                          <div class="px-1 flex justify-end">
                            <GenericInput
                              v-if="tablePropsEntity.rows.length > 0"
                              :type="'number'"
                              :required="true"
                              :default_value="
                                register.type_resource
                                  ? computedParticipation(register).toFixed(0)
                                  : '0'
                              "
                              readonly
                              placeholder="%"
                              :rules="[]"
                            />
                          </div>
                        </section>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'policies'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <PoliciesTrustBusiness :business-id="searchId" />
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'guarantees'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <GuaranteesTrustBusiness :business-id="searchId" />
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'cxp'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <CxPTrustBusiness
                            ref="cxp_treasury_trust_business_form_ref"
                            action="view"
                            :data="getCxPModels"
                            @update:models="getCxPModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'regulation'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <RegulationTrustBusiness
                            ref="regulation_treasury_trust_business_form_ref"
                            action="view"
                            :data="getRegulationModels"
                            @update:models="getRegulationModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'billing'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <BillingTrustBusiness
                            ref="billing_trust_business_form_ref"
                            action="view"
                            :data="getBillingModels"
                            @update:models="getBillingModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>
                  </q-expansion-item>
                </q-list>
              </div>
            </section>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
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
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Information/InformationForm.vue'
import AccountingTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Accounting/AccountingTrustBusiness.vue'
import TreasuryTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Treasury/TreasuryTrustBusiness.vue'
import PoliciesTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Policies/PoliciesTrustBusiness.vue'
import GuaranteesTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Guarantees/GuaranteesTrustBusiness.vue'
import CxPTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/CxP/CxPTrustBusiness.vue'
import BillingTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Billing/BillingTrustBusiness.vue'
import RegulationTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Regulation/RegulationTrustBusiness.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Documents/DocumentsForm.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import DerivedContracting from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/DerivedContracting/DerivedContracting.vue'
import Budget from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Budget/BudgetTrustBusiness.vue'

// Logic view
import useTrustBusinessesRead from '@/views/trust-business/trust-businesses/v1/read/TrustBusinessesRead'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  trust_business_response,
  searchId,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  register_expansion,
  informationFormRef,
  getAccountingModels,
  getTreasuryModels,
  getDerivedContractingModels,
  accounting_trust_business_form_ref,
  treasury_trust_business_form_ref,
  derived_contracting_trut_business_form_ref,
  tablePropsEntity,
  getCxPModels,
  cxp_treasury_trust_business_form_ref,
  getBillingModels,
  billing_trust_business_form_ref,
  getRegulationModels,
  regulation_treasury_trust_business_form_ref,
  isDerivateEnabled,
  getBudgetModels,
  isBudgetEnabled,

  // Methods
  nextTab,
  backTab,
  onSubmit,
  computedParticipation,
} = useTrustBusinessesRead()
</script>
