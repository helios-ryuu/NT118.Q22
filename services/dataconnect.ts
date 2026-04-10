// Khoi tao Firebase Data Connect — phai duoc import truoc khi goi bat ky FDC function nao
import { Platform } from "react-native";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";
import { app } from "@/services/firebase";

export const dataConnect = getDataConnect(app, connectorConfig);

if (__DEV__) {
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  connectDataConnectEmulator(dataConnect, host, 9399);
}
