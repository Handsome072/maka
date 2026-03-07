'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/app/components/ui/drawer';
import { PanelContent } from './DateSidePanel';
import type { CalendarDate, CalendarReservation } from './types';

interface DateBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: Set<string>;
  calendarDates: CalendarDate[];
  reservations: CalendarReservation[];
  basePrice: number;
  currency: string;
  panelPrice: string;
  onPanelPriceChange: (value: string) => void;
  onApplyPrice: () => void;
  onResetPrice: () => void;
  onBlock: () => void;
  onUnblock: () => void;
}

export function DateBottomSheet({
  isOpen,
  onClose,
  selectedDates,
  calendarDates,
  reservations,
  basePrice,
  currency,
  panelPrice,
  onPanelPriceChange,
  onApplyPrice,
  onResetPrice,
  onBlock,
  onUnblock,
}: DateBottomSheetProps) {
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
            <PanelContent
              selectedDates={selectedDates}
              calendarDates={calendarDates}
              reservations={reservations}
              basePrice={basePrice}
              currency={currency}
              panelPrice={panelPrice}
              onPanelPriceChange={onPanelPriceChange}
              onApplyPrice={onApplyPrice}
              onResetPrice={onResetPrice}
              onBlock={onBlock}
              onUnblock={onUnblock}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
