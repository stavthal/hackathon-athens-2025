import { LucideArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatBox() {
  return (
    <div className="relative border p-2 rounded-lg shadow-md bg-white border-neutral-800 w-2/5 mx-4 my-4">
      <div className="flex items-end gap-2">
        <Textarea className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:border-none text-lg" />
        <Button className="rounded-full hover:scale-110 transition-transform">
          <LucideArrowUp className="text-white" />
        </Button>
      </div>
    </div>
  );
}
