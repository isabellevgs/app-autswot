// Card de conteúdo com backdrop e sombra

function ContentCard({ children, className = "", hover = true }) {
  const hoverClass = hover ? "hover:shadow-lg" : "";
  
  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md ${hoverClass} transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

export default ContentCard;

