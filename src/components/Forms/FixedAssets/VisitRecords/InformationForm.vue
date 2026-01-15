<template>
  <section>
    <q-form ref="informationFormRef">
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            disabled
            label="Fecha de creación"
            :default_value="models?.created_at"
            :rules="[]"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Fecha de creación</p>
            <p>
              {{ models?.created_at ?? 'Sin fecha' }}
            </p>
          </div>
        </div>
        <template v-if="showAudit">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericInputComponent
              v-if="action !== 'view'"
              disabled
              label="Creada por"
              placeholder="N/A"
              :default_value="models?.created_by_name"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Creada por</p>
              <p>
                {{ models?.created_by_name ?? 'Sin información' }}
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericDateInputComponent
              v-if="action !== 'view'"
              disabled
              label="Fecha de actualización"
              :default_value="models?.updated_at"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Fecha de actualización</p>
              <p>
                {{ models?.updated_at ?? 'Sin fecha' }}
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericInputComponent
              v-if="action !== 'view'"
              disabled
              label="Actualizado por"
              placeholder="N/A"
              :default_value="models?.updated_by_name"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Actualizado por</p>
              <p>
                {{ models?.updated_by_name ?? 'Sin información' }}
              </p>
            </div>
          </div>
        </template>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div
          class="col-xs-12 col-sm-12 col-md-4"
          :class="showAudit ? 'col-lg-3' : 'col-lg-4'"
        >
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Negocio"
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="disableAllForm || action === 'edit'"
            :rules="[(val: string) => is_required(val, 'Diligencia campo obligatorio')]"
            :default_value="models?.business_trust"
            :manual_option="business_trusts"
            @update:modelValue="models.business_trust_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Negocio</p>
            <p>
              {{ models?.business_trust ?? 'Sin negocio' }}
            </p>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4"
          :class="showAudit ? 'col-lg-3' : 'col-lg-4'"
        >
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Tipo de bien o activo fijo"
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="disableAllForm || action === 'edit'"
            :rules="[(val: string) => is_required(val, 'Diligencia campo obligatorio')]"
            :default_value="models?.asset_type"
            :manual_option="configuration_type"
            @update:modelValue="models.configuration_types_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Tipo de bien o activo fijo</p>
            <p>
              {{ models?.asset_type ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4"
          :class="showAudit ? 'col-lg-3' : 'col-lg-4'"
        >
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Subtipo bien o activo fijo"
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="
              disableAllForm ||
              !models.configuration_types_id ||
              action === 'edit'
            "
            :rules="[(val: string) => is_required(val, 'Diligencia campo obligatorio')]"
            :default_value="models?.asset_subtype"
            :manual_option="filteredSubtypes"
            @update:modelValue="models.configuration_subtypes_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Subtipo bien o activo fijo</p>
            <p>
              {{ models?.asset_subtype ?? 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
    </q-form>

    <q-separator class="q-mb-md" />

    <VisitDetailsList
      v-if="models.details"
      ref="visitDetailsRef"
      class="q-mb-md"
      v-model="models.details"
      :action
      :showVisitDetailError
      :disableAllForm
      :third_parties
      :visit_reason
      :physical_condition
      :asset_rating
    />
  </section>
</template>
<script setup lang="ts">
// interfaces
import { IVisitRecordForm } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'
import { ActionType } from '@/interfaces/global/Action'

// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import VisitDetailsList from '@/components/Forms/FixedAssets/VisitRecords/VisitDetailList/VisitDetailList.vue'

// logic
import useInformationForm from '@/components/Forms/FixedAssets/VisitRecords/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IVisitRecordForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IVisitRecordForm | null): void
}>()

const {
  models,
  showAudit,
  disableAllForm,
  informationFormRef,
  visitDetailsRef,
  showVisitDetailError,
  hasAtLeastOneDetail,

  business_trusts,
  configuration_type,
  filteredSubtypes,
  third_parties,
  visit_reason,
  physical_condition,
  asset_rating,

  validateAllForms,
  is_required,
} = useInformationForm(props, emits)

defineExpose({
  hasAtLeastOneDetail,

  validateAllForms,
})
</script>
