import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

export function ButtonLoading({ text }: { text: string }) {
  return (
    <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      {text}
    </Button>
  );
}
