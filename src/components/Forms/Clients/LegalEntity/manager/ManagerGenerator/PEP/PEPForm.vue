<template>
  <div>
    <!-- Título -->
    <div class="text-start q-mb-lg">
      <h2 class="text-body1 text-dark text-bold q-my-none">
        Información accionaria
      </h2>
    </div>

    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12">
          <RadioYesNo
            v-model="formValues.is_pep"
            hasTitle
            title="¿Es una persona política expuesta?"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(formType)"
          />
          <q-separator class="q-mt-xs" color="grey-4" />
        </div>

        <template v-if="formValues.is_pep">
          <div class="col-12 q-pl-xl">
            <RadioYesNo
              v-model="formValues.political_decree_830_2021"
              :is-radio-button="false"
              hasTitle
              title="Político (Según decreto 830 de 2021)"
              :hasSubtitle="false"
              :is-disabled="['view'].includes(formType)"
            />
            <q-separator class="q-mt-xs" color="grey-4" />
          </div>

          <div class="col-12 q-pl-xl">
            <RadioYesNo
              v-model="formValues.is_representative_intl_org"
              :is-radio-button="false"
              hasTitle
              title="Representante legal de una organización internacional"
              :hasSubtitle="false"
              :is-disabled="['view'].includes(formType)"
            />
            <q-separator class="q-mt-xs" color="grey-4" />
          </div>

          <div class="col-12 q-pl-xl">
            <RadioYesNo
              v-model="formValues.is_pep_international"
              :is-radio-button="false"
              hasTitle
              title="PEP internacional"
              :hasSubtitle="false"
              :is-disabled="['view'].includes(formType)"
            />
            <q-separator class="q-mt-xs q-mb-md" color="grey-4" />
          </div>
        </template>

        <div class="col-12">
          <RadioYesNo
            v-model="formValues.has_pep_relative"
            hasTitle
            title="¿Tiene parentesco con persona expuesta políticamente (PEP)?*"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(formType)"
          />
          <q-separator
            v-if="formValues.has_pep_relative"
            class="q-mt-xs q-mb-md"
            color="grey-4"
          />
        </div>

        <template v-if="formValues.has_pep_relative">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre completo{{
                ['create', 'edit'].includes(formType) ? '*' : ''
              }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              required
              :default_value="formValues.related_pep_full_name"
              :rules=" [ 
                (v: string) => !!v || 'El nombre completo es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres'
              ]"
              @update:model-value="formValues.related_pep_full_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.related_pep_full_name ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Parentesco{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              required
              :default_value="formValues.pep_relationship"
              :rules=" [ 
                (v: string) => !!v || 'El parentesco es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres'
              ]"
              @update:model-value="formValues.pep_relationship = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.pep_relationship ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo que desempeña{{
                ['create', 'edit'].includes(formType) ? '*' : ''
              }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              required
              :default_value="formValues.position_held"
              :rules=" [ 
                (v: string) => !!v || 'El cargo que desempeña es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres'
              ]"
              @update:model-value="formValues.position_held = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.position_held ?? 'No registrado' }}
            </p>
          </div>
        </template>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { IManager } from '@/interfaces/customs'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { usePEPForm } from './PEPForm'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IManager | null
  }>(),
  {}
)

const { formValues, formElementRef, onlyLetters } = usePEPForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
