interface ServiceCategoryCardProps {
  image: string;
  title: string;
  servicesCount: number;
  onClick?: () => void;
}

export function ServiceCategoryCard({ image, title, servicesCount, onClick }: ServiceCategoryCardProps) {
  return (
    <button 
      onClick={onClick}
      className="group cursor-pointer flex-shrink-0 w-[86px]"
    >
      <div className="relative w-[86px] h-[86px] rounded-lg overflow-hidden mb-2">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-xs text-left mb-0.5 line-clamp-2" style={{ fontWeight: 600 }}>{title}</h3>
      <p className="text-[11px] text-gray-600 text-left">
        {servicesCount} services disponibles
      </p>
    </button>
  );
}