<template>
  <q-form ref="formInformation">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ models.registration_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fondo de inversión
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_fund ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_plan ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Identificación titular
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción titular
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_description ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Estado plan de inversión
            </p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="Number(models.investment_plan_status ?? 1)" />
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Interfaces
import { IFicConsultUnitsViewPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// logic view
import useConsultUnitsForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/ConsultUnits/ConsultUnitsForm'

const props = withDefaults(defineProps<IFicConsultUnitsViewPropsForm>(), {})

const { models } = useConsultUnitsForm(props)
</script>
