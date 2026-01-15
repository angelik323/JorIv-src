<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <section v-if="['edit'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de entrega"
            :default_value="models.delivery_date"
            required
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Fecha de entrega es requerida'),
            ]"
            @update:model-value="models.delivery_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de entrega</p>
            <p class="text-weight-medium no-margin">
              {{
                models.delivery_date ? models.delivery_date : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Documento del autorizado"
            :default_value="models.authorized_document"
            :manual_option="document_type"
            :auto_complete="true"
            placeholder="Seleccione"
            :required="true"
            :map_options="true"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Documento del autorizado es requerido'
                ),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.authorized_document = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Documento del autorizado</p>
            <p class="text-weight-medium no-margin">
              {{
                models.authorized_document
                  ? models.authorized_document
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Identificación autorizado"
            :default_value="models.authorized_identification"
            :manual_option="third_parties"
            :auto_complete="true"
            :required="true"
            placeholder="Seleccione"
            :map_options="true"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Identificación autorizado es requerido'
                ),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.authorized_identification = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Identificación autorizado</p>
            <p class="text-weight-medium no-margin">
              {{
                models.authorized_identification
                  ? models.authorized_identification
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Instrucciones"
            :default_value="models.instructions"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Instrucciones es requerido'),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.instructions = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Instrucciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.instructions ? models.instructions : 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section v-if="['view'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <p class="text-weight-bold text-black-90 mb-0">Creación</p>
          <p class="text-black-90 mb-3">
            {{ models.created_at ? models.created_at : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <p class="text-weight-bold text-black-90 mb-0">Creado por</p>
          <p class="text-black-90 mb-3">
            {{ models.created_by ? models.created_by : 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="my-20" />
      <p class="text-weight-bold text-black-90 size-18">Datos básicos</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">Cheque</p>
          <p class="text-black-90 mb-3">
            {{ models.check_number ? models.check_number : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">Estado</p>
          <p class="text-black-90 mb-3">
            {{ models.status?.name ? models.status?.name : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">Fecha de egreso</p>
          <p class="text-black-90 mb-3">
            {{ models.expense_date ? models.expense_date : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">NIT beneficiario</p>
          <p class="text-black-90 mb-3">
            {{
              models.beneficiary?.document
                ? models.beneficiary?.document
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Nombre beneficiario</p>
          <p class="text-black-90 mb-3">
            {{
              models.beneficiary?.name
                ? models.beneficiary?.name
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Valor</p>
          <p class="text-black-90 mb-3">
            {{
              models.value
                ? useUtils().formatCurrencyString(models.value, {
                    showCurrencySymbol: false,
                  })
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">
            Documento del autorizado
          </p>
          <p class="text-black-90 mb-3">
            {{
              models.authorized_by?.document_type
                ? models.authorized_by?.document_type
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">
            Identificación autorizado
          </p>
          <p class="text-black-90 mb-3">
            {{
              models.authorized_by?.document
                ? models.authorized_by?.document +
                  ' - ' +
                  models.authorized_by?.name
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Instrucciones</p>
          <p class="text-black-90 mb-3">
            {{ models.instructions ? models.instructions : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Fecha de entrega</p>
          <p class="text-black-90 mb-3">
            {{ models.delivery_date ? models.delivery_date : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Entregado</p>
          <p class="text-black-90 mb-3">
            {{ models.is_delivered ? 'Si' : 'No' }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Logic view
import useInformationForm from '@/components/Forms/Treasury/CheckDelivery/InformationForm/InformationForm'

// Utils
import { IIsinesCodesForm } from '@/interfaces/customs/investment-portfolio/IsinesCodes'
import { ActionType } from '@/interfaces/global'
import { useRules, useUtils } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IIsinesCodesForm | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { formElementRef, document_type, third_parties, models } =
  useInformationForm(props)
defineExpose({
  validateForm: () => formElementRef.value?.validate(),
  models,
})
</script>

<style lang="scss" scoped>
.size-18 {
  font-size: 1.13rem;
}
.my-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
