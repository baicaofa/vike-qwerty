import kai from "@/assets/kai.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const AuthorButton = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip defaultOpen></Tooltip>
    </TooltipProvider>
  );
};
