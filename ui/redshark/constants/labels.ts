// Nhan hien thi — dung chung cho issue card, detail, va cac component khac
import type { IssueStatus } from "@/types/issue";

// Priority 1–10: chuyen sang label
export function priorityLabel(p: number): string {
  if (p <= 3) return `Thấp (${p})`;
  if (p <= 7) return `TB (${p})`;
  return `Cao (${p})`;
}

export const statusLabel: Record<IssueStatus, string> = {
  cancelled: "Đã huỷ",
  open: "Mở",
  in_progress: "Đang xử lý",
  closed: "Đã đóng",
};
