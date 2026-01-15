<template>
  <div
    class="accessibility-drawer"
    :class="{ 'accessibility-drawer--expanded': isExpanded }"
  >
    <div class="accessibility-container">
      <Button
        class="accessibility-toggle custom"
        class-custom="q-pa-sm"
        size="lg"
        color-icon="white"
        color="orange"
        :left-icon="defaultIconsLucide.accessibility"
        :outline="false"
        :tooltip="
          isExpanded
            ? 'Cerrar menú de accesibilidad'
            : 'Abrir menú de accesibilidad'
        "
        :aria-label="
          isExpanded
            ? 'Cerrar menú de accesibilidad'
            : 'Abrir menú de accesibilidad'
        "
        @click="toggleExpanded"
      />

      <div class="accessibility-menu">
        <h1 class="text-black-90 text-weight-bold no-margin">
          Herramientas de accesibilidad
        </h1>

        <div class="accessibility-options">
          <!-- Botón disminuir texto -->
          <Button
            label="Disminuir texto"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.minus"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="isMinFontSize || !isExpanded"
            aria-label="Disminuir tamaño de texto"
            :aria-disabled="isMinFontSize || !isExpanded ? 'true' : 'false'"
            @click="decreaseFontSize"
          />

          <!-- Botón aumentar texto -->
          <Button
            label="Aumentar texto"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.plus"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="isMaxFontSize || !isExpanded"
            aria-label="Aumentar tamaño de texto"
            @click="increaseFontSize"
          />

          <!-- Botón escala de grises  -->
          <Button
            label="Escala de grises"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.barcode"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="!isExpanded"
            :aria-label="
              grayscaleMode
                ? 'Desactivar escala de grises'
                : 'Activar escala de grises'
            "
            :aria-pressed="grayscaleMode ? 'true' : 'false'"
            @click="toggleGrayscale"
          />

          <!-- Botón cambiar contraste  -->
          <Button
            label="Alto contraste"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.contrast"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="!isExpanded"
            :aria-label="
              highContrastMode
                ? 'Desactivar modo alto contraste'
                : 'Activar modo alto contraste'
            "
            :aria-pressed="highContrastMode ? 'true' : 'false'"
            @click="toggleContrast"
          />

          <!-- Botón resaltar botones -->
          <Button
            label="Resaltar botones"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.highlighter"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="!isExpanded"
            :aria-label="
              highlightLinksMode
                ? 'Desactivar resaltado de botones'
                : 'Activar resaltado de botones'
            "
            :aria-pressed="highlightLinksMode ? 'true' : 'false'"
            @click="toggleHighlightLinks"
          />

          <!-- Botón restablecer  -->
          <Button
            label="Restablecer"
            size="md"
            color="orange"
            :left-icon="defaultIconsLucide.rotateCcw"
            flat
            no-caps
            unelevated
            :outline="false"
            :disabled="!hasChanges || !isExpanded"
            aria-label="Restaurar ajustes predeterminados"
            @click="resetAll"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import useAccessibilityBar from '@/components/common/AccessibilityBar/AccessibilityBar'

const {
  isExpanded,
  highContrastMode,
  highlightLinksMode,
  grayscaleMode,
  isMinFontSize,
  isMaxFontSize,
  hasChanges,
  toggleExpanded,
  increaseFontSize,
  decreaseFontSize,
  toggleContrast,
  toggleHighlightLinks,
  toggleGrayscale,
  resetAll,
} = useAccessibilityBar()
</script>

<style lang="scss" src="./AccessibilityBar.scss" />
