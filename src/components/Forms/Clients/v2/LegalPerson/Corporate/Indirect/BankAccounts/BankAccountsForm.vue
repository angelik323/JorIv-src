<template>
  <q-expansion-item
    :model-value="isExpanded"
    expand-icon-class="text-primary_fiduciaria"
    @update:model-value="$emit('update:expanded', $event)"
  >
    <template v-slot:header>
      <q-item-section>
        <span class="text-black-90 text-weight-bold text-h6">
          Cuentas bancarias
        </span>
      </q-item-section>

      <q-item-section side>
        <Button
          v-if="action !== 'view'"
          label="Crear"
          :outline="false"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          stop-propagation
          :disabled="false"
          @click="handleTableOptions('create')"
        />
      </q-item-section>
    </template>

    <VCard class="q-pa-lg q-mt-sm" style="margin-bottom: 0">
      <template #content-card>
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :custom-columns="
            ['create', 'edit'].includes(action)
              ? ['bre-b', 'status', 'actions']
              : ['bre-b', 'status']
          "
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template #custom-header>
            <span class="q-table__title text-black-90">
              {{ tableProperties.title }}
            </span>
          </template>

          <template #bre-b="{ row }">
            <q-checkbox
              :model-value="row.is_breb_key"
              color="orange"
              disabled
            />
          </template>

          <template #status="{ row }">
            <CustomToggle
              v-if="action !== 'view'"
              :value="isRowActive(row.status)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
            />
            <ShowStatus v-else :type="Number(row.status) || 0" />
          </template>

          <template v-if="action !== 'view'" #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleTableOptions('edit', row)"
            />

            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete(row)"
            />
          </template>

          <template #custom-no-data>
            <div class="column justify-center items-center">
              <img
                src="@/assets/images/icons/no_data_accounting.svg"
                alt="Actualmente no hay registros"
                width="180px"
              />
              <div class="q-mt-lg text-black text-center">
                <p class="text-weight-bold text-h6 q-mb-xs">
                  Actualmente no hay registros
                </p>
                <p class="text-weight-medium">
                  Por favor, agregue uno para continuar con el proceso
                </p>
              </div>
            </div>
          </template>
        </TableList>
      </template>
    </VCard>
  </q-expansion-item>

  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      class="relative v-card-rounded q-px-xl q-py-lg generator-card"
      flat
      bordered
    >
      <Button
        class-custom="custom absolute-top-right q-ma-md z-top q-pa-sm"
        color="black"
        flat
        :outline="false"
        :left-icon="defaultIconsLucide.close"
        colorIcon="black"
        aria-label="Cerrar modal"
        @click="isModalOpen = false"
      />

      <div class="q-mt-xs q-mb-md">
        <span class="text-h6 text-black-90 text-weight-bold">
          {{ modalConfig.title }}
        </span>
      </div>

      <q-form
        ref="formElementRef"
        aria-label="Formulario para actividad económica"
      >
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pt-sm">
          <div class="col-12 col-md-6">
            <q-checkbox
              v-model="models.is_breb_key"
              class="q-py-md"
              label="Clave Bre-b"
              color="orange"
              dense
              left-label
            />
          </div>
          <template v-if="models.is_breb_key">
            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="models.email"
                label="Correo electrónico"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El correo electrónico es requerido'),
                  (val: string) => useRules().email_no_consecutive_specials(val),
                  (val: string) => useRules().email_no_invalid_characters(val),
                  (val: string) => useRules().email_max_length(val, 254),
                  (val: string) => useRules().email_min_length(val, 5),
                  (val: string) => useRules().email_no_accents(val),
                  (val: string) => useRules().email_validation(val),
                ]"
                @update:model-value="models.email = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="models.identification_number"
                label="Número de identificación"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El número de identificación es requerido'),
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 20),
                ]"
                @update:model-value="models.identification_number = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <p
                class="text-black-50 text-weight-medium break-word q-ml-sm q-mb-none"
              >
                Celular*
              </p>
              <PhoneInput
                :default_value="models.mobile_number ?? ''"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El número de celular es requerido') 
                ]"
                @update:model-value="models.mobile_number = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="models.breb_key"
                label="Llave"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'La llave es requerida'),
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 20),
                ]"
                @update:model-value="models.breb_key = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="models.breb_keyword"
                label="Clave"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'La clave es requerida'),
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 254),
                ]"
                @update:model-value="models.breb_keyword = $event"
              />
            </div>
          </template>

          <template v-else>
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :default_value="models.bank"
                label="Banco"
                auto_complete
                return_object
                map_options
                :manual_option="banks"
                required
                :disabled="action === 'edit'"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El banco es requerido'),
                ]"
                @update:model-value="
                  (val) => {
                    models.bank = val?.value || null
                    models.bank_name = val?.label || null
                  }
                "
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :default_value="models.account_type"
                label="Tipo de cuenta"
                auto_complete
                map_options
                :manual_option="bank_types"
                required
                :disabled="action === 'edit'"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El tipo de cuenta es requerido'),
                ]"
                @update:model-value="models.account_type = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="models.bank_account_number"
                label="Número de cuenta bancaria"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El número de cuenta es requerido'),
                  (val: string) => useRules().only_number(val),
                  (val: string) => useRules().only_positive_number(val),
                  (val: string) => useRules().min_length(val, 5),
                  (val: string) => useRules().max_length(val, 16), 
                ]"
                @update:model-value="models.bank_account_number = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :default_value="models.branch"
                label="Sucursal"
                auto_complete
                return_object
                map_options
                :manual_option="banks"
                :disabled="action === 'edit'"
                :required="false"
                :rules="[]"
                @update:model-value="
                  (val) => {
                    models.branch = val?.value ?? null
                    models.branch_name = val?.label ?? null
                  }
                "
              />
            </div>
          </template>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="models.status"
              label="Estado"
              auto_complete
              map_options
              :manual_option="default_statuses"
              required
              :disabled="modalConfig.action !== 'edit'"
              :rules="[
                (val: string) => useRules().is_required(val, 'El estado es requerido'),
              ]"
              @update:model-value="models.status = $event"
            />
          </div>

          <div class="col-12 col-md-6 flex items-center">
            <q-checkbox
              v-model="models.is_bank_account_primary"
              class="q-py-md"
              label="¿Cuenta principal?"
              color="orange"
              dense
              left-label
            />
          </div>
        </div>

        <q-separator class="q-mt-sm" />

        <div class="q-mt-lg q-mb-xs flex flex-center" style="gap: 8px">
          <Button
            class="custom"
            label="Cancelar"
            color="orange"
            size="md"
            no-caps
            unelevated
            outline
            :styleContent="{ color: 'black' }"
            @click="isModalOpen = false"
          />

          <Button
            class="custom"
            :label="modalConfig.btnText"
            color="orange"
            size="md"
            no-caps
            unelevated
            :outline="false"
            @click="onSave"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { IBankAccountCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useBankAccountsForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Indirect/BankAccounts/BankAccountsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IBankAccountCorporateForm[]
    isExpanded?: boolean
  }>(),
  {
    isExpanded: true,
  }
)

const emits = defineEmits<{
  (e: 'update:data', value: IBankAccountCorporateForm[]): void
  (e: 'update:expanded', value: boolean): void
}>()

const {
  default_statuses,
  banks,
  bank_types,
  defaultIconsLucide,
  formElementRef,
  models,
  isModalOpen,
  modalConfig,
  tableProperties,
  isRowActive,
  handleTableOptions,
  handleDelete,
  onSave,
} = useBankAccountsForm(props, emits)
</script>

<style scoped lang="scss">
.generator-card {
  width: 820px;
  max-width: 90vw;
  border-radius: 15px !important;
}

:deep(.q-table__title) {
  font-size: 1.125rem !important;
  font-weight: bold !important;
}
</style>
