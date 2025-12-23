import ChatsBar from "@/components/ChatsBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <ResizablePanelGroup className="min-h-screen max-w-screen">
      <ResizablePanel defaultSize={20} minSize={350}>
        <ChatsBar />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary focus:bg-primary transition-colors" />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
