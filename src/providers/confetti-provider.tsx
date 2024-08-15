"use client"
import { useConfetti } from "@/hooks/use-confetti";
import Confetti from 'react-confetti';

export const ConfettiProvider = () => {
  const { isOpen, onClose } = useConfetti();
  if (!isOpen) return null;
  return (
    <Confetti
    className="pointer-events-none z-[100]"
    numberOfPieces={500}
    recycle={false}
    onConfettiComplete={onClose}
    />

  );
}
