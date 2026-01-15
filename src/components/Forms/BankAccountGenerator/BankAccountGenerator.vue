<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      flat
      bordered
      class="relative v-card-rounded q-py-lg q-px-xl generator-card"
    >
      <q-btn
        round
        flat
        icon="mdi-close"
        class="absolute-top-right q-ma-md q-mr-xl z-top"
        @click="closeModal"
      />

      <!-- Título y descripción -->
      <div
        class="text-start q-mt-xs q-mb-lg"
        :class="{
          'q-px-xl': $q.screen.gt.sm,
        }"
      >
        <h2 class="text-h6 text-dark text-bold q-my-none">
          {{
            isEditing
              ? 'Actualice cuenta bancaria'
              : 'Generador de cuenta bancaria'
          }}
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          {{
            isEditing
              ? 'Diligencie los campos para actualizar una cuenta bancaria'
              : 'Diligencie los campos para generar una cuenta bancaria'
          }}
        </p>
      </div>

      <!-- Formulario -->
      <q-form ref="formElementRef">
        <div class="row justify-center items-start q-col-gutter-md">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericSelectorComponent
              :default_value="formValues.bank_id ?? null"
              :manual_option="banks"
              label="Nombre del banco"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El nombre del banco es requerido.') 
              ]"
              @update:modelValue="formValues.bank_id = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericInputComponent
              label="Código del banco"
              disabled
              :default_value="formValues.bank_code"
              @update:model-value="formValues.bank_code = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericInputComponent
              label="Ciudad*"
              disabled
              :default_value="formValues.city"
              @update:model-value="formValues.city = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericSelectorComponent
              :default_value="formValues.branch"
              :manual_option="formValues.bank_id ? bank_branches.filter((branch: any) => branch.bank_id === formValues.bank_id) : []"
              label="Sucursal"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'La sucursal es requerido.') 
              ]"
              @update:modelValue="formValues.branch = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="formValues.type ?? null"
              :manual_option="bank_types"
              label="Tipo de cuenta"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de cuenta es requerida.')
              ]"
              @update:modelValue="formValues.type = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericInputComponent
              label="Número de cuenta"
              required
              :default_value="formValues.account_number ?? null"
              type="number"
              :rules="[
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val, 20),
                (val: string) => useRules().min_length(val, 6),
                (val: string) => /^(?!0+$).*$/.test(val) || 'El valor no puede ser solo ceros',
              ]"
              @update:model-value="formValues.account_number = $event"
            />
          </div>
        </div>

        <q-separator class="q-mb-lg" color="grey-2" />

        <div class="row justify-center q-gutter-sm q-mb-sm">
          <q-btn
            type="button"
            size="md"
            rounded
            flat
            no-caps
            color="grey-10"
            @click="closeModal"
            class="text-weight-bold q-px-lg q-py-sm"
          >
            Cancelar
          </q-btn>

          <q-btn
            size="md"
            rounded
            unelevated
            no-caps
            color="orange"
            class="custom q-px-lg q-py-sm"
            @click="onSubmit"
          >
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { IEmail } from '@/interfaces/customs/EmailGenerator'
import { ref, watch } from 'vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import { useBankAccountGenerator } from './BankAccountGenerator'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: ((val: any) => true | string)[]
    itemToEdit?: IEmail
    required?: boolean
  }>(),
  {
    isOpen: false,
    required: false,
  }
)

// Variables reactivas
const isModalOpen = ref(props.isOpen)
const formElementRef = ref()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save', item: any): void
}>()

const { formValues, isEditing, bank_branches, bank_types, banks, clearAll } =
  useBankAccountGenerator(props)

watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal
  }
)

const onSubmit = async () => {
  formElementRef.value.validate().then((success: boolean) => {
    if (!success) return

    const bank = banks.value.find((bank) => bank.value === formValues.bank_id)
    const branch = bank_branches.value.find(
      (bank) => bank.value === formValues.branch
    )

    if (isEditing.value) {
      // Actualizar
      emit('save', {
        id: props.itemToEdit?.id,
        bank_id: formValues.bank_id,
        bank_name: bank?.label,
        bank_code: formValues?.bank_code,
        branch: branch?.label,
        branch_id: formValues.branch,
        city: formValues.city,
        type: formValues.type,
        account_number: formValues.account_number,
      })
    } else {
      // Crear un nuevo registro
      emit('save', {
        ...formValues,
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      })
    }

    closeModal()
  })
}

const closeModal = () => {
  clearAll()
  isModalOpen.value = false
  emit('update:isOpen', false)
}
</script>

<style scoped lang="scss">
.generator-card {
  width: 730px;
  max-width: 90vw;
}
</style>
