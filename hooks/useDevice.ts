import * as Device from "expo-device";

export const useDevice = () => {
  const deviceType = Device.deviceType || Device.DeviceType.UNKNOWN;
  const isTablet = deviceType === Device.DeviceType.TABLET;
  const isPhone = deviceType === Device.DeviceType.PHONE;
  const isDesktop = deviceType === Device.DeviceType.DESKTOP;

  return {
    osName: Device.osName,
    deviceType,
    isTablet,
    isPhone,
    isDesktop,
    modelName: Device.modelName,
    brand: Device.brand,
  };
};
