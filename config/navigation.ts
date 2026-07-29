import {
  Building2,
  ClipboardList,
  Factory,
  FileSearch,
  Gauge,
  Hospital,
  PackageOpen,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
export const navigation = [
  {
    label: "Visão geral",
    items: [{ label: "Dashboard", href: "/dashboard", icon: Gauge }],
  },
  {
    label: "Operação",
    items: [
      { label: "Solicitações", href: "/solicitacoes", icon: ClipboardList },
      { label: "Materiais", href: "/materiais", icon: PackageOpen },
      { label: "Hospitais", href: "/hospitais", icon: Hospital },
      { label: "Convênios", href: "/convenios", icon: ShieldCheck },
      { label: "Fornecedores", href: "/fornecedores", icon: Factory },
    ],
  },
  {
    label: "Governança",
    items: [
      { label: "Auditoria", href: "/auditoria", icon: FileSearch },
      { label: "Usuários", href: "/usuarios", icon: Users },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
] as const;
export const product = {
  name: "CAF Gestão",
  descriptor: "Central Administrativa",
  icon: Building2,
};
