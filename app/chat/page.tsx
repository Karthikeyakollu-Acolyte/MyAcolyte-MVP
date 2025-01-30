import Header from "@/components/chatinterface/Header";
import { ChatInterface } from "@/components/chatinterface/chat-interface";

export default function Page() {
  return (
    <div className="flex flex-col w-full min-h-screen">
     <div className="">
      <Header/>
     </div>
      <div className="flex flex-1 w-full">
        <ChatInterface />
      </div>
    </div>
  );
}