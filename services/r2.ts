// Upload ảnh lên Cloudflare R2
// Yêu cầu thêm vào .env:
//   EXPO_PUBLIC_R2_ENDPOINT   — https://<account-id>.r2.cloudflarestorage.com
//   EXPO_PUBLIC_R2_BUCKET     — tên bucket
//   EXPO_PUBLIC_R2_TOKEN      — Cloudflare API Token có quyền write vào bucket

const ENDPOINT = process.env.EXPO_PUBLIC_R2_ENDPOINT;
const BUCKET = process.env.EXPO_PUBLIC_R2_BUCKET;
const TOKEN = process.env.EXPO_PUBLIC_R2_TOKEN;

// Trả về public URL của object sau khi upload
// Nếu chưa cấu hình R2, trả về localUri (dev fallback)
export async function uploadAvatarToR2(localUri: string, userId: string): Promise<string> {
  if (!ENDPOINT || !BUCKET || !TOKEN) {
    console.warn("[R2] Chưa cấu hình R2 — dùng local URI");
    return localUri;
  }

  const ext = localUri.split(".").pop()?.split("?")[0] ?? "jpg";
  const filename = `avatars/${userId}_${Date.now()}.${ext}`;
  const uploadUrl = `${ENDPOINT}/${BUCKET}/${filename}`;

  const fileResponse = await fetch(localUri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": blob.type || "image/jpeg",
    },
    body: blob,
  });

  if (!res.ok) {
    throw new Error(`R2 upload thất bại: ${res.status}`);
  }

  // Public URL của object (cần enable public access trên bucket)
  return `${ENDPOINT}/${BUCKET}/${filename}`;
}
