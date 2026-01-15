<template>
  <q-form ref="formPep" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Persona expuesta políticamente
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios para saber si su nuevo cliente como
          persona natural es una persona expuesta políticamente.
        </p>
      </div>

      <RadioYesNo
        v-model="models.is_pep"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Es o ha sido durante los últimos años persona expuesta políticamente (PEP) nacional o extranjero?"
        :hasSubtitle="false"
        :isDisabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.is_pep">
        <div class="q-mt-md q-ml-lg">
          <RadioYesNo
            v-model="models.pep_info.is_politician"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Político (Según Decreto 830 de 2021)"
            :hasSubtitle="false"
            :isDisabled="
              ['view'].includes(action) ||
              models.pep_info.legal_representative ||
              models.pep_info.is_pep_international
            "
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.legal_representative"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Representante legal de una organización internacional"
            :hasSubtitle="false"
            :isDisabled="
              ['view'].includes(action) ||
              models.pep_info.is_politician ||
              models.pep_info.is_pep_international
            "
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.is_pep_international"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="PEP Internacional"
            :hasSubtitle="false"
            :isDisabled="
              ['view'].includes(action) ||
              models.pep_info.is_politician ||
              models.pep_info.legal_representative
            "
          />
          <q-separator class="q-mt-sm" />
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo y entidad{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="!!models.is_pep"
              :default_value="models.pep_info.position"
              :rules="[
                    (v: string) => !!v || 'Este campo es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                  ]"
              @update:model-value="models.pep_info.position = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info.position ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Fecha de ingreso al cargo{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.pep_info.date_entry"
              :required="!!models.is_pep"
              :rules="[
                    (v: string) => !!v || 'La fecha de ingreso al cargo es requerida',
                    (v: string) => date_before_or_equal_to_the_current_date(v)
                  ]"
              @update:modelValue="(val: string) => {
                    models.pep_info.date_entry = val
                    if(!val) models.pep_info.date_exit = null
                  }"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info.date_entry ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Fecha de retiro del cargo (Cuando aplique)
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.pep_info.date_exit"
              :required="models.pep_info.date_exit ? true : false"
              :disabled="!models.pep_info.date_entry"
              :rules="
                  models.pep_info.date_exit ? [
                    (v: string) => date_after_or_equal_to_specific_date(v,models.pep_info.date_entry || '' ),
                  ]
                  : []
                "
              @update:modelValue="models.pep_info.date_exit = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info.date_exit ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>

    <section>
      <RadioYesNo
        v-model="models.pep_info_relative.familiar_politician"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Es familiar, hasta segundo grado de consanguinidad, afinidad o civil de una persona expuesta políticamente?"
        :hasSubtitle="false"
        :isDisabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.pep_info_relative.familiar_politician">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
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
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.full_name"
              :rules="[
                    (v: string) =>
                      (!!v && models.pep_info_relative.familiar_politician) ||
                      'El nombre es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      (v.length >= 2 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      (v.length <= 250 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener como máximo 250 caracteres',
                  ]"
              @update:model-value="models.pep_info_relative.full_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info_relative.full_name || 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Parentesco{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.relationship"
              :rules="[
                    (v: string) =>
                      (!!v && models.pep_info_relative.familiar_politician) ||
                      'El parentesco es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      (v.length >= 2 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      (v.length <= 50 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener como máximo 50 caracteres',
                  ]"
              @update:model-value="
                models.pep_info_relative.relationship = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info_relative.relationship || 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo que desempeña{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.position"
              :rules="[
                    (v: string) =>
                      (!!v && models.pep_info_relative.familiar_politician) ||
                      'El cargo es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letrass',
                    (v: string) =>
                      (v.length >= 2 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      (v.length <= 50 &&
                        models.pep_info_relative.familiar_politician) ||
                      'Debe contener como máximo 50 caracteres',
                  ]"
              @update:model-value="models.pep_info_relative.position = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.pep_info_relative.position || 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import usePepForm from './PepForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formPep,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
} = usePepForm(props)

defineExpose({
  validateForm: () => formPep.value?.validate(),
})
</script>
