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
import { TextGenerateEffect } from "./ui/text-generate-effect";
import Markdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  name: string;
  avatar: string;
  time: string;
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

  const userAvatar = "https://via.placeholder.com/150/0000FF/808080?Text=User+Avatar";
  const botAvatar = "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bot+Avatar";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function getModelResponse(question: string) {
    try {
      const response = await fetch('/api/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const result = await response.json();

      if (result.data) {
        return result.data.choices[0]?.message?.content;
      } else {
        console.error('Error:', result.error);
        return result.error;
      }
    } catch (error) {
      console.error('Request failed:', error);
      return `Request failed: ${error}`;
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      name: 'You',
      avatar: userAvatar,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');

    const response = await getModelResponse(inputMessage);

    const botResponse: Message = {
      id: Date.now(),
      text: response,
      sender: 'bot',
      name: 'Acolyte',
      avatar: botAvatar,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const resetChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full min-h-screen bg-[#F9FAFB] relative">
      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10 h-9 w-9 rounded-lg hover:bg-gray-200"
        onClick={toggleSidebar}
      >
        <MenuIcon className="icon" />
      </Button>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-[320px]" : "ml-0"} w-full`}
      >
        {/* Chat Messages */}
        <div className="flex flex-col items-center justify-start h-full px-4 max-w-full text-center overflow-hidden">
          {messages.length === 0 ? (
            <div className="my-auto">
              <h2 className="text-4xl md:text-5xl font-rubik font-medium leading-tight mb-4 text-transparent bg-gradient-to-r from-[#8468D0] to-[#000000] bg-clip-text">
                Hello, to be Doctor.
              </h2>
              <p className="text-4xl md:text-5xl font-rubik font-medium mb-8 text-transparent bg-gradient-to-r from-[#010101] to-[#38A169] bg-clip-text">
                How can I be your companion
              </p>

              {/* Suggestions */}
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
            <div className="flex-1 max-h-[calc(100vh-200px)] w-[70%] max-w-full pt-10 pb-5 px-8 mt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`mb-4 p-4 rounded-lg shadow-md relative ${message.sender === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100 text-left mr-auto"
                    }`}
                  style={{ maxWidth: '70%', width: 'fit-content' }}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Avatar and Name */}
                  <div
                    className={`absolute ${message.sender === "user" ? "-right-8 flex-row-reverse" : "-left-8"} top-[-45px] flex gap-2 items-center`}
                    style={{ zIndex: 1 }}
                  >
                    <Image
                      alt={message.name}
                      src={message.avatar}
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                    <div className="flex items-center gap-3 w-full text-gray-600 mb-3">
                      <p className='text-xl'>{message.name}</p>
                      <p className='text-md'>{message.time}</p>
                    </div>
                  </div>

                  {/* Message Content */}
                  <Markdown className="prose">{message.text}</Markdown>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="h-[76px] mx-auto w-full max-w-4xl px-3.5 py-[13px] mb-11 bg-white rounded-[15px] shadow-[0px_0.19090910255908966px_0.5727272629737854px_0px_rgba(0,0,0,0.11)] border-2 border-[#a69ac7] justify-between items-center inline-flex">
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
            <Image alt="emojis" src={emojis} width={24} height={24} />
            <Image alt="paperclip" src={paperclip} width={24} height={24} />
            <Button onClick={handleSendMessage} className="p-0 bg-transparent hover:bg-transparent">
              <Image alt="send" src={send} width={24} height={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-[320px] transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
      >
        <Sidebar resetChat={resetChat} />
      </div>
    </div>
  );
}