<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-xs-12 col-sm-6 col-md-1"
            v-if="'view'.includes(props.action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
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
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
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
              :rules="[(v: string) => useRules().is_required(v, 'El código es requerido')]"
              :disabled="!['create'].includes(action)"
            />
            <p v-else class="text-grey-7 mb-0">
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
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
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
              :placeholder="'Inserte'"
              :rules="[
                (v: string) => useRules().is_required(v, 'El nombre es requerido'),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 80),
                (v: string) => useRules().no_consecutive_spaces(v),
                (v: string) => useRules().only_alphanumeric(v),
              ]"
              @update:model-value="models.name = $event"
            />
            <p v-else class="text-grey-7 mb-0">
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
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
              "
            >
              Clase{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="voucher_type_types"
              :map_options="true"
              :required="true"
              :default_value="models.type"
              :auto_complete="true"
              @update:modelValue="models.type = $event"
              :rules="[(v: string) => useRules().is_required(v, 'La clase es requerida')]"
            />
            <p v-else class="text-grey-7 mb-0">
              {{ models.type ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-6"
            :class="'create'.includes(props.action) ? 'col-md-3' : 'col-md-2'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
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
              :rules="[(v: string) => useRules().is_required(v, 'El estado es requerido')]"
            />
            <p v-else class="text-grey-7 mb-0">
              <ShowStatus :type="Number(models?.status ?? 1)" />
            </p>
          </div>
        </div>
        <q-separator class="mt-1" />
      </div>
    </section>
  </q-form>

  <section class="q-mt-xs">
    <section class="mx-4 mb-4" :class="'q-pt-lg amounts-table'">
      <div class="q-mb-md row items-center">
        <p class="q-my-none text-weight-medium text-h5">
          {{ tableProps.title }}
        </p>

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
      </div>
      <q-form ref="subtypesForm">
        <Card>
          <template #content-card>
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
              class="q-mx-md"
              @update-page="updatePage"
              @update-rows-per-page="updateRows"
            >
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
                <div class="q-pa-sm flex items-center justify-center">
                  <SwitchComponent
                    v-if="['create', 'edit'].includes(action)"
                    :model-value="row.is_proof_cancellation"
                    @update:model-value="toggleProofCancellation(row, $event)"
                    :labelRight="row.is_proof_cancellation ? 'Si' : 'No'"
                    color="orange"
                    :disable="false"
                  />
                  <p v-else>
                    {{ row.is_proof_cancellation ? 'Si' : 'No' }}
                  </p>
                </div>
              </template>

              <template #proof_cancellation="{ row }">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  :map_options="true"
                  :manual_option="sub_receipt_types_voucher"
                  :required="!row.is_proof_cancellation"
                  :default_value="row.proof_cancellation"
                  auto_complete
                  :clearable="true"
                  :readonly="row.is_proof_cancellation"
                  @update:modelValue="row.proof_cancellation = $event"
                  :rules="row.is_proof_cancellation ? [] : [(v: string) => useRules().is_required(v)]"
                />
                <p v-else>
                  {{ row.proof_cancellation ?? 'No registrado' }}
                </p>
              </template>

              <template #proof_charge="{ row }">
                <div class="q-pa-sm flex items-center justify-center">
                  <SwitchComponent
                    v-if="['create', 'edit'].includes(action)"
                    :model-value="row.proof_charge"
                    @update:model-value="row.proof_charge = $event"
                    :labelRight="row.proof_charge ? 'Si' : 'No'"
                    color="orange"
                    :disable="false"
                  />
                  <p v-else>
                    {{ row.proof_charge ? 'Si' : 'No' }}
                  </p>
                </div>
              </template>

              <template #status_id="{ row }">
                <CustomToggle
                  v-if="['create', 'edit'].includes(action)"
                  :value="isRowActive(row.status_id)"
                  :width="100"
                  :height="30"
                  checked-text="Activo"
                  unchecked-text="Inactivo"
                  readonly
                  @click="changeStatusAction(row)"
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
          </template>
        </Card>
      </q-form>

      <section v-if="['edit'].includes(action)">
        <p class="text-weight-medium mb-0 text-grey-7">
          Observaciones{{ ['edit'].includes(action) ? '*' : '' }}
        </p>
        <GenericInput
          :required="['edit'].includes(action)"
          :disabled="'view'.includes(action)"
          :default_value="models.observation"
          :placeholder="'Ingrese las observaciones'"
          :type="'textarea'"
          :rules="['edit'].includes(action) ? [
            (v: string) => useRules().is_required(v, 'Las observaciones son requeridas'),
            (v: string) => useRules().min_length(v, 5),
            (v: string) => useRules().max_length(v, 100),
            (v: string) => useRules().no_consecutive_spaces(v),
          ] : []"
          @update:modelValue="models.observation = $event"
        />
      </section>

      <section v-if="['view'].includes(action) && models.observation">
        <p class="text-weight-bold mb-0 text-black-90">
          Observaciones{{ ['edit'].includes(action) ? '*' : '' }}
        </p>
        <p class="text-black-90">
          {{ models.observation }}
        </p>
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
import SwitchComponent from '@/components/common/Switch/SwitchComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Card from '@/components/common/VCard/VCard.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { ITypeAccountingAction } from '@/interfaces/customs'

// Utils
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITypeAccountingAction | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  status,
  tableProps,
  subtypesForm,
  formInformation,
  sub_receipt_types_voucher,
  voucher_type_types,
  updatePage,
  updateRows,
  addRowTable,
  isRowActive,
  validateForms,
  deleteRowTable,
  changeStatusAction,
  toggleProofCancellation,
} = useInformationForm(props)

defineExpose({
  validateForm: validateForms,
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
