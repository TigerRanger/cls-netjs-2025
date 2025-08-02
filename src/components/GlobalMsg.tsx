"use client";

import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import { useState, useEffect, useRef } from "react";

type GlobalMsgEvent = CustomEvent<{ content: string; type: string }>;

function GlobalMsg() {
  
  const [show, setShow] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<string>("success");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShow = (message: string, alertType: string = "success") => {
    setContent(message);
    setType(alertType);
    setShow(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto-hide the modal after 1 second
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      setContent("");
    }, 2000);
  };

  const handleClose = () => {
    setShow(false);
    setContent("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const handleOpen = (event: GlobalMsgEvent) => {
      if (event.detail) {
        handleShow(event.detail.content, event.detail.type);
      }
    };

    const handleCloseEvent = () => {
      handleClose();
    };

    window.addEventListener("openMsgModal", handleOpen as EventListener);
    window.addEventListener("closeMsgModal", handleCloseEvent);

    // Cleanup listeners and timeout
    return () => {
      window.removeEventListener("openMsgModal", handleOpen as EventListener);
      window.removeEventListener("closeMsgModal", handleCloseEvent);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} id="main_MSG_Body">
      <Modal.Body>
          <Alert variant={type} onClose={() => setShow(false)} dismissible>
            <div className="main-msg-body" dangerouslySetInnerHTML={{ __html: content }} />
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default GlobalMsg;
