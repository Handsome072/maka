import logoImage from '@/assets/cb6176ff8edd0b3138031a0603d32f25188f8bd7.png';

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={logoImage} alt="HOMIQIO" className={className} />;
}
