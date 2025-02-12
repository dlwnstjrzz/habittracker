import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 알림 권한 요청 및 설정
export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

// 알림 스케줄링
export async function scheduleNotification(
  todoId: string,
  todoText: string,
  dateTime: Date // "2/12/2025, 11:59:00 PM" 형식
) {
  try {
    await cancelNotification(todoId);

    // 로컬 시간 문자열을 Date 객체로 변환
    // const dateTime = new Date(dateTimeStr);

    // console.log("Scheduling notification for:", dateTimeStr);
    // console.log("Converted to Date:", dateTime);

    // 새로운 알림 스케줄링
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "할 일 알림",
        body: todoText,
        data: { todoId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dateTime,
      },
    });

    return identifier;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

// 알림 취소
export async function cancelNotification(todoId: string) {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const notification = scheduledNotifications.find(
      (n) => n.content.data?.todoId === todoId
    );

    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}
