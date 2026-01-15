import { ICardStatus } from "@/interfaces/global";

export const ACCOUNTING_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'SendHorizontal', // Automático
    bg: "#FFEEE3",
    color: "#333742",
    iconColor: "#E25D0F",
    title: "Automático",
    textColor: "#E25D0F",
  },
  1: {
    icon: "CircleCheck", // Activo
    bg: "#FFEEE3",
    color: "#000",
    iconColor: "#E25D0F",
    title: "Activo",
    textColor: "#000",
  },
  2: {
    icon: "Ban", // Inactivo
    bg: "#DCDCDC",
    color: "#000",
    iconColor: "#9D9EA2",
    title: "Inactivo",
    textColor: "#000",
  },

  // Estados de homologación
  84: {
    icon: "SendHorizontal",
    bg: "#FFEEE3",
    color: "#333742",
    iconColor: "#E25D0F",
    title: "Parcialmente homologado",
    textColor: "#E25D0F",
  },
  85: {
    icon: "CheckCircle",
    bg: "#FFEEE3",
    color: "#333742",
    iconColor: "#E25D0F",
    title: "Proceso exitoso",
    textColor: "#E25D0F",
  },
  86: {
    icon: "XCircle",
    bg: "#FFE7ED",
    color: "#FFFF",
    iconColor: "#581845",
    title: "Proceso fallido",
    textColor: "#000000",
  },
  108: {
    icon: "XCircle",
    bg: "#fad5b7ff",
    color: "#FFFF",
    iconColor: "#581845",
    title: "Con novedades",
    textColor: "#000000",
  },
  73: {
    icon: "XCircle", // Cargado con errores
    bg: "#FFE6E2",
    color: "#333742",
    iconColor: "#B72D18",
    title: "Cargado con errores",
    textColor: "#D20008",
  },
  106: {
    icon: "SendHorizontal", //Validacion momentanea hasta aclarar tema id's
    bg: "#FFEEE3",
    color: "#333742",
    iconColor: "#E25D0F",
    title: "Parcialmente procesado",
    textColor: "#E25D0F",
  },
};
