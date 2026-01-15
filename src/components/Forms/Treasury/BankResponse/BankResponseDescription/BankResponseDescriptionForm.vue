<template>
  <section class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Negocio</p>
        <p class="text-weight-medium no-margin">
          {{
            bank_response_description_form?.business?.name || 'No registrado'
          }}
        </p>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Estado grupo</p>
        <p class="text-weight-medium no-margin">
          {{
            bank_response_description_form?.dispersion_group?.status?.status ||
            'No registrado'
          }}
        </p>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Valor grupo</p>
        <p class="text-weight-medium no-margin">
          {{
            bank_response_description_form?.dispersion_group?.value ||
            'No registrado'
          }}
        </p>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Banco</p>
        <p class="text-weight-medium no-margin">
          {{ bank_response_description_form?.bank?.code || 'No registrado' }} -
          {{
            bank_response_description_form?.bank?.description || 'No registrado'
          }}
        </p>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{
            bank_response_description_form?.bank_account?.account_number ||
            'No registrado'
          }}
          -
          {{
            bank_response_description_form?.bank_account?.account_name ||
            'No registrado'
          }}
        </p>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Tercero</p>
        <p class="text-weight-medium no-margin">
          {{
            bank_response_description_form?.third_party?.document ||
            'No registrado'
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import useBankResponseDescriptionForm from './BankResponseDescriptionForm'

defineEmits<{
  (e: 'close:modal'): void
}>()

const { bank_response_description_form } = useBankResponseDescriptionForm()
</script>
