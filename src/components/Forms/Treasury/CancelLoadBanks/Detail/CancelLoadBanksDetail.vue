<template>
  <div v-if="!!banking_network_uploads_record.length">
    <VCard :customStyle="'padding: 24px 32px'" :showBorder="true">
      <template #content-card>
        <q-models>
          <section>
            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">Negocio</p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.business }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Nombre negocio
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.business_name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">Banco</p>
                <p class="text-grey-7 q-mt-xs q-mb-md">{{ infoModels.bank }}</p>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Nombre banco
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.bank_name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">Formato</p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.format }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Nombre formato
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.format_name }}
                </p>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Fecha cierre tesorería
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ formatDate(infoModels.closing_date, 'YYYY-MM-DD') }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Fecha cargue
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ formatDate(infoModels.upload_date, 'YYYY-MM-DD') }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Cuenta bancaria
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.bank_account }}
                </p>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Nombre cuenta bancaria
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.bank_account_name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Estado cargue
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.upload_status }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">Cargue Nro</p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.upload_number }}
                </p>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">Oficina</p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.office }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4">
                <p class="text-weight-medium mb-0 text-black-90">
                  Nombre oficina
                </p>
                <p class="text-grey-7 q-mt-xs q-mb-md">
                  {{ infoModels.office_name }}
                </p>
              </div>
            </div>
          </section>
        </q-models>
      </template>
    </VCard>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['status', 'select']"
      >
        <template #header-select>
          <div class="px-1 flex">
            <q-checkbox
              left-label
              label="Anular"
              size="sm"
              v-model="allSelected"
              color="orange"
            />
          </div>
        </template>
        <template #select="{ row }">
          <div class="px-1 flex justify-center">
            <q-checkbox
              size="sm"
              v-model="listRecords"
              :val="row.id"
              color="orange"
            />
          </div>
        </template>
        <template #status="{ row }">
          <q-badge
            :color="row.status.status === 'Aprobado' ? 'positive' : 'negative'"
            :label="row.status.status"
            outline
          />
        </template>
      </TableList>
    </section>

    <q-separator class="q-my-xl" />

    <section v-if="models.income_record_ids.length > 0">
      <p class="text-black-90 text-weight-bold text-h6 q-mb-md">
        Datos de anulación
      </p>

      <div class="row q-col-gutter-lg">
        <div class="col-md-6">
          <GenericDateInput
            label="Fecha de anulación"
            :default_value="models.annulate_date"
            :option_calendar="($e) => isDateAllowed($e, holidays)"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :required="true"
            :rules="[
            (val: string) => is_required(val, 'La fecha de anulación es requerida'),
            (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
          ]"
            @update:model-value="models.annulate_date = $event"
          />
        </div>
        <div class="col-md-6">
          <GenericInput
            label="Periodo"
            :default_value="models.annulate_period"
            :required="true"
            disabled
            :rules="[
            (val: string) => is_required(val, 'El período es requerido'),
          ]"
            @update:model-value="models.annulate_period = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-md-6">
          <GenericInput
            label="Vigencia"
            :default_value="models.vigency"
            :required="true"
            disabled
            :rules="[
            (val: string) => is_required(val, 'La vigencia es requerida'),
          ]"
            @update:model-value="null"
          />
        </div>
        <div class="col-md-6">
          <GenericSelectorComponent
            label="Causal de anulación"
            :default_value="models.annulate_code_id"
            :manual_option="treasury_cancellation_codes"
            map_options
            auto_complete
            :required="true"
            :rules="[
            (val: string) => is_required(val, 'El causal de anulación es requerido'),
          ]"
            @update:model-value="models.annulate_code_id = $event"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <GenericInput
          label="Observaciones"
          :default_value="models.annulate_observations"
          type="textarea"
          :required="true"
          :rules="[
          (val: string) => is_required(val, 'Las observaciones son requeridas'),
        ]"
          @update:model-value="models.annulate_observations = $event"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { IBankingNetworkUploadAnnulate } from '@/interfaces/customs/treasury/CancelLoadBanks'
import useCancelLoadBanksDetail from '@/components/Forms/Treasury/CancelLoadBanks/Detail/CancelLoadBanksDetail'

const props = withDefaults(
  defineProps<{
    data: IBankingNetworkUploadAnnulate | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IBankingNetworkUploadAnnulate | null): void
}>()

const {
  infoModels,
  tableProps,
  listRecords,
  models,
  holidays,
  treasury_cancellation_codes,
  banking_network_uploads_record,

  is_required,
  formatDate,
  valid_format_date,
  isDateAllowed,
  cleanDetailForm,
  allSelected,
} = useCancelLoadBanksDetail(props, emits)

defineExpose({
  cleanDetailForm,
})
</script>
