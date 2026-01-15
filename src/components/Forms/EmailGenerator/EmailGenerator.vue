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
      <div class="text-start q-mt-xs q-mb-lg">
        <h2 class="text-h6 text-dark text-bold q-my-none">
          {{
            isEditing
              ? 'Actualice correo electrónico'
              : 'Generador de correo electrónico'
          }}
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          {{
            isEditing
              ? 'Diligencie los campos para actualizar un correo electrónico'
              : 'Diligencie los campos para generar un correo electrónico'
          }}
        </p>
      </div>

      <!-- Formulario -->
      <q-form @submit.prevent="onSubmit" ref="formElementRef">
        <div class="row justify-center items-center q-col-gutter-x-md">
          <div class="col-12">
            <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
              Correo electrónico*
            </p>

            <q-input
              name="email"
              outlined
              v-model="formValues.email"
              dense
              type="text"
              placeholder="Inserte"
              clearable
              required
              :rules="[
                (val) => useRules().email_validation(val),
                (val) => useRules().max_length(val, 254),
              ]"
              @keypress.enter.prevent="onSubmit"
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
import { IEmail } from '@/interfaces/customs/EmailGenerator'
import { ValidationRule } from 'quasar'
import { ref, watch } from 'vue'
import { useEmailGenerator } from './EmailGenerator'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: ValidationRule[]
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
  (e: 'save', item: IEmail): void
}>()

const { formValues, isEditing, clearAll } = useEmailGenerator(props)

watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal
  }
)

const onSubmit = async () => {
  formElementRef.value.validate().then((success: boolean) => {
    if (!success) return

    if (isEditing.value) {
      // Actualizar
      emit('save', { ...formValues, id: props.itemToEdit?.id })
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
  width: 640px;
  max-width: 90vw;
}
</style>
