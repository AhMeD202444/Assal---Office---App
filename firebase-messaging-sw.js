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

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'إشعار جديد';
  const options = {
    body: payload.notification?.body || '',
    icon: '/Assal---Office---App/images/logo.png'
  };

  self.registration.showNotification(title, options);
});