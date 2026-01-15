<template>
  <section class="q-pa-lg row q-col-gutter-lg">
    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Número de proceso</p>
      <p class="text-weight-medium no-margin">
        {{ formData.id || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Tipo de proceso</p>
      <p class="text-weight-medium no-margin">
        {{ formData.request_data?.action_type || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Usuario de proceso</p>
      <p class="text-weight-medium no-margin">
        {{ formData.user_name || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Estado de proceso</p>
      <p class="text-weight-medium no-margin">
        {{ formData.status_name || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Periodo</p>
      <p class="text-weight-medium no-margin">
        {{ formData.period || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Fecha de cierre</p>
      <p class="text-weight-medium no-margin">
        {{ formData.request_data?.closure_date || '-' }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBudgetClosureProcessInfo } from '@/interfaces/customs/budget/BudgetClosure'

import useInformationForm from '@/components/Forms/Budget/BudgetClosure/v1/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{ action: ActionType; data: IBudgetClosureProcessInfo | null }>(),
  {}
)

const { formData } = useInformationForm(props)
</script>
