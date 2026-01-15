<template>
  <q-form ref="BankContactsBasicDataRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos de la entidad bancaria asociada
        </p>
      </div>

      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-lg">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código bancario{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              disabled
              :default_value="models.bank_code"
              @update:modelValue="models.bank_code = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ models.bank_code ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium ellipsis mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre de la entidad bancaria{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              disabled
              :default_value="models.description"
              :placeholder="'Ingrese el nombre'"
              @update:modelValue="models.description = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              disabled
              :default_value="models.status === 1 ? 'Activo' : 'Inactivo'"
              @update:modelValue="models.status = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.status === 1
                  ? 'Activo'
                  : models.status === 2
                    ? 'Inactivo'
                    : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos de los contactos bancarios
        </p>
      </div>

      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-lg">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre completo{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.full_name"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
                (v: string) => useRules().no_special_characters_extended(v),
                (v: string) => useRules().min_length(v, 3),
                (v: string) => useRules().max_length(v, 60),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:model-value="updateModelValue('full_name', $event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.full_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.job_title"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
                (v: string) => useRules().no_special_characters_extended(v),
                (v: string) => useRules().min_length(v, 3),
                (v: string) => useRules().max_length(v, 60),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:model-value="updateModelValue('job_title', $event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.job_title ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Área
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.area"
              :rules="[
                (v: string) => useRules().no_special_characters_extended(v),
                (v: string) => useRules().email_min_length(v, 3),
                (v: string) => useRules().max_length(v, 60),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:model-value="updateModelValue('area', $event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.area ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Sucursal bancaria
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_branch_id"
              :manual_option="bank_branches_contacts"
              :auto_complete="true"
              required
              :map_options="true"
              :rules="[]"
              @update:model-value="models.bank_branch_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                getBankBranchLabel(models.bank_branch_id ?? null) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos de contacto
        </p>
      </div>

      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-lg">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Teléfono fijo
            </p>
            <PhoneInput
              v-if="['create', 'edit'].includes(action)"
              ref="landlinePhone"
              :default_value="models.landline_phone ?? ''"
              country_validation
              :required="
                !!models.landline_phone?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)
              "
              @update:model-value="
                (val: string) => (models.landline_phone = val)
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.landline_phone || 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium ellipsis mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Número de celular
            </p>
            <PhoneInput
              v-if="['create', 'edit'].includes(action)"
              ref="mobilePhone"
              :rules="
                models.mobile_phone?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)
                  ? [(v: string) => useRules().starts_with(v, '3')]
                  : []
              "
              :default_value="models.mobile_phone ?? ''"
              :required="
                !!models.mobile_phone?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)
              "
              @update:model-value="(val: string) => (models.mobile_phone = val)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.mobile_phone ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Correo electrónico
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.email"
              :required="true"
              :rules="[
                (v: string) => useRules().email_validation(v),
                (v: string) => useRules().email_no_accents(v),
                (v: string) => useRules().email_no_invalid_characters(v),
                (v: string) => useRules().email_no_consecutive_specials(v),
                (v: string) => useRules().email_min_length(v, 5),
                (v: string) => useRules().email_max_length(v, 254),
              ]"
              @update:model-value="models.email = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.email ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium ellipsis mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Canal de contacto preferido
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.preferred_contact_channel"
              :manual_option="channel"
              required
              :map_options="true"
              :rules="[]"
              @update:model-value="models.preferred_contact_channel = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.preferred_contact_channel ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'view'].includes(action) ? 'col-md-3' : 'col-md-12'
            "
            v-if="['edit', 'view'].includes(action)"
          >
            <p
              class="text-weight-medium ellipsis mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado
            </p>
            <GenericSelectorComponent
              v-if="['edit'].includes(action)"
              :default_value="models.status_id"
              :manual_option="statusBankContacts"
              :required="action === 'edit'"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.status_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.status_id === 1 ? 'Activo' : 'Inactivo' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información adicional
        </p>
      </div>
      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Productos
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.products"
              :rules="[
                (v: string) => useRules().no_special_characters_extended(v),
                (v: string) => useRules().min_length(v, 3),
                (v: string) => useRules().max_length(v, 60),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:model-value="updateModelValue('products', $event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.products || 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Días laborables
              {{
                ['create', 'edit'].includes(action) &&
                (models.available_from || models.available_to)
                  ? '*'
                  : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.working_days"
              :manual_option="days"
              :required="Boolean(models.available_from || models.available_to)"
              :map_options="true"
              multiple
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="models.working_days = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.working_days && models.working_days.length > 0
                  ? models.working_days
                  : 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Horario desde
              {{
                ['create', 'edit'].includes(action) &&
                (models.working_days?.length ?? 0) > 0
                  ? '*'
                  : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              ref="schedule_from_input"
              :default_value="models.available_from"
              :manual_option="available"
              :required="Boolean((models.working_days?.length ?? 0) > 0)"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.available_from = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.available_from || 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Horario hasta
              {{
                ['create', 'edit'].includes(action) &&
                (models.working_days?.length ?? 0) > 0
                  ? '*'
                  : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              ref="schedule_to_input"
              :default_value="models.available_to"
              :manual_option="filteredAvailableTo"
              :required="Boolean((models.working_days?.length ?? 0) > 0)"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.available_to = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.available_to || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import useBankContactsBasicData from '@/components/Forms/Treasury/BankContacts/information/BankContactsBasicData'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
    bankBrancheId?: number | null
  }>(),
  {}
)

defineExpose({
  validateForm: () => BankContactsBasicDataRef.value?.validate(),
})

const {
  BankContactsBasicDataRef,
  models,
  bank_branches_contacts,
  channel,
  days,
  available,
  statusBankContacts,
  filteredAvailableTo,
  schedule_from_input,
  schedule_to_input,
  landlinePhone,
  mobilePhone,
  updateModelValue,
  getBankBranchLabel,
} = useBankContactsBasicData(props)
</script>
