importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDY-ZPogbPPNTWavB-zn5Z24yXjz2AL4T8",
  authDomain: "assal-app-stats.firebaseapp.com",
  databaseURL: "https://assal-app-stats-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "assal-app-stats",
  storageBucket: "assal-app-stats.firebasestorage.app",
  messagingSenderId: "93855149206",
  appId: "1:93855149206:web:a8449da9ede8965f5b26b7"
});

const messaging = firebase.messaging();
const ASSAL_APP_SCOPE = '/Assal---Office---App/';
const ASSAL_DEFAULT_ICON = '/Assal---Office---App/images/logo.png';

function pickPayloadValue(payload, ...keys) {
  for (const key of keys) {
    const fromNotification = payload && payload.notification ? payload.notification[key] : undefined;
    if (fromNotification) return fromNotification;
    const fromData = payload && payload.data ? payload.data[key] : undefined;
    if (fromData) return fromData;
  }
  return '';
}

function buildAssalNotificationOptions(payload) {
  const data = payload && payload.data ? payload.data : {};
  const title = pickPayloadValue(payload, 'title', 'notificationTitle', 'displayTitle') || 'إشعار جديد';
  const body = pickPayloadValue(payload, 'body', 'message', 'notificationBody', 'displayBody') || '';
  const clickAction = data.clickAction || data.link || data.url || ASSAL_APP_SCOPE;

  return {
    title,
    options: {
      body,
      icon: data.icon || ASSAL_DEFAULT_ICON,
      badge: data.badge || ASSAL_DEFAULT_ICON,
      dir: 'rtl',
      lang: 'ar',
      tag: data.eventId || data.requestId || data.invoiceId || 'assal-web-push',
      renotify: true,
      data: {
        ...data,
        clickAction
      }
    }
  };
}

messaging.onBackgroundMessage(function(payload) {
  const built = buildAssalNotificationOptions(payload || {});
  self.registration.showNotification(built.title, built.options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const data = event.notification && event.notification.data ? event.notification.data : {};
  const rawUrl = data.clickAction || ASSAL_APP_SCOPE;
  const targetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      try {
        if (client.url && client.url.startsWith(self.location.origin + ASSAL_APP_SCOPE)) {
          await client.focus();
          if (client.postMessage) client.postMessage({ type: 'ASSAL_NOTIFICATION_CLICK', data });
          return;
        }
      } catch (_) {}
    }
    await clients.openWindow(targetUrl);
  })());
});
