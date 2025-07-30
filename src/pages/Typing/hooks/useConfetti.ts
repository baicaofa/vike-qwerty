import { useEffect } from "react";
import { confetti } from "@/utils/confetti";

export function useConfetti(state: boolean) {
  useEffect(() => {
    let leftConfettiTimer: number | undefined;
    let rightConfettiTimer: number | undefined;
    if (state) {
      leftConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
        });
      }, 250);
      rightConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
        });
      }, 400);
    }
    return () => {
      window.clearTimeout(leftConfettiTimer);
      window.clearTimeout(rightConfettiTimer);
    };
  }, [state]);
}
