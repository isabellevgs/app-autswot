import ContentCard from './ContentCard';

// Componente para exibir páginas em desenvolvimento ou estados vazios
function EmptyState({ message = "Área em desenvolvimento..." }) {
  return (
    <ContentCard>
      <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed text-center">
        {message}
      </p>
    </ContentCard>
  );
}

export default EmptyState;

