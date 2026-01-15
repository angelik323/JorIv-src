<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información de estructura
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de cláusula"
            :manual_option="clause_types"
            :map_options="true"
            :required="true"
            :default_value="models?.clause_type_id"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => rules.is_required(val)]"
            @update:modelValue="models.clause_type_id = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Tipo de cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ models.clause_type_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6" v-if="contractType == 'Otro'">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="¿Cual?"
            required
            :default_value="models?.WhichClause"
            :rules="[
              (val: string) => rules.is_required(val),
              (val: string) => rules.only_alphanumeric(val),
              (val: string) => rules.max_length(val, 30),
            ]"
            @update:modelValue="models.WhichClause = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">¿Cual?</p>
            <p class="text-weight-medium no-margin">
              {{ models.WhichClause ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div :class="`col-12 col-md-${contractType == 'Otro' ? '12' : '6'}`">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre de cláusula"
            required
            :default_value="models?.name"
            :rules="[(val: string) => rules.is_required(val)]"
            @update:modelValue="models.name = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Nombre de cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12" v-if="['edit', 'view'].includes(action)">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código de cláusula"
            :default_value="models.code"
            type="number"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            @update:model-value="models.code = $event"
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Código de cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action)
                ? 'text-black-10 text-weight-bold mt-2'
                : 'text-grey-10 q-px-sm'
            "
          >
            Cláusula{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <q-field
            v-if="['create', 'edit'].includes(action)"
            v-model="models.clausule"
            required
            :rules="[
              (val: string) => rules.is_required(val),
              (val: string) => rules.min_length(val, 5),
              (val: string) => rules.max_length(val, 5000),
            ]"
            borderless
          >
            <WysiwygComponent
              :default_value="models.clausule"
              hint="Puede usar formato enriquecido"
              @update:modelValue="models.clausule = $event"
            />
          </q-field>

          <div v-else class="text-black-90 q-mt-md">
            <div v-html="content" class="q-px-md" />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/DerivativeContracting/ContractClauses/BasicData'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import WysiwygComponent from '@/components/common/Wysiwyg/WysiwygComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractClausesForm } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IContractClausesForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractClausesForm | null): void
}>()

const { formElementRef, models, clause_types, contractType, content, rules } =
  useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
