import ChatBot from "../general/chatBot/ChatBot";
import Header from "../layout/Header";

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <Header />
      <div className="flex flex-col items-center h-full gap-5 p-10">
        <h1 className="text-3xl text-white font-bold">{title}</h1>
        {children}
      </div>
      <ChatBot />
    </div>
  );
}

export default Page;
