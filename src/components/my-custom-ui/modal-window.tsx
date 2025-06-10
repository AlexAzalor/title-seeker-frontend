import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  description?: string;
};

function ModalWindow({ children, title, open, setOpen, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-200 overflow-auto lg:max-h-260">
        <DialogHeader>
          <DialogTitle className="mb-5 self-center text-3xl">
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogHeader>
      </DialogContent>

      {/* <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter> */}
    </Dialog>
  );
}

export default ModalWindow;
