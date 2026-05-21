import {
  formatRegistrationAnswer,
  getVisibleRegistrationFields,
} from '../constants/registrationSections';

function ProfileRegistrationDisplay({ registration, compact = false }) {
  const sections = getVisibleRegistrationFields(registration);

  if (!registration || sections.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Nenhuma informação de cadastro disponível.
      </p>
    );
  }

  return (
    <div className={compact ? 'space-y-5' : 'space-y-6'}>
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm mb-3' : 'text-base mb-4'}`}>
            {section.title}
          </h3>
          <dl className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <dt className="text-sm font-medium text-gray-600 mb-1">{field.label}</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {formatRegistrationAnswer(field, registration[field.key])}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export default ProfileRegistrationDisplay;
