<template>
  <section v-if="!isLoading">
    <q-form ref="information_form_ref">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-auto">
          <p class="text-black-90 text-weight-bold text-h7 q-mb-none">
            Tipo de registro
          </p>
        </div>
        <div class="col-auto">
          <RadioYesNo
            v-model="models.register_type"
            :has-title="false"
            :options="business_trust_register_type"
            :is-disabled="props.action !== 'create'"
          />
        </div>
      </div>
      <q-separator class="q-mt-sm" />

      <GeneralInformation
        class="mt-2"
        ref="general_information_ref"
        :action="action"
        :data="getGeneralInformation"
        :is-society="isSociety"
        :status_id="Number(models.status_id)"
        @update:models="setDataGeneralInformation"
      />
      <q-separator class="q-mt-sm" />

      <GeneralDates
        class="mt-2"
        ref="general_dates_ref"
        :action="action"
        :data="getGeneralDates"
        :is-society="isSociety"
        @update:models="setDataGeneralDates"
      />
      <q-separator class="q-mt-sm" />

      <AdditionalInformation
        class="mt-2"
        ref="additional_information_ref"
        :action="action"
        :data="getAdditionalInformation"
        :is-society="isSociety"
        @update:models="setAdditionalInformation"
      />
      <q-separator class="q-mt-sm" />

      <section v-if="!isCreate">
        <div class="q-mb-lg q-mt-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Estados
          </p>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <p class="text-weight-medium mb-0" :class="'text-grey-6'">
              Estado general
            </p>
            <ShowStatus
              :type="Number(models.status_id ?? 0)"
              status-type="trustBusiness"
            />
          </div>
          <div class="col-12 col-md-6" v-if="!['view', 'edit'].includes(props.action)">
            <p class="text-weight-medium mb-0" :class="'text-grey-6'">
              Estado de las comisiones fiduciaria
            </p>
            <ShowStatus
              :type="Number(models.status_fiduciary_fees_id ?? 0)"
              status-type="trustBusiness"
            />
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </section>

      <Registers
        ref="registers_ref"
        :action="action"
        :data="getRegisters"
        :business_type="models.business_type_id ?? ''"
        :is_consortium="models.consortium ?? false"
        :status_id="models.status_id ?? undefined"
        :has_cxp="models.has_accounts_payable ?? false"
        :has_budget="models.has_budget ?? false"
        :derivate_contracting="models.derivate_contracting ?? false"
        :has_normative="models.has_normative ?? false"
        :name="models.name ?? ''"
        :business_id="models.id ?? undefined"
        @update:models="setRegisters"
      />
    </q-form>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessInformationForm | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITrustBusinessInformationForm) => void
  >()

// components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GeneralInformation from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/GeneralInformation/GeneralInformation.vue'
import GeneralDates from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/GeneralDates/GeneralDates.vue'
import AdditionalInformation from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/AdditionalInformation/AdditionalInformation.vue'
import Registers from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Registers.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessInformationForm } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic
import useInformationForm from './InformationForm'

const {
  models,
  information_form_ref,
  business_trust_register_type,
  general_information_ref,
  general_dates_ref,
  additional_information_ref,
  getGeneralInformation,
  isSociety,
  isCreate,
  getGeneralDates,
  getAdditionalInformation,
  getRegisters,
  registers_ref,
  isLoading,

  setDataGeneralInformation,
  setDataGeneralDates,
  setAdditionalInformation,
  setRegisters,
  validateForm,
} = useInformationForm(props, emits)

defineExpose({
  validateForm,
})
</script>
