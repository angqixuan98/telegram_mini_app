import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    tg.expand();

    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    tg.MainButton.setText("Confirm");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
      tg.sendData(
        JSON.stringify({
          action: "confirm",
          user_id: tg.initDataUnsafe.user.id,
        })
      );
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Telegram Mini App</h2>

      {user ? (
        <>
          <p>👋 Hello, {user.first_name}</p>
          <p>User ID: {user.id}</p>
        </>
      ) : (
        <p>Loading Telegram user...</p>
      )}
    </div>
  );
}
