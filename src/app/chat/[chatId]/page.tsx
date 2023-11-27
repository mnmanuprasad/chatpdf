import ChatSideBar from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params:{
        chatId: string
    }
};

const ChatPage = async (props: Props)=>{

    const {userId} = await auth();

    if(!userId){
        return redirect("/sign-in");
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    
    if(!_chats){
        return redirect("/")
    }

    if(!_chats.find(chat=>chat.id===parseInt(props.params.chatId))){
        return redirect("/")
    }

    return(
        <div className="flex min-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* chat sidebar */}
                <div className="flex-[1] max-w-xs">
                   <ChatSideBar chats={_chats} chatId={parseInt(props.params.chatId)}/>
                </div>
                {/* PDF Viewer */}
                <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                    {/* <PDFViewer /> */}
                </div>
                {/* Chat componenet */}
                <div className="flex-[3] border-l-4 border-l-slate-400"> 
                    {/* <ChatComponent /> */}
                </div>
            </div>
        
        </div>
    )
}

export default ChatPage