const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function ChatSkelton() {
  return (
    <div className="flex min-h-screen overflow-auto">
      <div className="flex w-full max-h-screen overflow-auto">
        <div className="flex-[1] max-w-xs">
          {/* <ChatSideBar chats={_chats} chatId={parseInt(props.params.chatId)}/> */}
        </div>
        {/* PDF Viewer */}
        <div className="hidden lg:block max-h-screen p-4 overflow-auto flex-[4]">
          {/* <PDFViewer pdf_url={currentChat?.pdfUrl || ""} /> */}
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-400">
          <ChatComponentSkelton />
        </div>
      </div>
    </div>
  );
}

function ChatComponentSkelton() {
    return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
    {/*  <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" /> */}
    <div className="p-4">
    <div className="flex flex-col">
    <div className="flex items-center pb-2 pt-6">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>

    <div className="flex items-center pb-2 pt-6 gap-2 flex-row-reverse">
        <div className="h-5 w-5 rounded-full bg-gray-200 self-end" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>
    {/* <div className="h-20" /> */}

    <div className="flex items-center pb-2 pt-6">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>

    <div className="flex items-center pb-2 pt-6 gap-2 flex-row-reverse">
        <div className="h-5 w-5 rounded-full bg-gray-200 self-end" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>

    <div className="flex items-center pb-2 pt-6">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>

    <div className="flex items-center pb-2 pt-6 gap-2 flex-row-reverse">
        <div className="h-5 w-5 rounded-full bg-gray-200 self-end" />
        <div className="ml-2 h-4 w-52 rounded-md bg-gray-200" />
    </div>
    </div>
    </div>
  </div>
  );
}
