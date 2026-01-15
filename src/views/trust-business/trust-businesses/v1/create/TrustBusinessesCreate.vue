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
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="informationFormRef"
                action="create"
              />
              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="documentsFormRef"
                action="create"
              />

              <section v-if="tabActive === 'information'">
                <div class="q-mb-lg q-mt-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Registros
                  </p>
                </div>

                <!-- Registers expansions -->
                <q-list>
                  <q-expansion-item
                    v-for="(register, index) in register_expansion"
                    :key="register.name"
                    class="q-mb-md"
                    expand-icon-class="text-black expansion-icon"
                    :ref="
                      (el: ComponentPublicInstance<QExpansionItem>) => {
                        if (register.name === 'accounting')
                          accountingRef =
                            el as ComponentPublicInstance<QExpansionItem>
                        if (register.name === 'treasury')
                          treasuryRef =
                            el as ComponentPublicInstance<QExpansionItem>
                        if (register.name === 'cxp')
                          cxpRef =
                            el as ComponentPublicInstance<QExpansionItem>
                        if (register.name === 'regulation')
                          regulationRef =
                            el as ComponentPublicInstance<QExpansionItem>
                      }
                    "
                  >
                    <template #header>
                      <q-item-section>
                        <div class="row q-col-gutter-sm">
                          <div class="col-sm-12 col-md-9 center-content">
                            <p class="text-weight-light text-h6 mb-0">
                              {{ register.label }}
                            </p>
                          </div>
                          <div class="col-sm-12 col-md-3">
                            <div
                              class="row justify-end"
                              v-if="register.showButton"
                            >
                              <Button
                                v-if="register.showButton"
                                :label="
                                  tablePropsEntity.rows?.some(
                                    (item) =>
                                      item.type_resource ===
                                      register.type_resource
                                  )
                                    ? 'Editar'
                                    : 'Agregar'
                                "
                                :size="'md'"
                                :unelevated="true"
                                :outline="true"
                                :color="'orange'"
                                :style-text="'color:black;'"
                                :class="'text-capitalize btn-filter custom'"
                                @click="openAlertModal(index)"
                              />
                            </div>
                          </div>
                        </div>
                      </q-item-section>
                    </template>

                    <VCard v-if="register.name === 'accounting'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <AccountingTrustBusiness
                            ref="accounting_trust_business_form_ref"
                            action="create"
                            :data="getAccountingModels"
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
                            action="create"
                            :data="getTreasuryModels"
                            @update:models="getTreasuryModels = $event"
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
                            action="create"
                            :data="getDerivedContractingModels"
                            @update:models="
                              getDerivedContractingModels = $event
                            "
                          ></DerivedContracting>
                        </div>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'budget' && isBudgetEnabled">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <Budget
                            ref="budget_trust_business_form_ref"
                            action="create"
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

                            <template #actions="{ row }">
                              <Button
                                :left-icon="defaultIconsLucide.trash"
                                color="orange"
                                :class-custom="'custom'"
                                :outline="false"
                                :flat="true"
                                colorIcon="#f45100"
                                :tooltip="'Eliminar'"
                                @click="deleteRegister(row)"
                              />
                            </template>
                          </TableList>
                        </section>
                      </template>
                    </VCard>

                    <VCard v-if="register.name === 'cxp'">
                      <template #content-card>
                        <div class="q-pa-md q-px-lg">
                          <CxPTrustBusiness
                            ref="cxp_treasury_trust_business_form_ref"
                            action="create"
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
                            action="create"
                            :data="getRegulationModels"
                            @update:models="getRegulationModels = $event"
                          />
                        </div>
                      </template>
                    </VCard>
                  </q-expansion-item>
                </q-list>

                <AlertModalComponent
                  ref="alertModalRef"
                  :title-header="registerSelected?.titleModal ?? ''"
                  :description_message="''"
                  :show-btn-cancel="false"
                  :show-close-btn="false"
                  :show-img-default="false"
                  :show-btn-confirm="false"
                  styleModal="min-width: 90%; margin-top: 0px"
                  :margin-top-body="'mt-0'"
                >
                  <template #default-body>
                    <div
                      v-if="
                        ![
                          'accounting',
                          'treasury',
                          'cxp',
                          'regulation',
                        ].includes(registerSelected?.name ?? 'trustor')
                      "
                    >
                      <DefaultDataRegister
                        :action="'create'"
                        :title="''"
                        :type_resource="registerSelected?.type_resource"
                        :data="
                          data_business_resources?.filter(
                            (element) =>
                              element.type_resource ===
                              registerSelected?.type_resource
                          )
                        "
                        @save="closeAlertModalRef"
                      />
                    </div>
                  </template>
                </AlertModalComponent>
              </section>
            </div>

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
                  label="Crear"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import InformationForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Information/InformationForm.vue'
import AccountingTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Accounting/AccountingTrustBusiness.vue'
import CxPTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/CxP/CxPTrustBusiness.vue'
import RegulationTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Regulation/RegulationTrustBusiness.vue'
import TreasuryTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Treasury/TreasuryTrustBusiness.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Documents/DocumentsForm.vue'
import DefaultDataRegister from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/defaultData/DefaultDataRegister.vue'
import TableList from '@/components/table-list/TableList.vue'
import DerivedContracting from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/DerivedContracting/DerivedContracting.vue'
import Budget from '@/components/Forms/TrustBusiness/TrustBusinesses/Registers/Budget/BudgetTrustBusiness.vue'

// Logic view
import useTrustBusinessesCreate from '@/views/trust-business/trust-businesses/v1/create/TrustBusinessesCreate'

// Utils
import { defaultIconsLucide } from '@/utils'
import { ComponentPublicInstance } from 'vue'
import { QExpansionItem } from 'quasar'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  register_expansion,
  alertModalRef,
  registerSelected,
  getAccountingModels,
  getTreasuryModels,
  data_business_resources,
  accounting_trust_business_form_ref,
  treasury_trust_business_form_ref,
  tablePropsEntity,
  accountingRef,
  treasuryRef,
  isDerivateEnabled,
  getCxPModels,
  cxp_treasury_trust_business_form_ref,
  cxpRef,
  getRegulationModels,
  regulation_treasury_trust_business_form_ref,
  regulationRef,
  derived_contracting_trut_business_form_ref,
  getDerivedContractingModels,
  isBudgetEnabled,
  getBudgetModels,
  budget_trust_business_form_ref,

  // Methods
  closeAlertModalRef,
  nextTab,
  backTab,
  onSubmit,
  openAlertModal,
  deleteRegister,
} = useTrustBusinessesCreate()
</script>
