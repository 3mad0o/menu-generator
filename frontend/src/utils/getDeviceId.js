// generate once and save in localStorage
import { nanoid } from "nanoid";

function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = nanoid(); // short unique ID
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

export default getDeviceId;
