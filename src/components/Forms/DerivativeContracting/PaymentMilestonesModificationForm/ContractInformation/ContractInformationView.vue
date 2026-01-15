<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información general del contrato
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-12">
          <div>
            <span class="text-caption text-grey-7">Número de contrato</span>
            <div class="text-body1 text-weight-medium">
              {{ models.C_number || '-' }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Negocio</span>
            <div class="text-body1 text-weight-medium">
              {{ models.BT_name || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Tipo de contrato</span>
            <div class="text-body1 text-weight-medium">
              {{ models.DT_contract_type || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Estado</span>
            <div class="text-body1 text-weight-medium">
              {{ models.C_stage || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Fecha de suscripción</span>
            <div class="text-body1 text-weight-medium">
              {{ models.C_subscription_date || '-' }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Contratista</span>
            <div class="text-body1 text-weight-medium">
              {{ models.contractor || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Moneda</span>
            <div class="text-body1 text-weight-medium">
              {{ models.currency || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Modalidad</span>
            <div class="text-body1 text-weight-medium">
              {{ models.DT_Modality || '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="q-my-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información del hito actual
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Hito</span>
            <div class="text-body1 text-weight-medium">
              {{ models.milestone || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Tipo de pago</span>
            <div class="text-body1 text-weight-medium">
              {{ models.payment_type || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7">Fecha</span>
            <div class="text-body1 text-weight-medium">
              {{ models.date || '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7"
              >Monto extranjero programado</span
            >
            <div class="text-body1 text-weight-medium">
              {{ models.foreign_amount || '-' }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="q-mb-sm">
            <span class="text-caption text-grey-7"
              >Valor hito programado COP</span
            >
            <div class="text-body1 text-weight-medium">
              {{ models.cop_value || '-' }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import { IPaymentMilestoneForm } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// Logic
import useContractInformationView from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/ContractInformation/ContractInformationView'

const props = withDefaults(
  defineProps<{
    data: IPaymentMilestoneForm | null
  }>(),
  {}
)

const { models } = useContractInformationView(props)
</script>
