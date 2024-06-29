import { initializeApp } from "@firebase/app";
import { getMessaging, getToken } from "@firebase/messaging";
import api from "../redux/actions/api";

const firebaseConfig = {
  apiKey: "AIzaSyCbkn_sVCzyZgtpZ4uTfxeJCel2v5Mjrxk",
  authDomain: "woofnosis-4e2d1.firebaseapp.com",
  projectId: "woofnosis-4e2d1",
  storageBucket: "woofnosis-4e2d1.appspot.com",
  messagingSenderId: "428337066751",
  appId: "1:428337066751:web:db1ef4e2117a1cbd0552ca",
  measurementId: "G-NKPEM81RFS",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const enableNotificationService = async () => {
  //getting Notification Permission
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Notification Permission denied");
    }
  });
  const fcmToken = localStorage.getItem("fcmToken");

  if (!fcmToken) {
    getToken(messaging, {
      vapidKey:
        "BE5YugjDraKe7OZtqaHaQHtoO01bu268ORWOHHWqWOmoIPOMXgABGk5y6EAZN2j4bFoiAPDR2kiBwUiXkYveZnw",
    })
      .then(async (currentToken) => {
        if (currentToken) {
          try {
            await api({ contentType: true, auth: true }).patch(
              "users/saveToken",
              { token: currentToken }
            );
            localStorage.setItem("fcmToken", currentToken);
            console.log("push notification token", currentToken);
          } catch (err) {
            console.log("Update token error", err);
          }
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }
};
