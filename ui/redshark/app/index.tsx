import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// Để switch sang production: xem ui/redshark/.env
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8080";

type DbStatus = "checking" | "ready" | "unavailable";

const STATUS_LABEL: Record<DbStatus, string> = {
  checking: "Đang kiểm tra kết nối...",
  ready: "Database sẵn sàng",
  unavailable: "Không kết nối được database",
};

export default function Index() {
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");

  useEffect(() => {
    fetch(`${API_URL}/actuator/health`)
      .then((res) => res.json())
      .then((data) => {
        setDbStatus(data?.components?.db?.status === "UP" ? "ready" : "unavailable");
      })
      .catch(() => setDbStatus("unavailable"));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{STATUS_LABEL[dbStatus]}</Text>
    </View>
  );
}
