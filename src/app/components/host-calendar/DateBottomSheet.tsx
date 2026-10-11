'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/app/components/ui/drawer';
import { PanelContent, type PanelContentProps } from './DateSidePanel';

interface DateBottomSheetProps extends PanelContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DateBottomSheet({ isOpen, onClose, ...contentProps }: DateBottomSheetProps) {
  const { selectedDates } = contentProps;
  return (
    <div className="lg:hidden">
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Détails</DrawerTitle>
            <DrawerDescription>
              {selectedDates.size === 1
                ? '1 date sélectionnée'
                : `${selectedDates.size} dates sélectionnées`}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto max-h-[60vh]">
            <PanelContent {...contentProps} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
