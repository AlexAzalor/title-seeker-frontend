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

function ModalMovie({ children, title, open, setOpen, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="self-center">{title}</DialogTitle>
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

export default ModalMovie;
