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
        v-model="models.pep_info.is_pep"
        class="q-pt-md q-pl-sm"
        hasTitle
        :title="pepLabel"
        :hasSubtitle="false"
        :isDisabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.pep_info.is_pep">
        <div class="q-mt-md q-ml-lg">
          <RadioYesNo
            v-model="models.pep_info.is_politician"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Político (Según Decreto 830 de 2021)"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.legal_representative"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Representante legal de una organización internacional"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.is_pep_international"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="PEP Internacional"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit' ].includes(action)"
              :label="pepPositionAndEntityLabel"
              :required="!!models.pep_info.is_pep"
              :default_value="models.pep_info.position"
              :rules="[
                    (v: string) => useRules().is_required(v,'Este campo es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 50),
                  ]"
              @update:model-value="models.pep_info.position = $event"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ pepPositionAndEntityLabel }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info.position ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div v-if="!clientNaturalTypeDirect" class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :label="'Entidad'"
              :required="!!models.pep_info.is_pep"
              :default_value="models.pep_info.entity"
              :rules="[
                    (v: string) => useRules().is_required(v,'Este campo es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 60),
                  ]"
              @update:model-value="models.pep_info.entity = $event"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ 'Entidad' }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info.entity ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :label="pepDateEntryLabel"
              :default_value="models.pep_info.date_entry"
              :required="!!models.pep_info.is_pep"
              :rules="[
                    (v: string) => useRules().is_required(v) || 'La fecha de ingreso al cargo es requerida',
                    (v: string) => date_before_or_equal_to_the_current_date(v)
                  ]"
              @update:modelValue="(val: string) => {
                    models.pep_info.date_entry = val
                    if(!val) models.pep_info.date_exit = null
                  }"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ pepDateEntryLabel }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info.date_entry ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :label="pepDateExitLabel"
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
            <div v-else>
              <p class="text-grey-6 mb-0">{{ pepDateExitLabel }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info.date_exit ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>

    <section>
      <RadioYesNo
        :model-value="models.pep_info_relative?.familiar_politician ?? false"
        @update:model-value="handleFamiliarPoliticianUpdate"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene parentesco con persona expuesta políticamente (PEP)? "
        :hasSubtitle="false"
        :isDisabled="['view'].includes(action)"
      />

      <q-separator class="q-mt-sm" />

      <template v-if="models.pep_info_relative?.familiar_politician">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :label="'Nombre completo'"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.full_name"
              :rules="[
                    (v: string) => useRules().is_required(v) || 'El nombre es requerido',
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 60),
                  ]"
              @update:model-value="models.pep_info_relative.full_name = $event"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ 'Nombre completo' }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info_relative.full_name || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :label="'Parentesco'"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.relationship"
              :rules="[
                    (v: string) => useRules().is_required(v,'El parentesco es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 60),
                  ]"
              @update:model-value="
                models.pep_info_relative.relationship = $event
              "
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ 'Parentesco' }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info_relative.relationship || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :label="'Cargo que desempeña'"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.position"
              :rules="[
                    (v: string) => useRules().is_required(v,'El cargo es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 60),
                  ]"
              @update:model-value="models.pep_info_relative.position = $event"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ 'Cargo que desempeña' }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info_relative.position || 'No registrado' }}
              </p>
            </div>
          </div>

          <div v-if="!clientNaturalTypeDirect" class="col-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :label="'Entidad'"
              :required="models.pep_info_relative.familiar_politician"
              :default_value="models.pep_info_relative.entity"
              :rules="[
                    (v: string) => useRules().is_required(v,'El cargo es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 2),
                    (v: string) => useRules().max_length(v, 60),
                  ]"
              @update:model-value="models.pep_info_relative.entity = $event"
            />
            <div v-else>
              <p class="text-grey-6 mb-0">{{ 'Entidad' }}</p>
              <p class="text-grey-6 mb-0">
                {{ models.pep_info_relative.entity || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IClientIndirectNaturalPepForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

// Logic Form
import usePepForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/pep/PepForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IClientIndirectNaturalPepForm | null
  }>(),
  {}
)

const emits = defineEmits(['update:data'])

const {
  models,
  formPep,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
  useRules,

  clientNaturalTypeDirect,
  pepLabel,
  pepPositionAndEntityLabel,
  pepDateEntryLabel,
  pepDateExitLabel,
  handleFamiliarPoliticianUpdate
} = usePepForm(props,emits)

defineExpose({
  validateForm: () => formPep.value?.validate(),
})
</script>
