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
              ? 'Actualice número de teléfono'
              : 'Generador de número de teléfono'
          }}
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          {{
            isEditing
              ? 'Diligencie los campos para actualizar un teléfono'
              : 'Diligencie los campos para generar un teléfono'
          }}
        </p>
      </div>

      <!-- Número generado -->
      <q-form @submit.prevent="onSubmit" ref="generatedPhoneForm">
        <div class="row justify-center items-center q-col-gutter-x-md">
          <div class="col-12 col-sm-6">
            <GenericSelectorComponent
              :default_value="formValues.type?.id ?? null"
              return_object
              :manual_option="phone_types"
              label="Tipo de teléfono*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :clearable="false"
              :map_options="true"
              :rules="[(val: any) => !!val || 'El tipo de número es requerido']"
              @update:modelValue="
                (val: any) =>  {
                  formValues.number = ''
                  formValues.type = val.value
                    ? { id: val.value, name: val.label }
                    : undefined
                }
              "
            />
          </div>

          <div class="col-12 col-sm-6">
            <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
              Número de
              {{ formValues.type?.id === 'fixed' ? 'teléfono' : 'celular' }}*
            </p>

            <GenericInputComponent
              v-if="formValues.type?.id === 'fixed'"
              :default_value="formValues.number"
              type="number"
              required
              :rules="[(val: any) => validateNumericMessage(val, 10)]"
            />
            <PhoneInput
              v-if="formValues.type?.id === 'mobile'"
              @update:model-value="formValues.number = $event"
              :rules="[
                  (v: string) => useRules().is_required(v, 'El número de celular es requerido'),
                ]"
              :default_value="formValues.number ?? ''"
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
            type="submit"
            size="md"
            rounded
            unelevated
            no-caps
            color="orange"
            class="custom q-px-lg q-py-sm"
          >
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { IPhoneNumber } from '@/interfaces/customs/phoneNumberGenerator'
import { ValidationRule } from 'quasar'
import { ref, watch } from 'vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import { useValidator, useRules } from '@/composables'
import { usePhoneNumberGenerator } from './PhoneNumberGenerator'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

const { validateNumericMessage } = useValidator()

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: ValidationRule[]
    phoneNumberToEdit?: IPhoneNumber
    required?: boolean
  }>(),
  {
    isOpen: false,
    required: false,
  }
)

// Variables reactivas
const isModalOpen = ref(props.isOpen)
const generatedPhoneForm = ref()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save', phoneNumber: IPhoneNumber): void
}>()

const { formValues, isEditing, phone_types, clearAll } =
  usePhoneNumberGenerator(props)

watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal
  }
)

const onSubmit = async () => {
  generatedPhoneForm.value.validate().then((success: boolean) => {
    if (!success) return

    if (isEditing.value) {
      // Actualizar número
      emit('save', { ...formValues, id: props.phoneNumberToEdit?.id })
    } else {
      // Crear un nuevo número
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
  width: 830px;
  max-width: 90vw;
}
</style>
