<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-xs-12 col-sm-6 col-md-3"
            v-if="'view'.includes(props.action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              #
            </p>

            {{ models.id ?? 'No registrado' }}
          </div>

          <div
            class="col-xs-12 col-sm-6"
            :class="'create'.includes(props.action) ? 'col-md-4' : 'col-md-3'"
            v-if="!'create'.includes(props.action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código de comprobante{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="[]"
              :map_options="true"
              :required="false"
              :default_value="models.code"
              :auto_complete="true"
              @update:modelValue="models.code = $event"
              :rules="[(val: string) => !!val || 'El código es requerido']"
              :disabled="!['create'].includes(action)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-6"
            :class="'create'.includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre de comprobante{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.name"
              :placeholder="''"
              :rules="[
                (v: string) => !!v || 'El nombre es requerido',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 80 || 'Debe contener como máximo 80 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
                (v: string) => /^[ A-Za-zÀ-ÖØ-öø-ÿ0-9]*$/.test(v) || 'Debe de tener solo letras y numeros',
              ]"
              @update:modelValue="models.name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-6"
            :class="'create'.includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create'].includes(action)"
              :manual_option="status.filter((item) => item.value !== 0)"
              :map_options="true"
              :required="true"
              :default_value="models.status"
              :auto_complete="true"
              @update:modelValue="models.status = $event"
              :rules="[(val: string) => !!val || 'El estado es requerido']"
              :disabled="!['create'].includes(action)"
            />
            <p v-else class="text-grey-6 mb-0">
              <ShowStatus :type="Number(models?.status ?? 1)" />
            </p>
          </div>
        </div>
        <q-separator class="mt-1" />
      </div>
    </section>
  </q-form>

  <section class="q-mt-xl">
    <section class="mx-4 mb-4" :class="'q-pt-lg amounts-table'">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="[
          'actions',
          'status_id',
          'name',
          'is_proof_cancellation',
          'proof_cancellation',
          'proof_charge',
        ]"
        :row-key="'_uid'"
      >
        <template #custom-header>
          <div>
            <p class="q-my-none text-weight-medium text-h5">
              {{ tableProps.title }}
            </p>
          </div>
          <q-space />

          <Button
            v-if="!['view'].includes(props.action)"
            no-caps
            unelevated
            :label="'Agregar'"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="addRowTable"
          />
        </template>

        <template #name="{ row }">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :required="true"
            :default_value="row.name"
            @update:modelValue="row.name = $event"
            :rules="[
                (v: string) => useRules().is_required(v, 'El nombre es requerido'),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 80),
                (v: string) => useRules().only_alphanumeric(v),
                (v: string) => useRules().no_consecutive_spaces(v)
              ]"
          />

          <p v-else>
            {{ row.name ?? 'No registrado' }}
          </p>
        </template>

        <template #is_proof_cancellation="{ row }">
          <div class="q-pa-sm">
            <q-checkbox
              v-if="['create', 'edit'].includes(action)"
              dense
              :model-value="row.is_proof_cancellation"
              color="orange"
              @update:modelValue="row.is_proof_cancellation = $event"
            />
            <p v-else>
              {{ row.is_proof_cancellation ? 'Si' : 'No' }}
            </p>
          </div>
        </template>

        <template #proof_cancellation="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="sub_receipt_types"
            :map_options="true"
            :required="!row.is_proof_cancellation"
            :default_value="row.proof_cancellation"
            :auto_complete="false"
            :clearable="true"
            :disabled="['view'].includes(action) || row.is_proof_cancellation"
            @update:modelValue="row.proof_cancellation = $event"
            :rules="row.is_proof_cancellation ? [] : [(v: string) => useRules().is_required(v)]"
          />
          <p v-else>
            {{ row.proof_cancellation ?? 'No registrado' }}
          </p>
        </template>

        <template #proof_charge="{ row }">
          <div class="q-pa-sm">
            <q-checkbox
              v-if="['create', 'edit'].includes(action)"
              dense
              :model-value="row.proof_charge"
              color="orange"
              @update:modelValue="row.proof_charge = $event"
            />
            <p v-else>
              {{ row.proof_charge ? 'Si' : 'No' }}
            </p>
          </div>
        </template>

        <template #status_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="status.filter((item) => item.value !== 0)"
            :map_options="true"
            :required="true"
            :default_value="row.status_id"
            :auto_complete="false"
            :clearable="false"
            @update:modelValue="row.status_id = $event"
            :rules="[(v: string) => useRules().is_required(v)]"
          />

          <div class="q-pa-md" v-else>
            <ShowStatus :type="Number(row.status_id ?? 1)" />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="deleteRowTable(row)"
          />
        </template>
      </TableList>

      <section v-if="['edit', 'view'].includes(action)">
        <p
          class="text-weight-medium mb-0"
          :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
        >
          Observaciones{{ ['edit'].includes(action) ? '*' : '' }}
        </p>
        <GenericInput
          :required="['edit'].includes(action)"
          :disabled="'view'.includes(action)"
          :default_value="models.observation"
          :placeholder="'Ingrese las observaciones'"
          :type="'textarea'"
          :rules="['edit'].includes(action) ? [
                (v: string) => !!v || 'Las observaciones son requeridas',
                (v: string) => v.length >= 5 || 'Debe contener al menos 5 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ] : []"
          @update:modelValue="models.observation = $event"
        />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { ITypeAccountingAction } from '@/interfaces/customs'

// Utils
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ITypeAccountingAction | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  tableProps,
  sub_receipt_types,
  status,
  addRowTable,
  deleteRowTable,
} = useInformationForm(props)

defineExpose({
  validateForm: async () => {
    const isFormValid = await formInformation.value?.validate()

    const isTableValid = tableProps.value.rows.every((row) => {
      const rules = useRules()

      const validations = [
        rules.is_required(row.name, 'El nombre es requerido'),
        rules.min_length(row.name, 2),
        rules.max_length(row.name, 80),
        rules.only_alphanumeric(row.name),
        rules.no_consecutive_spaces(row.name),
      ]

      if (row.is_proof_cancellation) {
        validations.push(
          rules.is_required(
            row.proof_cancellation as string,
            'El comprobante de anulación es requerido'
          )
        )
      }

      validations.push(
        rules.is_required(String(row.status_id), 'La naturaleza es requerida')
      )

      return validations.every((result) => result === true)
    })

    return isFormValid && isTableValid
  },
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
