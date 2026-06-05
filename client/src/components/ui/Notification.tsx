import { useEffect, useState } from "react";
import type { notificiationProps } from "../../types";

const POSITIONS = {
  topRight: "top-4 right-4",
  topLeft: "top-4 left-4",
  bottomLeft: "bottom-4 left-4",
  bottomRight: "bottom-4 right-4"
};

function Notifications({
  message,
  position = "topRight",
  duration = 2000
}: notificiationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`fixed ${POSITIONS[position]} z-20`}>
      <div
        className={`
          px-4 py-3 rounded shadow text-white bg-red-500
          transition-all duration-500
          ${visible ? "opacity-100" : "opacity-0 translate-y-10"}
        `}
      >
        {message}
      </div>
    </div>
  );
}

export default Notifications;
