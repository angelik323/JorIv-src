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
              v-model="formValues.is_politician"
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
              v-model="formValues.is_international_pep"
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

          <template v-if="isLegalPersonIndirect">
            <div class="col-xs-12 col-sm-12 col-md-3">
              <GenericInput
                v-if="['create', 'edit'].includes(formType)"
                label="Cargo"
                :required="!!formValues.is_pep"
                :default_value="formValues.position"
                :rules="[
                  (v: string) => !!v || 'Este campo es requerido',
                  (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                  (v: string) =>
                    v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                ]"
                @update:model-value="formValues.position = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Cargo</p>
                <p class="text-weight-medium no-margin">
                  {{ formValues.position ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-3">
              <GenericInput
                v-if="['create', 'edit'].includes(formType)"
                label="Entidad"
                :required="!!formValues.is_pep"
                :default_value="formValues.entity"
                :rules="[
                  (v: string) => !!v || 'Este campo es requerido',
                  (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                  (v: string) =>
                    v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                ]"
                @update:model-value="formValues.entity = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Entidad</p>
                <p class="text-weight-medium no-margin">
                  {{ formValues.entity ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-3">
              <GenericDateInputComponent
                v-if="['create', 'edit'].includes(formType)"
                label="Fecha de ingreso al cargo"
                :default_value="formValues.date_entry"
                :required="!!formValues.is_pep"
                :rules="[
                  (v: string) => !!v || 'La fecha de ingreso al cargo es requerida',
                  (v: string) => useRules().date_before_or_equal_to_the_current_date(v)
                ]"
                @update:modelValue="(val: string) => {
                  formValues.date_entry = val
                  if(!val) formValues.date_exit = null
                }"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Fecha de ingreso al cargo
                </p>
                <p class="text-weight-medium no-margin">
                  {{ formValues.date_entry ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-3">
              <GenericDateInputComponent
                v-if="['create', 'edit'].includes(formType)"
                label="Fecha de retiro del cargo"
                :default_value="formValues.date_exit"
                :required="formValues.date_exit ? true : false"
                :disabled="!formValues.date_entry"
                :rules="
                  formValues.date_exit ? [
                    (v: string) => useRules().date_after_or_equal_to_specific_date(v,formValues.date_entry || '' ),
                    (v: string) => useRules().date_before_or_equal_to_the_current_date(v)
                  ]
                  : []
                "
                @update:modelValue="formValues.date_exit = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Fecha de retiro del cargo
                </p>
                <p class="text-weight-medium no-margin">
                  {{ formValues.date_exit ?? 'No registrado' }}
                </p>
              </div>
            </div>
          </template>
        </template>

        <div class="col-12">
          <RadioYesNo
            v-model="formValues.has_pep_relatives"
            hasTitle
            title="¿Tiene parentesco con persona expuesta políticamente (PEP)?*"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(formType)"
          />
          <q-separator
            v-if="formValues.has_pep_relatives"
            class="q-mt-xs q-mb-md"
            color="grey-4"
          />
        </div>

        <template v-if="formValues.has_pep_relatives">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(formType)"
              label="Nombre completo"
              required
              :default_value="formValues.relatives?.full_name"
              :rules="[
                    (v: string) => !!v || 'El nombre es requerido',
                    (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="
                formValues.relatives &&
                  (formValues.relatives.full_name = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre completo</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.relatives?.full_name ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(formType)"
              label="Parentesco"
              required
              :default_value="formValues.relatives?.relationship"
              :rules="[
                    (v: string) => !!v || 'El parentesco es requerido',
                    (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="
                formValues.relatives &&
                  (formValues.relatives.relationship = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Parentesco</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.relatives?.relationship ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(formType)"
              label="Cargo que desempeña"
              required
              :default_value="formValues.relatives?.position"
              :rules="[
                    (v: string) => !!v || 'El cargo es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="
                formValues.relatives && (formValues.relatives.position = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cargo que desempeña</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.relatives?.position ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div
            v-if="isLegalPersonIndirect"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(formType)"
              label="Entidad"
              :required="true"
              :default_value="formValues.relatives?.entity"
              :rules="[
                  (v: string) => !!v || 'Este campo es requerido',
                  (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                  (v: string) =>
                    v.length <= 50 || 'Debe contener como máximo 60 caracteres',
                ]"
              @update:model-value="
                formValues.relatives && (formValues.relatives.entity = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Entidad</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.relatives?.entity ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import { IManager } from '@/interfaces/customs/clients/Clients'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Logic form
import { usePEPForm } from '@/components/Forms/Clients/v2/LegalPerson/Manager/ManagerGenerator/PEP/PEPForm'

// Composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data: IManager | null
  }>(),
  {}
)

const { formValues, formElementRef, isLegalPersonIndirect, onlyLetters } =
  usePEPForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
