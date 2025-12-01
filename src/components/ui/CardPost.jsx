function CardPost({ card, onClick }) {
  return (
    <div
      className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-32 bg-center bg-cover bg-violet-200"
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : {}}
      />
      
      <div className="p-5 bg-white/60 backdrop-blur-sm">
        <p className="font-semibold text-slate-900 truncate leading-tight">{card.title || 'Sem título'}</p>
        {card.author && (
          <p className="text-sm text-slate-500 mt-2">Por {card.author.name}</p>
        )}
      </div>
    </div>
  )
}

export default CardPost

