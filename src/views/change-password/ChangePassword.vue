<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="'Cambiar contraseña'"
      :breadcrumbs="headerProps.breadcrumb"
    >
      <section class="q-mt-xs">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <Card class="q-mt-md">
          <template #content-card>
            <q-form ref="changePasswordForm" class="mx-3 mt-3 mb-3">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <GenericInput
                    required
                    label="Contraseña nueva*"
                    :default_value="models.new_password"
                    @update:model-value="models.new_password = $event"
                    :rules="[
                      (v: string) => !!v || 'La contraseña es requerida',
                      (v: string) => v.length <= 100 || 'Debe de tener máximo 100 caracteres',
                      (v: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\W{2,})[\w\W]{8,100}$/.test(
                          v
                        ) || 'La contraseña no cumple con las políticas establecidas',
                    ]"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <GenericInput
                    required
                    label="Confirmar contraseña*"
                    :default_value="models.password_confirmation"
                    @update:model-value="models.password_confirmation = $event"
                    :rules="
                      [
                          (v: string) => !!v || 'La contraseña de confirmación es requerida',
                          (v: string) => v.length <= 100 || 'Debe de tener máximo 100 caracteres',
                          (v: string) => v === models.new_password || 'Las contraseñas no coinciden',
                      ]"
                  />
                </div>
                <div class="col-12">
                  <div class="row q-gutter-md">
                    <q-btn
                      outline
                      :icon="defaultIcons.information"
                      class="btn__standart"
                      color="indigo-10"
                      label="Ayuda"
                      no-caps
                      unelevated
                      @click="propsModalHelp.open = true"
                    />
                    <q-btn
                      class="btn__standart"
                      color="indigo-10"
                      label="Sugerir contraseña"
                      no-caps
                      unelevated
                      @click="
                        ;(propsModalSuggestionPassword.open = true),
                          suggestPassword()
                      "
                    />
                  </div>
                </div>
                <div class="col-12">
                  <q-separator class="mx-0" inset />
                </div>
              </div>

              <div class="row items-center justify-end mt-2">
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                  <q-btn
                    class="full-width btn__standart"
                    color="indigo-10"
                    label="Actualizar"
                    no-caps
                    unelevated
                    @click="execConfirmation"
                  />
                </div>
              </div>
            </q-form>
          </template>
        </Card>
      </section>

      <!-- Modal Suggest Password -->
      <Modal
        :open-dialog="propsModalSuggestionPassword.open"
        @update:openDialog="propsModalSuggestionPassword.open = false"
      >
        <template #content-modal>
          <div class="mx-4 mb-3">
            <p class="mb-0 text-h5">Contraseña sugerida</p>
            <div class="row q-col-gutter-md mt-3">
              <div class="col-9">
                <GenericInput
                  label="Nueva contraseña sugerida"
                  :default_value="models.password_suggestion"
                  readonly
                  :required="false"
                  :rules="[]"
                />
              </div>
              <div class="col-3 content-center">
                <div class="row q-gutter-md justify-end content-center mt-2">
                  <q-icon
                    class="cursor-pointer"
                    size="sm"
                    :name="defaultIcons.copy"
                    color="indigo-10"
                    @click="copy(models.password_suggestion)"
                  />
                  <q-icon
                    class="cursor-pointer"
                    size="sm"
                    :name="defaultIcons.autorenew"
                    color="indigo-10"
                    @click="suggestPassword"
                  />
                </div>
              </div>

              <div class="col-12 mt-4">
                <div class="row justify-center q-gutter-md">
                  <div class="col-3 content-center">
                    <q-btn
                      class="btn__standart full-width"
                      color="indigo-10"
                      label="Ok"
                      no-caps
                      unelevated
                      @click="propsModalSuggestionPassword.open = false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Modal>

      <!-- Modal Help -->
      <Modal
        :open-dialog="propsModalHelp.open"
        @update:openDialog="propsModalHelp.open = false"
      >
        <template #content-modal>
          <div class="mx-4 mb-3">
            <p class="mb-0 text-h6 mb-2">Ayuda</p>
            <p class="mb-0 text-grey-6">
              La contraseña debe cumplir con los siguientes criterios:
            </p>
            <div
              class="row q-col-gutter-md mt-3 bg__helper-password--blue custom__card--border"
            >
              <p v-for="(text, index) in helpPolicyPassword" :key="index">
                {{ text }}
              </p>
            </div>

            <div class="row justify-center q-gutter-md mt-4">
              <div class="col-3 content-center">
                <q-btn
                  class="btn__standart full-width"
                  color="indigo-10"
                  label="Ok"
                  no-caps
                  unelevated
                  @click="propsModalHelp.open = false"
                />
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Modal from '@/components/common/Modal/ModalComponent.vue'
import { defaultIcons } from '@/utils'

// Logic view
import useChangePassword from '@/views/change-password/ChangePassword'

// Import variables
const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  models,
  propsModalSuggestionPassword,
  propsModalHelp,
  helpPolicyPassword,
  changePasswordForm,

  // Methods
  suggestPassword,
  copy,
  execConfirmation,
} = useChangePassword()
</script>

<style lang="scss">
.bg {
  &__helper-password {
    &--blue {
      background: #eff0f6;
    }
  }
}
</style>
