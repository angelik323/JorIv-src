<script setup lang="ts">
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

// Icons
/* Eye,
  EyeOff,
  File,
  Pencil,
  Pause,
  Play,
  Plus,
  PlusCircle,
  LockReset,
  Lock,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  RotateCw,
  Search,
  Calendar,
  HeartOff,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  User,
  Unlock,
  List,
  Key,
  FileText,
  Laptop,
  Banknote,
  Info,
  InfoIcon,
  RefreshCw,
  ClipboardList,
  ViewList,
  Trash,
  Copy,
  RefreshCcw,
  History,
  Minus,
  ArrowRight,
  Car,
  FileText as PdfFile,
  Link,
  Paperclip,
  MousePointerClick,
  FirstAid,
  ClipboardCheck, */

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
    strokeWidth?: number
    defaultClass?: string
    styleCustom?: object
  }>(),
  {
    size: 24,
    color: '#F45100',
    strokeWidth: 2,
    defaultClass: 'lucide-icon',
  }
)

const icon = computed(() => (icons as Record<string, any>)[props.name])
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
    :style="styleCustom"
  >
    <q-badge floating color="red">2</q-badge>
  </component>
</template>
