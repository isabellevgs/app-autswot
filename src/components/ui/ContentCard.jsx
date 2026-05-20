// Card de conteúdo com backdrop e sombra

function ContentCard({ children, className = "", hover = true, shadow = true }) {
  const hoverClass = hover && shadow ? 'hover:shadow-lg' : '';
  const shadowClass = shadow ? 'shadow-md' : 'shadow-none';

  return (
    <div
      className={`bg-white/60 backdrop-blur-sm rounded-xl p-6 ${shadowClass} ${hoverClass} transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export default ContentCard;

