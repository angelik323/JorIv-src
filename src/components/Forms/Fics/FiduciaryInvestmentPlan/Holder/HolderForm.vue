<template>
  <q-form ref="formHolder">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Datos generales</p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Identificación titular"
            :default_value="models.holder_identification?.holder_id"
            :manual_option="third_parties"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="
              models.holder_identification.holder_id = $event
            "
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Identificación titular
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.document || 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de documento"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="
              models.holder_identification.holder?.document_type.abbreviation
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Digito de chequeo</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.check_digit ||
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Digito de chequeo"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.holder_identification.holder?.check_digit"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.document_type
                  .abbreviation || 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Primer apellido"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="
              models.holder_identification.holder?.natural_person.last_name
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Primer apellido</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.natural_person.last_name
                  ? models.holder_identification.holder?.natural_person
                      .last_name
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Segundo apellido"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="
              models.holder_identification.holder?.natural_person
                .second_last_name
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Segundo apellido</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.natural_person
                  .second_last_name
                  ? models.holder_identification.holder?.natural_person
                      .second_last_name
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombres"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="`${
              models.holder_identification.holder?.natural_person.name || '-'
            } ${
              models.holder_identification.holder?.natural_person.middle_name ||
              ''
            }`"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Nombres</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification?.holder?.natural_person?.name ||
                models.holder_identification?.holder?.natural_person
                  ?.middle_name
                  ? `${
                      models.holder_identification.holder.natural_person.name ||
                      ''
                    } ${
                      models.holder_identification.holder.natural_person
                        .middle_name || ''
                    }`.trim()
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Envío</p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :key="`print-group-${
              models.collective_investment_fund_id || 'no-fund'
            }-${
              models.holder_identification.fic_print_group_id || 'no-selection'
            }`"
            label="Grupo de impresión"
            :default_value="models.holder_identification.fic_print_group_id"
            :manual_option="filteredPrintGroups"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val) || 'Campo grupo de impresión es requerido']"
            @update:model-value="
              models.holder_identification.fic_print_group_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Grupo de impresión
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.fic_print_group?.description ||
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Ciudad"
            :default_value="models.holder_identification.city_id"
            :manual_option="cities"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val) || 'Campo ciudad es requerido']"
            @update:model-value="models.holder_identification.city_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.holder_identification.city?.name"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección de residencia"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.residential_address"
            :rules="[
              (v) => no_special_characters(v),
              (v) => no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.holder_identification.residential_address = $event
            "
            :disabled="!validatePrintGroup.address"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Correo electrónico"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.email_address"
            :rules="[(v) => email_validation(v)]"
            @update:modelValue="
              models.holder_identification.email_address = $event
            "
            :disabled="!validatePrintGroup.email"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Teléfono/Celular"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.phone"
            :rules="[
              (v) => !v || only_number(v),
              (v) => !v || length_exactly(v, 10),
            ]"
            @update:modelValue="models.holder_identification.phone = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Ciudad</p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.city?.code || '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción ciudad
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.city?.name || '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Dirección de residencia
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.residential_address || '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Correo electrónico
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification?.email_address || 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Teléfono/Celular</p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification?.phone || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">
            Retención en la fuente, GMF y origen recursos
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Retención en la fuente"
            type="text"
            disabled
            required
            :default_value="withholdingPercentage"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Retención en la fuente</p>
            <p class="text-weight-medium no-margin">
              {{ withholdingPercentage }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="GMF"
            type="text"
            disabled
            required
            :default_value="gmfPercentage"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">GMF</p>
            <p class="text-weight-medium no-margin">
              {{ gmfPercentage }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Origen recursos"
            :default_value="models.holder_identification.funding_source_id"
            :manual_option="fundingSourceOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val, 'campo origen recursos es requerido')]"
            @update:model-value="
              models.holder_identification.funding_source_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Origen recursos</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.funding_source_id
                  ? models.holder_identification.funding_source_id
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { IFiduciaryInvestmentPlansPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useRules } from '@/composables'

// logic view
import useHolderForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/Holder/HolderForm'

const props = withDefaults(
  defineProps<IFiduciaryInvestmentPlansPropsForm>(),
  {}
)

const {
  models,
  formHolder,
  third_parties,
  filteredPrintGroups,
  cities,
  fundingSourceOptions,
  validatePrintGroup,
  email_validation,
  only_number,
  no_special_characters,
  no_consecutive_spaces,
  length_exactly,
  gmfPercentage,
  withholdingPercentage,
} = useHolderForm(props)

defineExpose({
  validateForm: () => formHolder.value?.validate(),
})
</script>
