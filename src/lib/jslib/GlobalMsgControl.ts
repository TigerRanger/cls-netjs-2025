export const showMsg = (content: string, type: string = "success"): void => {
    const event = new CustomEvent<{ content: string; type: string }>("openMsgModal", {
      detail: { content, type },
    });
    window.dispatchEvent(event);
  };
  
  export const closeMsgModal = (): void => {
    window.dispatchEvent(new Event("closeMsgModal"));
  };
  