import type { InputRef } from "antd";
import { useRef, useEffect } from "react";

const useDisableEvent = () => {
  const cardNumberInputRef = useRef<InputRef>(null);
  const expiryInputRef = useRef<InputRef>(null);
  const cvvInputRef = useRef<InputRef>(null);

  useEffect(() => {
    const cardNumber = cardNumberInputRef.current?.input;

    if (cardNumber) {
      const handleCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleCut = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "c" || e.key === "x" || e.key === "v")
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      cardNumber.addEventListener("copy", handleCopy);
      cardNumber.addEventListener("paste", handlePaste);
      cardNumber.addEventListener("cut", handleCut);
      cardNumber.addEventListener("keydown", handleKeyDown);
      cardNumber.addEventListener("contextmenu", handleContextMenu);

      return () => {
        cardNumber.removeEventListener("copy", handleCopy);
        cardNumber.removeEventListener("paste", handlePaste);
        cardNumber.removeEventListener("cut", handleCut);
        cardNumber.removeEventListener("keydown", handleKeyDown);
        cardNumber.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, []);

  useEffect(() => {
    const expiry = expiryInputRef.current?.input;

    if (expiry) {
      const handleCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleCut = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "c" || e.key === "x" || e.key === "v")
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      expiry.addEventListener("copy", handleCopy);
      expiry.addEventListener("paste", handlePaste);
      expiry.addEventListener("cut", handleCut);
      expiry.addEventListener("keydown", handleKeyDown);
      expiry.addEventListener("contextmenu", handleContextMenu);

      return () => {
        expiry.removeEventListener("copy", handleCopy);
        expiry.removeEventListener("paste", handlePaste);
        expiry.removeEventListener("cut", handleCut);
        expiry.removeEventListener("keydown", handleKeyDown);
        expiry.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, []);

  useEffect(() => {
    const cvv = cvvInputRef.current?.input;

    if (cvv) {
      const handleCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleCut = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "c" || e.key === "x" || e.key === "v")
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      cvv.addEventListener("copy", handleCopy);
      cvv.addEventListener("paste", handlePaste);
      cvv.addEventListener("cut", handleCut);
      cvv.addEventListener("keydown", handleKeyDown);
      cvv.addEventListener("contextmenu", handleContextMenu);

      return () => {
        cvv.removeEventListener("copy", handleCopy);
        cvv.removeEventListener("paste", handlePaste);
        cvv.removeEventListener("cut", handleCut);
        cvv.removeEventListener("keydown", handleKeyDown);
        cvv.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, []);
  return { cardNumberInputRef, cvvInputRef, expiryInputRef };
};

export default useDisableEvent;
