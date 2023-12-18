"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState,useEffect } from "react";
import clsx from "clsx";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  

  const [isMobile, setIsMobile] = useState(false)

  const [isChatSidebarOpen, setChatSidebarOpen] = useState(isMobile);

  useEffect(() => {
    if(window.innerWidth <= 768){
      setIsMobile(true)
    }
  }, []);

  function updateSideBarStatus() {
    setChatSidebarOpen(!isChatSidebarOpen);
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div
        className={clsx(
          "w-full min-h-screen max-h-screen overflow-auto  transition-[width] duration-1000 ease-in-out p-4 text-gray-200 bg-gray-900",
          {
            "w-0 hidden": isChatSidebarOpen == true,
            // "w-60": isChatSidebarOpen == false
          }
        )}
      >
        <Link href="/">
          <Button className="w-full border-dashed border-white border">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </Link>

        <div className="flex flex-col gap-2 mt-4">
          {chats.map((chat) => {
            return (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div
                  className={cn(
                    "rounded-lg p-3 text-slate-300 flex items-center",
                    {
                      "bg-blue-600 text-white": chat.id === chatId,
                      "hover:text-white": chat.id !== chatId,
                    }
                  )}
                >
                  <MessageCircle className="mr-0" />
                  <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                    {chat.pdfName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href={"/"}>Home</Link>
            <Link href={"/"}>Source</Link>
          </div>
          {/* Stripe Payment */}
        </div>
      </div>
      <div className="text-slate-500 cursor-pointer self-center">
        {isChatSidebarOpen && (
          <ChevronRight
            onClick={updateSideBarStatus}
            className="animate-bounce"
            size={32}
          />
        )}
        {!isChatSidebarOpen && (
          <ChevronLeft
            onClick={updateSideBarStatus}
            className="animate-bounce"
            size={32}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
