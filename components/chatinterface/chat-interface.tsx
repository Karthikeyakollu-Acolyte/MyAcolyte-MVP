"use client";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";
import emojis from "../../public/emojis.svg";
import paperclip from "../../public/paperclip.svg";
import send from "../../public/send.svg";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  name: string;
  avatar: string;
  time: string;
}

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What is the goal of the authors?",
    "What is the main issue discussed in the text?",
    'What is the "old implicit compact" mentioned in the text?',
    "Who are the authors of the text?",
  ];

  const userAvatar =
    "https://via.placeholder.com/150/0000FF/808080?Text=User+Avatar";
  const botAvatar =
    "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bot+Avatar";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function getModelResponse(question: string) {
    try {
      const response = await fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const result = await response.json();

      if (result.data) {
        return result.data.choices[0]?.message?.content;
      } else {
        console.error("Error:", result.error);
        return result.error;
      }
    } catch (error) {
      console.error("Request failed:", error);
      return `Request failed: ${error}`;
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      name: "You",
      avatar: userAvatar,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    const response = await getModelResponse(inputMessage);

    const botResponse: Message = {
      id: Date.now(),
      text: response,
      sender: "bot",
      name: "Acolyte",
      avatar: botAvatar,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const resetChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full h-screen bg-[#F9FAFB] relative">
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out w-full`}
      >
        {/* Chat Messages */}
        <div className="flex flex-col items-center justify-start h-full px-4 max-w-full text-center overflow-hidden p-10">
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
            <div className="flex-1 max-h-[calc(100vh-200px)] w-[70%] max-w-full pt-10 pb-5 px-8 mt-3 overflow-y-auto scrollbar-thin scrollbar-hidden">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex flex-col items-${
                      message.sender === "user" ? "end" : "start"
                    } min-w-[32px]`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {message.sender === "user" ? (
                        <img
                          src={message.avatar}
                          alt={message.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-700 flex items-center justify-center">
                          <div className="text-white text-lg">○</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex flex-col ${
                      message.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                      <span className="text-gray-700">{message.name}</span>
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-lg ${
                        message.sender === "user"
                          ? "bg-purple-700 text-white"
                          : "bg-white shadow-sm"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 h-[76px] w-[80%] px-3.5 py-[13px] bg-white rounded-[15px] border-2 border-[#a69ac7] flex justify-between items-center">
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
            <Button
              onClick={handleSendMessage}
              className="p-0 bg-transparent hover:bg-transparent"
            >
              <Image alt="send" src={send} width={24} height={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="p-2 fixed top-20 left-2 xl:hidden"
            variant={"ghost"}
          >
            <MenuIcon className="icon" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[275px] -p-2">
          <Sidebar resetChat={resetChat} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
