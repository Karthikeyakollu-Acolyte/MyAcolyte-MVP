"use client";
import { MenuIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from './sidebar';
import Image from 'next/image';
import emojis from '../../public/emojis.svg';
import paperclip from '../../public/paperclip.svg';
import send from '../../public/send.svg';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from "../ui/text-generate-effect";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  name: string;
  avatar: string;
  time: string; // Add time property
}

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What is the goal of the authors?",
    "What is the main issue discussed in the text?",
    'What is the "old implicit compact" mentioned in the text?',
    "Who are the authors of the text?"
  ];

  const dummy = "While invertebrate brains arise from paired segmental ganglia..."; // Shortened for brevity.

  const userAvatar = "https://via.placeholder.com/150/0000FF/808080?Text=User+Avatar";
  const botAvatar = "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bot+Avatar";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll to bottom when messages change

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      name: 'You',
      avatar: '', // Example avatar path
      time: new Date().toLocaleTimeString(), // Get the current time
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now(),
        text: `I'm a simulated response to The log should provide more details about what exactly caused the error. Look for additional lines that describe what was happening before the EBUSY error. There could be useful context about file locks, processes in use, or other underlying issues.: "${dummy}"`,
        sender: 'acolyte',
        name: 'Acolyte',
        avatar: '', // Example bot avatar path
        time: new Date().toLocaleTimeString(), // Get the current time
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const resetChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full h-[991px] bg-[#F9FAFB] relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10 h-9 w-9 rounded-lg hover:bg-gray-200"
        onClick={toggleSidebar}
      >
        <MenuIcon className="icon" />
      </Button>

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-[420px]" : "ml-0"}`}
      >
        <div className="flex flex-col items-center justify-start h-full px-4 max-w-full text-center overflow-hidden">
          {messages.length === 0 ? (
            <div className="my-auto">
              <h2 className="text-[3.5rem] font-rubik font-medium leading-tight mb-4 text-transparent bg-gradient-to-r from-[#8468D0] to-[#000000] bg-clip-text">
                Hello, to be Doctor.
              </h2>
              <p className="text-[3.5rem] font-rubik font-medium mb-8 text-transparent bg-gradient-to-r from-[#010101] to-[#38A169] bg-clip-text">
                How can I be your companion
              </p>

              <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 mb-16">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    <p className="text-base">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 max-h-[809px] w-full max-w-full pt-10 pb-5 px-8 mt-3 overflow-scroll scrollbar-hidden">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`mb-4 p-4 rounded-lg shadow-md relative ${
                    message.sender === "user"
                      ? "bg-blue-100 text-right ml-auto max-w-[80%]"
                      : "bg-gray-100 text-left mr-auto max-w-[80%]"
                  }`}
                  style={{
                    maxWidth: '70%',
                    width: 'fit-content',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Avatar and name outside of the message box */}
                  <div
                    className={`absolute ${message.sender === "user" ? "-right-8 flex-row-reverse" : "-left-8"} top-[-45px] flex gap-2 items-center`}
                    style={{ zIndex: 1 }}
                  >
                    <Image
                      alt={message.name}
                      src={message.name === "Acolyte" ? botAvatar : userAvatar}
                      className="w-10 h-10 rounded-full"
                      width={10}
                      height={10}
                    />
                    <div className="flex items-center gap-3 w-full text-gray-600 mb-3">
                      <p className='text-xl'>{message.name}</p>
                      <p className='text-md'>{message.time}</p> {/* Display time next to the name */}
                    </div>
                  </div>

                  {/* Message content */}
                  <TextGenerateEffect words={message.text} />
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="h-[76px] mx-auto w-[1393px] px-3.5 py-[13px] mb-11 bg-white rounded-[15px] shadow-[0px_0.19090910255908966px_0.5727272629737854px_0px_rgba(0,0,0,0.11)] border-2 border-[#a69ac7] justify-between items-center inline-flex">
          <input
            type="text"
            placeholder="Type a new message here"
            className="text-black text-2xl font-normal font-['Rubik'] leading-relaxed p-2.5 bg-transparent border-none outline-none w-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <div className="justify-end items-center gap-5 flex">
            <Image alt="emojis" src={emojis} />
            <Image alt="paperclip" src={paperclip} />
            <Button onClick={handleSendMessage} className="p-0 bg-transparent hover:bg-transparent">
              <Image alt="send" src={send} />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
      >
        <Sidebar resetChat={resetChat} />
      </div>
    </div>
  );
}
