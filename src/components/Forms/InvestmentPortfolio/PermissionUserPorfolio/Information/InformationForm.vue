<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de usuario"
            :default_value="models.user_code?.code"
            required
            :disabled="action === 'edit'"
            :prepend_icon="useUtils().defaultIconsLucide.magnify"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Código de usuario es requerido'),
              (val: string) => useRules().max_length(val, 12),
              () =>
                isMatchingUserCode
                  ? true
                  : 'El código de usuario no coincide con ningún registro',
            ]"
            @update:model-value="handlerUserCode($event)"
            @click:appendIcon="models.user_code = { code: '', id: null }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de usuario</p>
            <p class="text-weight-medium no-margin">
              {{
                models.user_code?.code
                  ? models.user_code?.code
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre de usuario"
            :default_value="models.user_name"
            required
            disabled
            placeholder="-"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Nombre de usuario es requerido'),
              (val: string) => useRules().max_length(val, 50),
            ]"
            @update:model-value="models.user_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre de usuario</p>
            <p class="text-weight-medium no-margin">
              {{ models.user_name ? models.user_name : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de portafolio"
            :default_value="models.portfolio_code?.code"
            required
            :prepend_icon="useUtils().defaultIconsLucide.magnify"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Código de portafolio es requerido',
                ),
              (val: string) => useRules().max_length(val, 12),
              () =>
                isMatchingPortfolioCode
                  ? true
                  : 'El código de portafolio no coincide con ningún registro',
            ]"
            @update:model-value="handlerPortfolioCode($event)"
            @click:appendIcon="models.portfolio_code = { code: '', id: null }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de portafolio</p>
            <p class="text-weight-medium no-margin">
              {{
                models.portfolio_code?.code
                  ? models.portfolio_code?.code
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción portafolio"
            :default_value="models.portfolio_description"
            required
            disabled
            placeholder="-"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Descripción portafolio es requerido',
                ),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.portfolio_description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción portafolio</p>
            <p class="text-weight-medium no-margin">
              {{
                models.portfolio_description
                  ? models.portfolio_description
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section v-if="['view'].includes(action)">
      <q-separator class="my-20" />
      <p class="text-weight-bold text-black-90 size-18">
        Historial del permiso
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Fecha de creación</p>
          <p class="text-black-90 mb-3">
            {{ models.created_at ? models.created_at : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Creado por</p>
          <p class="text-black-90 mb-3">
            {{ models.creator_data ? models.creator_data : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificación</p>
          <p class="text-black-90 mb-3">
            {{ models.updated_at ? models.updated_at : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificado por</p>
          <p class="text-black-90 mb-3">
            {{ models.updated_data ? models.updated_data : 'No registrado' }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Utils
import { IPermissionUserPorfolioForm } from '@/interfaces/customs'
import { useRules, useUtils } from '@/composables'
import { ActionType } from '@/interfaces/global'

// Logic view
import useInformationForm from '@/components/Forms/InvestmentPortfolio/PermissionUserPorfolio/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPermissionUserPorfolioForm | null
  }>(),
  {},
)

const emits = defineEmits(['validate:form'])

const {
  isMatchingPortfolioCode,
  handlerPortfolioCode,
  isMatchingUserCode,
  handlerUserCode,
  formElementRef,
  models,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
  models,
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
