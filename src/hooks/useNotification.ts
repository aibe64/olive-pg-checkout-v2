import { App } from "antd";

export type NotificationType = "success" | "error" | "warning" | "info";

interface CustomNotificationFunction {
  onNotify: (
    type: NotificationType,
    message: string,
    description: string
  ) => void;
}

const useNotification = (): CustomNotificationFunction => {
  const { notification } = App.useApp();

  const onNotify = (
    type: NotificationType,
    message: string,
    description: string
  ): void => {
    switch (type) {
      case "success":
        notification.success({
          message,
          description,
          placement: "topLeft",
        });
        break;

      case "error":
        notification.error({
          message,
          description,
          placement: "topLeft",
        });
        break;
      case "warning":
        notification.warning({
          message,
          description,
          placement: "topLeft",
        });
        break;
      default:
        notification.info({
          message,
          description,
          placement: "topLeft",
        });
        break;
    }
  };

  return { onNotify };
};

export default useNotification;
