// Using a third party library for modals
// See https://github.com/reactjs/react-modal
import { useState } from "react";
import Modal from "react-modal";

import { THEME } from "@/constants/theme";

Modal.setAppElement("#__next");

if (Modal.defaultStyles.overlay) {
  Modal.defaultStyles.overlay.backgroundColor = "rgba(16, 21, 33, 0.33)";
  Modal.defaultStyles.overlay.zIndex = "10000";
}

// Requires setting height and width with inset because modal is positioned absolutely
if (Modal.defaultStyles.content) {
  Modal.defaultStyles.content.opacity = 1;
  Modal.defaultStyles.content.borderColor = "none";
  Modal.defaultStyles.content.borderRadius = THEME.LIGHT.borderRadius.sm;
  Modal.defaultStyles.content.inset = "calc(50% - 144px) calc(50% - 230px)";
  Modal.defaultStyles.content.padding = "48px";
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModalVisibility = () => setIsOpen(previousState => !previousState);

  return { isOpen, toggleModalVisibility };
}

export default Modal;
