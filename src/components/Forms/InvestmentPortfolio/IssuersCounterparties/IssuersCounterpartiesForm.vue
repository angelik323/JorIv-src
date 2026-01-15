<template>
  <div>
    <q-form ref="informationFormRef" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericInputComponent
              v-if="isCreateOrEdit"
              label="Identificación"
              placeholder="Inserte"
              :default_value="models.document_third"
              required
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo identificación es requerido'),
              ]"
              @update:blur="validateThirdDocument($event)"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Identificación</p>
              <p class="text-weight-medium">
                {{ models.document_third }}
              </p>
            </div>
          </div>
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericInputComponent
              v-if="isCreateOrEdit"
              label="Descripción"
              placeholder="-"
              :default_value="models.description"
              disabled
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Descripción</p>
              <p class="text-weight-medium">
                {{ models.description }}
              </p>
            </div>
          </div>
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericInputComponent
              v-if="isCreateOrEdit"
              label="Código ANNA"
              placeholder="Inserte"
              :default_value="models.anna_code"
              :rules="[    
                (v: string) => useRules().min_length(v, 6),
                (v: string) => useRules().max_length(v, 6),
              ]"
              @update:modelValue="models.anna_code = $event"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Código ANNA</p>
              <p class="text-weight-medium">
                {{ models.anna_code || '-' }}
              </p>
            </div>
          </div>
          <div class="col-12" :class="isCreateOrEdit ? '' : 'col-md-3'">
            <div
              :class="
                isCreateOrEdit ? 'flex justify-between items-center' : 'column'
              "
            >
              <p class="text-weight-bold mb-0">Tipo emisor</p>
              <RadioYesNo
                v-if="isCreateOrEdit"
                :model-value="models.emitter_type"
                :hasTitle="false"
                :hasSubtitle="false"
                :options="type_emitter_options"
                @update:model-value="(event: string) => models.emitter_type = event"
                :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo tipo emisor es requerido'),
              ]"
              />
              <p v-else class="mb-0">{{ models.emitter_type }}</p>
            </div>
          </div>
          <div class="col-12" v-if="isCreateOrEdit">
            <q-separator class="q-my-md" />
          </div>
          <div class="col-12" :class="isCreateOrEdit ? '' : 'col-md-3'">
            <p v-if="isCreateOrEdit" class="mb-2 text-weight-bold text-h6">
              Calificación
            </p>
            <p class="mb-0 text-weight-bold">Clase</p>
            <div class="row" v-if="isCreateOrEdit">
              <div class="col-12 col-md-4 column">
                <q-checkbox
                  v-for="option in [
                    { value: 'Emisor', label: 'Emisor' },
                    { value: 'Comprador', label: 'Comprador' },
                    { value: 'Vendedor', label: 'Vendedor' },
                  ]"
                  :key="option.value"
                  v-model="models.class_ratings"
                  :val="option.value"
                  :label="option.label"
                  color="orange"
                />
              </div>
              <div class="col-12 col-md-4 column">
                <q-checkbox
                  v-for="option in [
                    { value: 'Administrador', label: 'Administrador' },
                    { value: 'Custodio', label: 'Custodio' },
                    {
                      value: 'Proveedor de precios',
                      label: 'Proveedor de precios',
                    },
                  ]"
                  :key="option.value"
                  v-model="models.class_ratings"
                  :val="option.value"
                  :label="option.label"
                  color="orange"
                />
              </div>
              <div class="col-12 col-md-4 column">
                <q-checkbox
                  v-for="option in [{ value: 'Depósito', label: 'Depósito' }]"
                  :key="option.value"
                  v-model="models.class_ratings"
                  :val="option.value"
                  :label="option.label"
                  color="orange"
                />
              </div>
            </div>
            <div class="column" v-else>
              <p class="mb-0" v-for="classRating in models.class_ratings">
                {{ classRating }}
              </p>
            </div>
          </div>
          <div class="col-12" v-if="isCreateOrEdit">
            <q-separator class="q-my-md" />
          </div>
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericSelectorComponent
              v-if="isCreateOrEdit"
              label="Calificadora"
              :manual_option="risk_rating_agencie"
              :default_value="models.rating_agency"
              :clearable="false"
              :auto_complete="false"
              map_options
              required
              @update:modelValue="models.rating_agency = $event"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo calificadora es requerido'),
              ]"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Calificadora</p>
              <p class="text-weight-medium">
                {{ models.rating_agency }}
              </p>
            </div>
          </div>
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericSelectorComponent
              v-if="isCreateOrEdit"
              label="Calificación emisor CP"
              :manual_option="cp_issuer_rating"
              :default_value="models.cp_issuer_qualification_id"
              :clearable="false"
              :auto_complete="false"
              map_options
              required
              @update:modelValue="models.cp_issuer_qualification_id = $event"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo calificación emisor CP es requerido'),
              ]"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Calificación emisor CP</p>
              <p class="text-weight-medium">
                {{ models.cp_issuer_rating }}
              </p>
            </div>
          </div>
          <div class="col-12" :class="isCreateOrEdit ? 'col-md-4' : 'col-md-3'">
            <GenericSelectorComponent
              v-if="isCreateOrEdit"
              label="Calificación emisor LP"
              :manual_option="lp_issuer_rating"
              :default_value="models.lp_issuer_qualification_id"
              :clearable="false"
              :auto_complete="false"
              map_options
              required
              @update:modelValue="models.lp_issuer_qualification_id = $event"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo calificación emisor LP es requerido'),
              ]"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Calificación emisor LP</p>
              <p class="text-weight-medium">
                {{ models.lp_issuer_rating }}
              </p>
            </div>
          </div>
          <div class="col-12">
            <q-separator class="q-my-md" />
          </div>
        </div>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          v-if="!isCreateOrEdit"
        >
          <div class="col-12" v-if="!isCreateOrEdit">
            <h6 class="text-weight-bold my-1">
              Historial de emisores y contrapartes
            </h6>
          </div>
          <div class="col-12 col-md-3">
            <p class="mb-0 text-weight-bold">Fecha de creación</p>
            <p class="mb-0">
              {{ models.history_issuers_counter_party.created_at }}
            </p>
          </div>
          <div class="col-12 col-md-3">
            <p class="mb-0 text-weight-bold">Creado por</p>
            <p class="mb-0">
              {{ models.history_issuers_counter_party.creator_data }}
            </p>
          </div>
          <div class="col-12 col-md-3">
            <p class="mb-0 text-weight-bold">Modificación</p>
            <p class="mb-0">
              {{ models.history_issuers_counter_party.updated_at }}
            </p>
          </div>
          <div class="col-12 col-md-3">
            <p class="mb-0 text-weight-bold">Modificado por</p>
            <p class="mb-0">
              {{ models.history_issuers_counter_party.update_data || '-' }}
            </p>
          </div>
          <div class="col-12">
            <q-separator class="my-1" />
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
  }>(),
  {}
)
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useIssuersCounterpartiesForm from './IssuersCounterpartiesForm'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { ActionType } from '@/interfaces/global'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'
import { type_emitter_options } from '@/constants'

const {
  models,
  isCreateOrEdit,
  risk_rating_agencie,
  lp_issuer_rating,
  cp_issuer_rating,
  informationFormRef,
  validateThirdDocument,
} = useIssuersCounterpartiesForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
