import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GlobalState } from 'src/store/types';

import { toggleChat, toggleEmoji, addUserMessage, saveWorkingMessage } from '../../store/actions';
import { AnyFunction } from '../../utils/types';

import WidgetLayout from './layout';

type Props = {
  title: string;
  titleAvatar?: string;
  subtitle: string;
  senderPlaceHolder: string;
  profileAvatar?: string;
  showCloseButton: boolean;
  fullScreenMode: boolean;
  autofocus: boolean;
  customLauncher?: AnyFunction;
  handleNewUserMessage: AnyFunction;
  handleClickAttachmentLauncher?: AnyFunction;
  handleQuickButtonClicked?: AnyFunction;
  handleTextInputChange?: (event: any) => void;
  chatId: string;
  launcherOpenLabel: string;
  launcherCloseLabel: string;
  sendButtonAlt: string;
  showTimeStamp: boolean;
  imagePreview?: boolean;
  zoomStep?: number;
  handleSubmit?: AnyFunction;
  suppressAutoMessageDispatch: boolean;
}

function Widget({
  title,
  titleAvatar,
  subtitle,
  senderPlaceHolder,
  profileAvatar,
  showCloseButton,
  fullScreenMode,
  autofocus,
  customLauncher,
  handleNewUserMessage,
  handleClickAttachmentLauncher,
  handleQuickButtonClicked,
  handleTextInputChange,
  chatId,
  launcherOpenLabel,
  launcherCloseLabel,
  sendButtonAlt,
  showTimeStamp,
  imagePreview,
  zoomStep,
  handleSubmit,
  suppressAutoMessageDispatch
}: Props) {
  const dispatch = useDispatch();
  const showEmojiTray = useSelector((state: GlobalState) => state.messages.showEmojiTray)

  const toggleConversation = () => {
    dispatch(toggleChat());
  }

  const toggleEmojiTray = () => {
    dispatch(toggleEmoji());
  }

  const saveWorkingMessagee = (msg, cursorPos) => {
    dispatch(saveWorkingMessage(msg, cursorPos));
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const userInput = event.target.message.value;

    console.log('suppress', suppressAutoMessageDispatch)

    if (!userInput.trim()) {
      return;
    }

    handleSubmit?.(userInput);
    // if user has indicated in props
    // do not automatically post the user message to chat - want to use a custom crafted message in our widget
    if (!suppressAutoMessageDispatch) {
      dispatch(addUserMessage(userInput));
    }
    handleNewUserMessage(userInput);
    // close emoji tray after sending message if open
    if (showEmojiTray) {
      toggleEmojiTray();
    }
    // empty new message bar
    saveWorkingMessagee('', 0);
    event.target.message.value = '';
  }

  const onQuickButtonClicked = (event, value) => {
    event.preventDefault();
    handleQuickButtonClicked?.(value)
  }

  return (
    <WidgetLayout
      onToggleConversation={toggleConversation}
      onToggleEmojiTray={toggleEmojiTray}
      onSaveNewMessageState={saveWorkingMessagee}
      onSendMessage={handleMessageSubmit}
      handleClickAttachmentLauncher={handleClickAttachmentLauncher}
      onQuickButtonClicked={onQuickButtonClicked}
      title={title}
      titleAvatar={titleAvatar}
      subtitle={subtitle}
      senderPlaceHolder={senderPlaceHolder}
      profileAvatar={profileAvatar}
      showCloseButton={showCloseButton}
      fullScreenMode={fullScreenMode}
      autofocus={autofocus}
      customLauncher={customLauncher}
      onTextInputChange={handleTextInputChange}
      chatId={chatId}
      launcherOpenLabel={launcherOpenLabel}
      launcherCloseLabel={launcherCloseLabel}
      sendButtonAlt={sendButtonAlt}
      showTimeStamp={showTimeStamp}
      imagePreview={imagePreview}
      zoomStep={zoomStep}
      suppressAutoMessageDispatch={suppressAutoMessageDispatch}
    />
  );
}

export default Widget;
