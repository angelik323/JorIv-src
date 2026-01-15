<template>
  <article>
    <section>
      <q-form ref="basicDataFormRef" class="mx-3 mt-3 mb-3 row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Código{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>

          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.code"
            :rules=" [ 
              (v: string) => !!v || 'El código es requerido',
              (v: string) => /^[A-Za-z0-9]*$/.test(v) || 'Debe tener solo números y letras', 
              (v: string) => v.length <= 16 || 'Debe tener máximo 16 caracteres'
            ]"
            @update:model-value="models.code = $event"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.code ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Nombre{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>

          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.name"
            :rules=" [ 
                (v: string) => !!v || 'El nombre es requerido',
                (v: string) => /^[A-Za-zÀ-ÿ0-9\s]*$/.test(v) || 'Debe tener solo números y letras', 
                (v: string) => v.length <= 100 || 'Debe tener máximo 100 caracteres'
              ]"
            @update:model-value="models.name = $event"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.name ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Unidad de medida{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>

          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            :manual_option="measure_units"
            :map_options="true"
            :required="true"
            :default_value="models.measurement_unit"
            @update:modelValue="models.measurement_unit = $event"
            :rules="[(v: string) => !!v || 'La unidad de medida es requerida']"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.measurement_unit ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Descripción
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :required="models.description ? true : false"
            :default_value="models.description"
            type="textarea"
            :rules="[
              (v: string) =>  v.length <= 500 || 'Debe tener máximo 500 caracteres'
            ]"
            @update:model-value="models.description = $event"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.description ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12">
          <q-separator />
        </div>
      </q-form>
    </section>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ISuppliesRequest | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

// Components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic View
import useBasicDataComponent from '@/components/Forms/Supplies/BasicData/BasicDataComponent'
import { ISuppliesRequest } from '@/interfaces/global'

const { models, basicDataFormRef, measure_units } = useBasicDataComponent(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
