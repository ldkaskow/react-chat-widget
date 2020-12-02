import React, { useRef, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import data from 'emoji-mart/data/google.json'
import { NimblePicker } from 'emoji-mart';
import { useSelector } from 'react-redux';
import { FiPaperclip } from 'react-icons/fi';
import { FaRegSmile } from 'react-icons/fa';

import { GlobalState } from 'src/store/types';

const send = require('../../../../../../../assets/send_button.svg') as string;
import { AnyFunction } from '../../../../../../utils/types';

import './style.scss';
import './emoji-mart.scss'

type Props = {
  placeholder: string;
  disabledInput: boolean;
  autofocus: boolean;
  sendMessage: (event: any) => void;
  buttonAlt: string;
  onTextInputChange?: (event: any) => void;
  handleClickAttachmentLauncher?: AnyFunction;
  toggleEmojiTray: AnyFunction;
  saveNewMessageState: AnyFunction;
}

function Sender({ sendMessage, placeholder, disabledInput, autofocus, onTextInputChange, buttonAlt, handleClickAttachmentLauncher, toggleEmojiTray, saveNewMessageState }: Props) {
  const showChat = useSelector((state: GlobalState) => state.behavior.showChat);
  const showEmojiTray = useSelector((state: GlobalState) => state.behavior.showEmojiTray)
  const newmessage = useSelector((state: GlobalState) => state.messages.newMessageText)
  const cursorPos = useSelector((state: GlobalState) => state.messages.cursorPosition)

  console.log(cursorPos)

  const inputRef = useRef(null);
  // @ts-ignore
  useEffect(() => { if (showChat) inputRef.current?.focus(); }, [showChat]);

  return (
    <form className="rcw-sender" onSubmit={sendMessage} style={{position: 'relative'}}>
      <FaRegSmile
        onClick={toggleEmojiTray}
        style={{width: '30px', padding: '0px 5px', height: '30px', cursor: 'pointer'}}
      />

      {
        showEmojiTray && (
          <NimblePicker
            set='google'
            data={data}
            style={{position: 'absolute', bottom: '55px', left: '0px', width: '100%'}}
            showPreview={false}
            emojiTooltip={true}
            skin={1}
            enableFrequentEmojiSort={true}
            emojiSize={26}
            theme='light'
            onSelect={em=>{
              // update the working message with emoji at active cursor position
              let cursorPosition = inputRef.current.selectionStart
              let textBeforeCursorPosition = newmessage.substring(0, cursorPosition)
              let textAfterCursorPosition = newmessage.substring(cursorPosition, newmessage.length)
              let updatedMsg = textBeforeCursorPosition + em.native + textAfterCursorPosition

              saveNewMessageState(updatedMsg, cursorPosition);
            }}
          />
        )
      }

      <TextareaAutosize
        className="rcw-new-message"
        name="message"
        ref={inputRef}
        placeholder={placeholder}
        disabled={disabledInput}
        autoFocus={autofocus}
        autoComplete="off"
        value={newmessage}
        onChange={e=>{saveNewMessageState(e.target.value)}}
      />

      <FiPaperclip style={{width: '30px', padding: '0px 5px', height: '25px', cursor: 'pointer'}} onClick={handleClickAttachmentLauncher} />
      <button type="submit" className="rcw-send">
        <img src={send} className="rcw-send-icon" alt={buttonAlt} />
      </button>
    </form>
  );
}

export default Sender;
