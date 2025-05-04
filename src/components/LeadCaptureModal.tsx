import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LeadCaptureForm } from "./lead-capture/LeadCaptureForm";

export function LeadCaptureModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto">
        {/* You can adjust padding, max-width, or add a header here */}
        <h2 className="text-xl font-semibold mb-4 text-center">Get Started</h2>
        <LeadCaptureForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}