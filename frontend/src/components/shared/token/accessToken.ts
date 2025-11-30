import { getDeviceFingerprint } from "@/utils/getDeviceFingerprint";
import axios from "axios";

export const GetAccessToken = async (userId: string) => {
  const fingerprint = getDeviceFingerprint();
  if (!userId) return;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL_API}Device/GetAccessTokens?userId=${userId}&fingerprint=${fingerprint}`
    );
    return res.data[0]?.accessToken ?? null;
  } catch (err) {
    return null;
  }
};
