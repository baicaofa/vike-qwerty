import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

export const AuthorButton = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip defaultOpen></Tooltip>
    </TooltipProvider>
  );
};
