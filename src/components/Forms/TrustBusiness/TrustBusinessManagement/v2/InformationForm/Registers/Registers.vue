<template>
  <section v-if="!isLoading">
    <section>
      <div class="q-mb-lg mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Registros
        </p>
      </div>
    </section>
    <q-list>
      <q-expansion-item
        v-for="(register, index) in register_expansion"
        :key="register.name"
        class="q-mb-md"
        expand-icon-class="text-black expansion-icon"
        :ref="el => {
        if (el) setExpansionRef(register.name as RegisterKey, el as ComponentPublicInstance<{ show: () => void }>)
      }"
      >
        <template #header>
          <q-item-section>
            <div class="row q-col-gutter-sm">
              <div class="col-sm-12 col-md-9 center-content">
                <p class="text-weight-light text-h6 mb-0">
                  {{ register.label }}
                </p>
                <p
                  class="text-weight-light text-caption mb-0 text-grey-6 q-mt-xs"
                  v-if="register.subtitle"
                >
                  {{ register.subtitle }}
                  <strong class="text-weight-bold"
                    >Liquidación de comisiones</strong
                  >
                </p>
              </div>
              <div class="col-sm-12 col-md-3 self-center">
                <div class="row justify-end" v-if="register.showButton">
                  <Button
                    v-if="register.labelButton"
                    :label="register.labelButton"
                    :size="'md'"
                    :unelevated="true"
                    :outline="true"
                    :color="'orange'"
                    :style-text="'color:black;'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="goToRegister(register.name)"
                  />
                  <Button
                    v-else
                    :label="
                      models.business_resources?.some(
                        (item) => item.type_resource === register.type_resource
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

        <VCard>
          <template #content-card v-if="thirdOptions.includes(register.name)">
            <TableThirds
              :data="
                models.business_resources?.filter(
                  (item) => item.type_resource === register.type_resource
                )
              "
              :hide_header="
                !models.business_resources?.some(
                  (item) => item.type_resource === register.type_resource
                )
              "
            />
          </template>

          <template #content-card v-if="registerComponents[register.name]">
            <div class="q-pa-md q-px-lg">
              <component
                :is="registerComponents[register.name]"
                :ref="(el: FormRef | undefined) => setFormRef(register.name as RegisterKey, el)"
                :action="props.action"
                :data="getModel(register.name as RegisterKey)"
                @update:models="
                  updateModel(register.name as RegisterKey, $event)
                "
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
        <DataModalThirds
          :action="'create'"
          :title="''"
          :type_resource="registerSelected?.type_resource"
          :data="
            models.business_resources?.filter(
              (element) =>
                element.type_resource === registerSelected?.type_resource
            )
          "
          @update:models="closeAlertModalRef"
          @cancel="alertModalRef?.closeModal()"
        />
      </template>
    </AlertModalComponent>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessRegisters | null
    business_type: string | number | null
    is_consortium: boolean
    has_cxp: boolean
    has_budget: boolean
    derivate_contracting: boolean
    has_normative: boolean
    status_id?: number
    name?: string
    business_id?: number
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:models', value: ITrustBusinessRegisters) => void>()

// components
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableThirds from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Thirds/TableThirds/TableThirds.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import DataModalThirds from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Thirds/DataModalThirds/DataModalThirds.vue'

// interfaces
import {
  ITrustBusinessRegisters,
  RegisterKey,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { ActionType } from '@/interfaces/global'
type FormComponentInstance = {
  validateForm: () => Promise<boolean> | boolean
}
type FormRef = ComponentPublicInstance<FormComponentInstance>

// vue
import type { Component, ComponentPublicInstance } from 'vue'

// components - submodules
import AccountingTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Accounting/AccountingTrustBusiness.vue'
import TreasuryTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Treasury/TreasuryTrustBusiness.vue'
import CxPTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/CxP/CxPTrustBusiness.vue'
import RegulationTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Regulation/RegulationTrustBusiness.vue'
import BillingTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Billing/BillingTrustBusiness.vue'
import DerivedContracting from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/DerivedContracting/DerivedContracting.vue'
import Buget from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Budget/BudgetTrustBusiness.vue'

const registerComponents: Record<string, Component> = {
  accounting: AccountingTrustBusiness,
  treasury: TreasuryTrustBusiness,
  cxp: CxPTrustBusiness,
  regulation: RegulationTrustBusiness,
  billing: BillingTrustBusiness,
  derived_contracting: DerivedContracting,
  budget: Buget,
}

// logic-view
import useRegisters from './Registers'

const {
  models,
  register_expansion,
  alertModalRef,
  thirdOptions,
  registerSelected,
  isLoading,
  setExpansionRef,
  openAlertModal,
  closeAlertModalRef,
  getModel,
  updateModel,
  validateForms,
  setFormRef,
  goToRegister,
} = useRegisters(props, emits)

defineExpose({
  validateForm: async () => await validateForms(),
})
</script>
