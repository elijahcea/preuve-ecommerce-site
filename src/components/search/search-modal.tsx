import {
  DialogBackdrop,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "./search-bar";
import { useSearchContext } from "@/src/contexts/search-provider";

export default function SearchModal() {
  const { isDialogOpen, toggleDialog } = useSearchContext();

  return (
    <>
      <button
        type="button"
        onClick={() => toggleDialog(true)}
        className="cursor-pointer transition-opacity ease-in-out duration-250 text-foreground hover:opacity-60"
      >
        <MagnifyingGlassIcon aria-hidden="true" className="size-5 stroke-2" />
      </button>
      <Dialog
        open={isDialogOpen}
        onClose={() => toggleDialog(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-background transition-bg duration-250 ease-in-out data-closed:bg-transparent"
        />
        <div className="flex fixed inset-0 justify-center mt-40">
          <DialogPanel
            transition
            className="flex flex-col gap-5 transition-opacity ease-in-out duration-250 data-closed:opacity-0"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-lg">Search</DialogTitle>
              <button
                type="button"
                onClick={() => toggleDialog(false)}
                className="cursor-pointer relative -m-2 p-2 transition-opacity ease-in-out duration-250 text-foreground hover:opacity-60"
              >
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <SearchBar placeholder="Search our store" />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
