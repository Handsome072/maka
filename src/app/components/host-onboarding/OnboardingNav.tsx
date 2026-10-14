'use client';

import type { ReactNode } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Logo } from '@/app/components/Logo';

export type RailState = 'done' | 'current' | 'todo';

export interface RailStep {
  id: string;
  label: string;
  state: RailState;
  clickable: boolean;
}

export interface RailChapter {
  number: number;
  title: string;
  status: RailState;
  statusLabel: string;
  steps: RailStep[];
  /** Chapitre de l'étape affichée : ses étapes sont listées. */
  expanded: boolean;
  /** Étape ouverte au clic sur le titre d'un chapitre replié déjà visité. */
  target?: string;
}

/** Menu de gauche (écrans larges) : chapitres, étapes et progression. */
export function OnboardingRail({
  heading,
  chapters,
  progressLabel,
  progress,
  footer,
  onStepClick,
}: {
  heading: string;
  chapters: RailChapter[];
  progressLabel: string;
  progress: number;
  footer?: ReactNode;
  onStepClick: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Étapes de l'inscription"
      className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[300px] flex-col gap-7 overflow-y-auto bg-[#F7F7F7] border-r border-[#EBEBEB] px-5 pt-7 pb-6"
    >
      <div className="pl-1">
        <Logo className="h-[30px] w-auto" />
      </div>

      <div className="space-y-2.5 px-1">
        <div className="flex items-baseline justify-between gap-2 text-[13px]">
          <span className="font-semibold text-[#222222]">{heading}</span>
          <span className="flex-shrink-0 whitespace-nowrap text-[#6A6A6A]">{progressLabel}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#E4E4E4] overflow-hidden">
          <div className="h-full rounded-full bg-[#06BDE3] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ol className="space-y-1">
        {chapters.map((chapter) => {
          const isCurrent = chapter.expanded;
          const header = (
            <>
              {chapter.status === 'done' ? (
                <span className="w-[26px] h-[26px] flex-shrink-0 rounded-full bg-[#0A6E85] flex items-center justify-center">
                  <Check className="w-[15px] h-[15px] text-white" strokeWidth={3} />
                </span>
              ) : (
                <span
                  className={`w-[26px] h-[26px] flex-shrink-0 rounded-full border-[1.5px] flex items-center justify-center text-[13px] font-semibold ${
                    chapter.status === 'current' ? 'border-[#222222] bg-[#222222] text-white' : 'border-[#BDBDBD] text-[#6A6A6A]'
                  }`}
                >
                  {chapter.number}
                </span>
              )}
              <span className="min-w-0 text-left">
                <span className={`block text-[15px] ${chapter.status === 'todo' ? 'font-medium text-[#6A6A6A]' : 'font-semibold text-[#222222]'}`}>
                  {chapter.title}
                </span>
                <span className="block text-xs text-[#6A6A6A]">{chapter.statusLabel}</span>
              </span>
            </>
          );

          return (
            <li
              key={chapter.number}
              className={`rounded-[14px] px-3 py-2.5 border ${isCurrent ? 'bg-white border-[#E4E4E4]' : 'border-transparent'}`}
            >
              {!isCurrent && chapter.target ? (
                <button
                  type="button"
                  onClick={() => onStepClick(chapter.target!)}
                  className="w-full flex items-center gap-3 rounded-lg hover:opacity-80"
                >
                  {header}
                </button>
              ) : (
                <div className="flex items-center gap-3" aria-current={isCurrent ? 'step' : undefined}>
                  {header}
                </div>
              )}

              {isCurrent && (
                <ul className="mt-2 mb-0.5 ml-[26px] pl-3 border-l border-[#E4E4E4] space-y-0.5">
                  {chapter.steps.map((step) => {
                    const dot =
                      step.state === 'current' ? 'bg-[#06BDE3]' : step.state === 'done' ? 'bg-[#0A6E85]' : 'bg-[#CFCFCF]';
                    const text =
                      step.state === 'current'
                        ? 'font-semibold text-[#222222] bg-[#F2FBFD]'
                        : step.state === 'done'
                          ? 'text-[#484848]'
                          : 'text-[#6A6A6A]';
                    const content = (
                      <>
                        <span className={`w-[7px] h-[7px] flex-shrink-0 rounded-full ${dot}`} />
                        {step.label}
                      </>
                    );
                    return (
                      <li key={step.id}>
                        {step.clickable && step.state !== 'current' ? (
                          <button
                            type="button"
                            onClick={() => onStepClick(step.id)}
                            className={`w-full min-h-[34px] flex items-center gap-2.5 rounded-lg px-2.5 text-left text-sm hover:bg-[#F7F7F7] ${text}`}
                          >
                            {content}
                          </button>
                        ) : (
                          <span
                            aria-current={step.state === 'current' ? 'step' : undefined}
                            className={`min-h-[34px] flex items-center gap-2.5 rounded-lg px-2.5 text-sm ${text}`}
                          >
                            {content}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      {footer && <div className="mt-auto pt-4 px-1 border-t border-[#E4E4E4] space-y-2.5 text-[13px] text-[#6A6A6A]">{footer}</div>}
    </nav>
  );
}

/** Progression compacte (mobile et tablette) : un segment par chapitre. */
export function MobileProgress({ chapterLabel, stepLabel, segments }: { chapterLabel: string; stepLabel: string; segments: number[] }) {
  return (
    <div className="lg:hidden px-5 md:px-10 pb-3.5 border-b border-[#EBEBEB] space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-semibold text-[#222222] truncate">{chapterLabel}</span>
        <span className="flex-shrink-0 text-[#6A6A6A]">{stepLabel}</span>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }} aria-hidden="true">
        {segments.map((fill, i) => (
          <span key={i} className="h-1 rounded-full bg-[#E4E4E4] overflow-hidden">
            <span className="block h-full bg-[#06BDE3] transition-all duration-500" style={{ width: `${Math.round(fill * 100)}%` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barre d'actions fixée en bas : Retour à gauche, action principale à droite. */
export function ActionBar({
  onBack,
  onNext,
  nextLabel,
  disabled,
  hint,
  loading,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  disabled: boolean;
  hint?: string | null;
  loading?: boolean;
}) {
  return (
    <footer className="fixed bottom-0 right-0 left-0 lg:left-[300px] z-40 bg-white border-t border-[#E4E4E4]">
      <div className="min-h-[80px] flex items-center justify-between gap-4 px-5 md:px-10 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[48px] pr-3 text-[15px] font-semibold text-[#222222] underline underline-offset-[3px] hover:text-black"
        >
          <ArrowLeft className="w-[18px] h-[18px]" />
          Retour
        </button>
        <div className="flex items-center gap-4 min-w-0">
          {hint && <p className="hidden sm:block text-sm text-[#6A6A6A] text-right">{hint}</p>}
          <button
            type="button"
            onClick={onNext}
            disabled={disabled || loading}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-xl text-[15px] font-semibold transition-colors bg-[#222222] text-white hover:bg-black disabled:bg-[#E4E4E4] disabled:text-[#767676] disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {nextLabel}
          </button>
        </div>
      </div>
      {hint && <p className="sm:hidden px-5 pb-3 -mt-1 text-[13px] text-[#6A6A6A] text-right">{hint}</p>}
    </footer>
  );
}
