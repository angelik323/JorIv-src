<template>
  <q-btn-dropdown
    v-if="dropdownOptions?.length"
    :outline="outline"
    :size="size"
    unelevated
    :flat="flat"
    :color="color"
    class="text-capitalize btn-filter"
    :class="classCustom ?? ''"
    :disable="disabled"
    :dropdown-icon="' '"
    content-class="custom-dropdown-button"
    no-caps
    role="button"
    aria-haspopup="listbox"
    :aria-expanded="false"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-label="label ?? 'Opciones desplegables'"
  >
    <template #label>
      <div
        class="row items-center"
        :class="{ 'q-gutter-sm': !!label }"
        :style="styleContent ?? {}"
        role="presentation"
      >
        <Icon
          v-if="icon"
          :name="icon"
          :size="20"
          :color="colorIcon"
          aria-hidden="true"
        />

        <Icon
          v-if="leftIcon"
          :name="leftIcon"
          :size="20"
          :color="colorIcon"
          aria-hidden="true"
        />
        <img
          v-if="leftImg"
          class="image__excel-btn"
          :src="leftImg"
          alt="Icono decorativo"
          role="presentation"
        />
        <p v-if="label" class="mb-0" :style="styleText ?? {}">{{ label }}</p>
        <Icon
          v-if="rightIcon"
          :name="rightIcon"
          :size="20"
          :color="colorIcon"
          aria-hidden="true"
        />
        <img
          v-if="rightImg"
          class="image__excel-btn"
          :src="rightImg"
          alt="Icono decorativo"
          role="presentation"
        />
      </div>
    </template>

    <q-list role="listbox" aria-label="Lista de opciones" separator>
      <!-- MODO AGRUPADO (toggle con submenús) -->
      <template v-if="dropdownGrouped">
        <!-- Grupos -->
        <template v-for="opt in dropdownOptions" :key="`grp-${opt.label}`">
          <q-expansion-item
            v-if="opt.type === 'group'"
            dense
            expand-separator
            header-class="q-px-md min-h-40"
            :disable="opt.disable"
          >
            <!-- HEADER -->
            <template #header>
              <q-item-section avatar>
                <Icon
                  v-if="opt.icon"
                  :name="opt.icon"
                  :size="20"
                  color="#631937"
                  aria-hidden="true"
                />
              </q-item-section>

              <q-item-section>
                <p class="mb-0">{{ opt.label }}</p>
              </q-item-section>
            </template>

            <!-- SUB-OPCIONES -->
            <q-item
              v-for="child in opt.children || []"
              :key="`${opt.label}-${child.label}`"
              clickable
              v-close-popup
              @click="handleOptionClick(child)"
              role="option"
              :aria-label="child.label"
            >
              <q-item-section avatar>
                <Icon
                  v-if="child.icon"
                  :name="child.icon"
                  :size="20"
                  color="#631937"
                  aria-hidden="true"
                />
              </q-item-section>
              <q-item-section>
                <p class="mb-0">{{ child.label }}</p>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>

        <!-- Ítems planos (por ejemplo 'Ambos, modulo clients') -->
        <template v-for="opt in dropdownOptions" :key="`flat-${opt.label}`">
          <q-item
            v-if="opt.type !== 'group'"
            clickable
            v-close-popup
            @click="handleOptionClick(opt)"
            role="option"
            :aria-label="opt.label"
          >
            <q-item-section avatar>
              <Icon
                v-if="opt.icon"
                :name="opt.icon"
                :size="20"
                color="#631937"
                aria-hidden="true"
              />
            </q-item-section>
            <q-item-section>
              <p class="mb-0">{{ opt.label }}</p>
            </q-item-section>
          </q-item>
        </template>
      </template>

      <!-- MODO PLANO (sin pasar la prop :dropdown-grouped="true") -->
      <template v-else>
        <q-item
          v-for="opt in dropdownOptions"
          :key="opt.label"
          clickable
          v-close-popup
          @click="handleOptionClick(opt)"
          role="option"
          :aria-label="opt.label"
          :disable="opt.disable"
        >
          <q-item-section avatar>
            <Icon
              v-if="opt.icon"
              :name="opt.icon"
              :size="20"
              color="#631937"
              aria-hidden="true"
            />
          </q-item-section>
          <q-item-section>
            <p class="mb-0">{{ opt.label }}</p>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-btn-dropdown>

  <q-btn
    v-else
    :outline="outline"
    :size="size"
    unelevated
    :flat="flat"
    :color="color"
    class="custom-rounded"
    :class="[classCustom ?? '', { 'text-capitalize': !noCaps }]"
    :disable="disabled"
    :no-caps="noCaps"
    role="button"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-label="label ?? 'Botón personalizado'"
    @click="
      (e) => {
        if (stopPropagation) e.stopPropagation()
        emit('click', e)
      }
    "
  >
    <div
      class="row q-gutter-sm items-center"
      :style="styleContent ?? {}"
      role="presentation"
    >
      <!-- Icono principal (Lucide) para el botón simple -->
      <Icon
        v-if="icon"
        :name="icon"
        :size="20"
        :color="colorIcon"
        aria-hidden="true"
      />

      <Icon
        v-if="leftIcon"
        :name="leftIcon"
        :size="20"
        :color="colorIcon"
        aria-hidden="true"
      />
      <img
        v-if="leftImg"
        class="image__excel-btn q-mr-sm"
        :src="leftImg"
        alt="Icono decorativo"
        role="presentation"
      />
      <span v-if="label" :style="styleText ?? {}">{{ label }}</span>
      <Icon
        v-if="rightIcon"
        :name="rightIcon"
        :size="20"
        :color="colorIcon"
        aria-hidden="true"
      />
      <img
        v-if="rightImg"
        class="image__excel-btn q-mr-sm"
        :src="rightImg"
        alt="Icono decorativo"
        role="presentation"
      />
    </div>
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon/Icon.vue'
import type { StyleValue } from 'vue'
import { useRouter } from 'vue-router'
import { DropdownOption } from '@/interfaces/global'

withDefaults(
  defineProps<{
    outline: boolean
    label?: string
    rightIcon?: string
    leftIcon?: string
    rightImg?: string
    leftImg?: string
    colorIcon?: string
    size?: string
    classCustom?: string
    color?: string
    flat?: boolean
    styleText?: StyleValue
    styleContent?: StyleValue
    tooltip?: string
    disabled?: boolean
    stopPropagation?: boolean
    noCaps?: boolean
    icon?: string
    dropdownOptions?: DropdownOption[]
    dropdownGrouped?: boolean
  }>(),
  {
    color: 'primary_fiduciaria',
    colorIcon: '#F45100',
    disabled: false,
    stopPropagation: false,
    noCaps: false,
    dropdownGrouped: false,
  }
)

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent | Event): void
  (e: 'select', opt: DropdownOption): void
}>()

const router = useRouter()

const handleOptionClick = async (opt: DropdownOption) => {
  emit('select', opt)

  if (opt.route) {
    await router.push(opt.route)
    return
  }

  if (opt.routeName) {
    await router.push({ name: opt.routeName })
    return
  }

  if (typeof opt.action === 'function') {
    opt.action()
  }
}
</script>

<style lang="scss" src="./Button.scss" />
