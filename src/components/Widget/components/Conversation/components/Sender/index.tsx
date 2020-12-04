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
  const showEmojiTray = useSelector((state: GlobalState) => state.messages.showEmojiTray)
  const newmessage = useSelector((state: GlobalState) => state.messages.newMessageText)
  const cursorPos = useSelector((state: GlobalState) => state.messages.cursorPosition)

  const inputRef = useRef(null);
  const formRef = useRef(null);

  // @ts-ignore
  useEffect(() => { if (showChat) inputRef.current?.focus(); }, [showChat]);

  let messageBarHeight = formRef !== null && formRef.current !== null ? formRef.current['clientHeight'] : 55;

  return (
    <form
      className="rcw-sender"
      onSubmit={sendMessage}
      style={{position: 'relative'}}
      ref={formRef}
    >
      <FaRegSmile
        onClick={toggleEmojiTray}
        style={{width: '30px', padding: '0px 5px', height: '30px', cursor: 'pointer'}}
      />

      {
        showEmojiTray && (
          <NimblePicker
            set='google'
            data={data}
            style={{position: 'absolute', bottom: `${messageBarHeight}px`, left: '0px', width: '100%'}}
            showPreview={false}
            emojiTooltip={true}
            skin={1}
            enableFrequentEmojiSort={false}
            emojiSize={26}
            theme='light'
            onSelect={em=>{
              let sym = em.unified.split('-')
              let codesArray = []
              sym.forEach(el => codesArray.push('0x' + el))
              let emoji = String.fromCodePoint(...codesArray)
              let updatedMsg = [newmessage.slice(0, cursorPos), emoji, newmessage.slice(cursorPos)].join('')
              saveNewMessageState(updatedMsg, cursorPos+emoji.length);
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
        onClick={()=>{
          let cursorPosition = inputRef !== null && inputRef.current !== null ? inputRef.current['selectionStart'] : 0
          saveNewMessageState(newmessage, cursorPosition)
        }}
        onChange={e=>{
          let cursorPosition = inputRef !== null && inputRef.current !== null ? inputRef.current['selectionStart'] : 0
          saveNewMessageState(e.target.value, cursorPosition)
        }}
        onKeyDown={e=>{
          // submit on enter key
          if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            formRef.current.dispatchEvent(new Event("submit", {cancelable: true}));
          }
        }}
      />

      <FiPaperclip style={{width: '30px', padding: '0px 5px', height: '30px', cursor: 'pointer'}} onClick={handleClickAttachmentLauncher} />
      <button type="submit" className="rcw-send">
        <img src={send} className="rcw-send-icon" alt={buttonAlt} />
      </button>
    </form>
  );
}

export default Sender;
