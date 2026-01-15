<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <template v-if="['edit'].includes(action)">
      <section>
        <p class="text-weight-bold text-black-90 size-18">
          Calificación actual
        </p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="['create', 'edit'].includes(action)"
              label="Identificación"
              :default_value="models.document_third"
              required
              disabled
              placeholder="Inserte"
              :rules="[
              (val: string) => useRules().is_required(val, 'Identificación es requerida'),
              (val: string) => useRules().max_length(val, 5)
            ]"
              @update:model-value="models.document_third = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Identificación</p>
              <p class="text-weight-medium no-margin">
                {{ models.document_third ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="['create', 'edit'].includes(action)"
              label="Descripción"
              :default_value="models.description"
              required
              placeholder="Inserte"
              disabled
              :rules="[
              (val: string) => useRules().is_required(val, 'Descripción es requerida'),
              (val: string) => useRules().max_length(val, 5)
            ]"
              @update:model-value="models.description = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Descripción</p>
              <p class="text-weight-medium no-margin">
                {{ models.description ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Calificación emisor CP"
              required
              disabled
              :rules="[
              (val: string) => useRules().is_required(val, 'Calificación emisor CP es requerida')
              ]"
              :default_value="Number(models.cp_issuer_qualification_id)"
              placeholder="Seleccione"
              @update:model-value="models.cp_issuer_qualification_id = $event"
              :manual_option="cp_issuer_rating"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación emisor CP</p>
              <p class="text-weight-medium no-margin">
                {{ models.cp_issuer_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Calificación emisor LP"
              required
              disabled
              :rules="[
              (val: string) => useRules().is_required(val, 'Calificación emisor LP es requerida')
              ]"
              :default_value="Number(models.lp_issuer_qualification_id)"
              placeholder="Seleccione"
              @update:model-value="models.lp_issuer_qualification_id = $event"
              :manual_option="lp_issuer_rating"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación emisor LP</p>
              <p class="text-weight-medium no-margin">
                {{ models.lp_issuer_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <p class="text-weight-bold text-black-90 size-18">Nueva calificación</p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Calificación emisor CP"
              :default_value="models.cp_issuer_rating_new"
              required
              placeholder="Inserte"
              :rules="[
              (val: string) => useRules().is_required(val, 'Calificación emisor CP es requerida')
            ]"
              @update:model-value="models.cp_issuer_rating_new = $event"
              :manual_option="cp_issuer_rating"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación emisor CP</p>
              <p class="text-weight-medium no-margin">
                {{ models.cp_issuer_rating_new ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Calificación emisor LP"
              :default_value="models.lp_issuer_rating_new"
              required
              placeholder="Inserte"
              :rules="[
              (val: string) => useRules().is_required(val, 'Calificación emisor LP es requerida')
            ]"
              @update:model-value="models.lp_issuer_rating_new = $event"
              :manual_option="lp_issuer_rating"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación emisor LP</p>
              <p class="text-weight-medium no-margin">
                {{ models.lp_issuer_rating_new ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInput
              v-if="['create', 'edit'].includes(action)"
              label="Fecha última actualización"
              :default_value="models.history_issuers_counter_party?.updated_at"
              required
              disabled
              placeholder="DD/MM/AAAA"
              mask="DD/MM/YYYY"
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha última actualización es requerida')
              ]"
              @update:model-value="
                (val) => {
                  if (!models.history_issuers_counter_party) {
                    models.history_issuers_counter_party = {}
                  }
                  models.history_issuers_counter_party.updated_at = val
                }
              "
              :manual_option="lp_issuer_rating"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha último actualización
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.lp_issuer_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>
    <template v-if="['view'].includes(action)">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-bold text-black-90 mb-0">Identificación</p>
            <p class="text-black-90 mb-3">
              {{
                models.document_third ? models.document_third : 'No registrado'
              }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-bold text-black-90 mb-0">Descripción</p>
            <p class="text-black-90 mb-3">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-bold text-black-90 mb-0">
              Fecha último actualización
            </p>
            <p class="text-black-90 mb-3">
              {{
                models.history_issuers_counter_party?.updated_at
                  ? models.history_issuers_counter_party?.updated_at
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </section>
      <q-separator v-if="['view'].includes(action)" class="my-20" />
      <section>
        <p class="text-weight-bold text-black-90 size-18">
          Calificación actual
        </p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-bold text-black-90 mb-0">
              Calificación emisor CP
            </p>
            <p class="text-black-90 mb-3">
              {{
                models.cp_issuer_rating
                  ? models.cp_issuer_rating
                  : 'No registrado'
              }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-bold text-black-90 mb-0">
              Calificación emisor LP
            </p>
            <p class="text-black-90 mb-3">
              {{
                models.lp_issuer_rating
                  ? models.lp_issuer_rating
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </section>
    </template>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Logic view
import useInformationForm from '@/components/Forms/InvestmentPortfolio/QualificationsMaintenance/Information/InformationForm'

// Utils
import { IQualificationsMaintenance } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IQualificationsMaintenance | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formElementRef, cp_issuer_rating, lp_issuer_rating } =
  useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style lang="scss" scoped>
.size-18 {
  font-size: 1.13rem;
}
.my-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
