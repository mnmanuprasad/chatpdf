
import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { Suspense } from "react";
import { ChatSkelton } from "@/components/skeleton/ChatSkelton";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async (props: Props) => {

  const { userId } =  auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(props.params.chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find(
    (chat) => chat.id === parseInt(props.params.chatId)
  );

  return (
    <div className="flex min-h-screen overflow-auto">
      <div className="flex w-full max-h-screen overflow-auto">
        {/* chat sidebar */}
        <div className="max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(props.params.chatId)} />
        </div>

        {/* PDF Viewer */}
        <div className="hidden lg:block max-h-screen p-4 overflow-auto flex-[4] border-r-4 border-r-slate-400">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* Chat componenet */}
        <div className="flex-[3] ">
          <Suspense fallback={<ChatSkelton />}>
            <ChatComponent chatId={parseInt(props.params.chatId)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
