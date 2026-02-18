export type Step =
  | 'acceptance-condition'
  | 'reservation-type'
  | 'address-location'
  | 'capacity-details'
  | 'client-expectations'
  | 'amenities'
  | 'summary-review-1'
  | 'host-photo'
  | 'chalet-photos'
  | 'chalet-description'
  | 'summary-review-2'
  | 'permissions'
  | 'reservation-mode'
  | 'pricing'
  | 'fees'
  | 'calendar'
  | 'cancellation-policy'
  | 'laws-taxes'
  | 'local-laws'
  | 'guest-arrival'
  | 'phone-number'
  | 'summary-review-3'
  | 'verification'
  | 'signature';

export interface Bedroom {
  id: string;
  name: string;
  beds: {
    simple: number;
    double: number;
    queen: number;
    king: number;
    simple_bunk: number;
    double_bunk: number;
    queen_bunk: number;
    king_bunk: number;
    sofa_bed: number;
    other: number;
  };
}

export interface HostOnboardingProps {
  onNavigate: (page: string, data?: any) => void;
  initialStep?: Step;
  onCompleteOnboarding?: () => void;
  onStepChange?: (step: Step) => void;
}
