<template>
  <q-form ref="informationFormRef">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12 col-md-6">
        <GenericInput
          v-if="['create', 'edit'].includes(action)"
          label="Código"
          :default_value="models.code"
          type="number"
          :required="true"
          :rules="[
                (val: string) => is_required(val, 'El código es requerido'),
                (val: string) => only_number(val),
                (val: string) => max_length(val, 4),
                (val: string) => min_length(val, 1),
              ]"
          @update:model-value="models.code = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Código</p>
          <p class="text-weight-medium no-margin">
            {{ models.code ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <GenericInput
          v-if="['create', 'edit'].includes(action)"
          label="Descripción"
          :default_value="models.description"
          :required="true"
          :rules="[
                (val: string) => is_required(val, 'La descripción es requerida'),
                (val: string) => only_alphanumeric(val),
                (val: string) => max_length(val, 150),
                (val: string) => min_length(val, 2),
              ]"
          @update:model-value="updateUpperCase('description', $event)"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Descripción</p>
          <p class="text-weight-medium no-margin">
            {{ models.description ?? 'No registrado' }}
          </p>
        </div>
      </div>
    </div>

    <q-separator class="q-mt-lg q-mb-md" />

    <section v-if="['create', 'view', 'edit'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <p class="col-12 text-black-90 text-h6 text-weight-bold q-mt-md">
          Parámetros de movimiento
        </p>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de movimiento"
            :default_value="models.movement_type_id"
            :manual_option="movement_types_movement_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El tipo de movimiento es requerido')]"
            @update:model-value="models.movement_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de movimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_type_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Clase de movimiento"
            :default_value="models.movement_class_id"
            :manual_option="classlist"
            :auto_complete="true"
            :required="true"
            :disabled="classlist.length === 0"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La clase de movimiento es requerida')]"
            @update:model-value="models.movement_class_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de movimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_class_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Naturaleza de movimiento"
            :default_value="models.movement_nature_id"
            :manual_option="movement_nature_movement_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La naturaleza de movimiento es requerida')]"
            @update:model-value="models.movement_nature_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Naturaleza de movimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_nature_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Grupo de movimiento"
            :default_value="models.movement_group_id"
            :manual_option="movement_group_movement_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="!isMovementGroupDisabled"
            :rules="[(val: string) => is_required(val, 'El grupo de movimiento es requerido')]"
            @update:model-value="models.movement_group_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Grupo de movimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_group_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Movimiento anulación"
            :default_value="models.annulment_movement"
            type="number"
            :required="false"
            :rules="[]"
            @update:model-value="models.annulment_movement = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Movimiento anulación</p>
            <p class="text-weight-medium no-margin">
              {{ models.annulment_movement ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Movimiento inmobiliario"
            :default_value="models.real_estate_movement"
            type="number"
            :required="false"
            :rules="[]"
            @update:model-value="models.real_estate_movement = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Movimiento inmobiliario</p>
            <p class="text-weight-medium no-margin">
              {{ models.real_estate_movement ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-mt-lg q-mb-md" />

    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <p class="text-black-90 text-weight-bold col-12 q-mt-md text-h6">
        {{
          ['view'].includes(action)
            ? 'Información de gravamenes'
            : 'Contabilidad, clase y módulo'
        }}
      </p>

      <div
        class="row items-center justify-between col-12"
        :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
      >
        <p
          class="mb-0"
          :class="['view'].includes(action) ? 'col-12 text-weight-bold' : ''"
        >
          Genera contabilidad{{
            ['create', 'edit'].includes(action) ? '*' : ''
          }}
        </p>

        <div>
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="models.generate_accounting"
            :required="true"
            :isRadioButton="true"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="false"
          />
          <p v-else class="mb-0 text-black-90">
            {{ models.generate_accounting ? 'Si' : 'No' }}
          </p>
        </div>
      </div>

      <div v-if="['view'].includes(action)" class="col-4 text-black-90">
        <p class="text-weight-bold no-margin">Clase de operación</p>
        <p class="text-weight-medium no-margin">
          {{ models.operation_class ?? 'No registrado' }}
        </p>
      </div>

      <div v-if="['view'].includes(action)" class="col-4 text-black-90">
        <p class="text-weight-bold no-margin">Módulo que origina</p>
        <p class="text-weight-medium no-margin">
          {{ models.origin_module_description ?? 'No registrado' }}
        </p>
      </div>
    </div>

    <q-separator v-if="['create', 'edit'].includes(action)" class="q-my-md" />

    <section v-if="['create', 'edit'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Clase de operación"
            :default_value="models.operation_class"
            :manual_option="operation_class"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[
                (val: string) => is_required(val, 'La clase de operación es requerida'),
              ]"
            @update:model-value="models.operation_class = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Módulo que origina"
            :default_value="models.origin_module_id"
            :manual_option="origin_module_movement_codes"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.origin_module_id = $event"
          />
        </div>
      </div>
    </section>

    <q-separator class="q-mt-lg q-mb-md" />

    <section v-if="['create', 'view', 'edit'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <p class="text-black-90 text-weight-bold col-12 q-mt-md text-h6">
          Códigos y base de retención
        </p>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código consolidado"
            :default_value="models.consolidated_code"
            type="number"
            :required="!isCodesDisabled"
            :disabled="!isCodesDisabled"
            :rules="[
                (val: string) => only_number(val),
                (val: string) => max_length(val, 4),
                (val: string) => min_length(val, 1),
              ]"
            @update:model-value="models.consolidated_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código consolidado</p>
            <p class="text-weight-medium no-margin">
              {{ models.consolidated_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código distribución"
            :default_value="models.distribution_code"
            type="number"
            :required="!isCodesDisabled"
            :disabled="!isCodesDisabled"
            :rules="[
                (val: string) => only_number(val),
                (val: string) => max_length(val, 4),
                (val: string) => min_length(val, 1),
              ]"
            @update:model-value="models.distribution_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código distribución</p>
            <p class="text-weight-medium no-margin">
              {{ models.distribution_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Base de retención"
            :default_value="models.withholding_base"
            :required="isRetentionBaseDisabled"
            :rules="withholdingBaseRules"
            @update:model-value="models.withholding_base = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Base de retención</p>
            <p class="text-weight-medium no-margin">
              {{
                models.withholding_base
                  ? models.withholding_base + '%'
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-mt-lg q-mb-md" />
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { PropsInformationForm } from '@/interfaces/customs/fics/MovementCodes'

// Logic view
import useInformationForm from '@/components/Forms/Fics/MovementCodes/Information/InformationForm'

const props = withDefaults(defineProps<PropsInformationForm>(), {})

const {
  models,
  informationFormRef,

  movement_types_movement_codes,
  movement_nature_movement_codes,
  movement_group_movement_codes,
  operation_class,
  origin_module_movement_codes,
  classlist,

  is_required,
  max_length,
  min_length,
  only_number,
  only_alphanumeric,
  updateUpperCase,
  isMovementGroupDisabled,
  isCodesDisabled,
  withholdingBaseRules,
  isRetentionBaseDisabled,
} = useInformationForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
