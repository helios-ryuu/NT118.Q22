// Nhan hien thi — dung chung cho cac component
import type { IssueStatus } from "@/types/issue";
import type { IdeaStatus } from "@/types/idea";

export const statusLabel: Record<IssueStatus, string> = {
  CANCELLED: "Đã huỷ",
  OPEN: "Mở",
  IN_PROGRESS: "Đang xử lý",
  CLOSED: "Đã đóng",
};

export const ideaStatusLabel: Record<IdeaStatus, string> = {
  ACTIVE: "Đang hoạt động",
  CLOSED: "Đã đóng",
  CANCELLED: "Đã huỷ",
};
