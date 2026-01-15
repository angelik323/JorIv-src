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
              ? 'Actualice actividad económica'
              : 'Generador de actividad económica'
          }}
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          {{
            isEditing
              ? 'Diligencie los campos para actualizar una actividad'
              : 'Diligencie los campos para generar una actividad'
          }}
        </p>
      </div>

      <!-- Formulario -->
      <q-form @submit.prevent="onSubmit" ref="formElementRef">
        <div class="row justify-center items-start q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <GenericSelectorComponent
              :default_value="formValues.ciiu?.id"
              return_object
              :manual_option="ciius"
              label="Actividad Económica (Código CIIU)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: any) => !!val || 'La actividad económica es requerida']"
              :placeholder="isLoading ? 'Cargando...' : 'Seleccionar'"
              @update:modelValue="
                (val: any) => {
                  formValues.ciiu = val
                    ? { id: val.value, name: val.label, code: val.code }
                    : undefined
                }
              "
            />
          </div>

          <div class="col-12 col-sm-6">
            <GenericSelectorComponent
              :default_value="formValues.city?.id"
              return_object
              :manual_option="cities"
              label="Ciudad"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: any) => !!val || 'La ciudad es requerida']"
              :placeholder="isLoading ? 'Cargando...' : 'Seleccionar'"
              @update:modelValue="
                (val: any) => {
                  formValues.city = val
                    ? { id: val.value, name: val.label }
                    : undefined
                }
              "
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
import { IEconActivity } from '@/interfaces/global/ThirdParties'
import { ValidationRule } from 'quasar'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useResourceStore } from '@/stores'
import { useEconActivityGenerator } from './EconActivityGenerator'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: ValidationRule[]
    itemToEdit?: IEconActivity
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
  (e: 'save', item: IEconActivity): void
}>()

const { ciius, cities } = storeToRefs(useResourceStore('v1'))
const { formValues, isEditing, isLoading, clearAll } =
  useEconActivityGenerator(props)

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
  width: 820px;
  max-width: 90vw;
}
</style>
