import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const policyContent = {
  '/terms': {
    title: 'Terms of Use',
    introduction: 'These starter terms explain the basic expectations for using Roystore. They are a draft for review, not legal advice, and should be checked and updated before the service is publicly launched.',
    sections: [
      {
        title: 'About Roystore',
        text: 'Roystore is currently a practice project for learning full-stack development. It is not a real store, products are not actually sold, and real payments are not processed.',
      },
      {
        title: 'Using an account',
        text: 'Provide accurate information when creating an account and keep your sign-in details secure. You are responsible for activity carried out through your account.',
      },
      {
        title: 'Products and orders',
        text: 'Product descriptions, availability, prices, cart, and order features are provided for demonstration. They do not represent an offer to sell goods or a commitment to fulfill an order.',
      },
      {
        title: 'Acceptable use',
        text: 'Do not misuse the service, attempt to access another person’s account, interfere with its operation, or use it in violation of applicable law.',
      },
      {
        title: 'Changes and contact',
        text: 'These terms may be updated as the project develops. Questions about this draft can be sent to support@roystore.com.',
      },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    introduction: 'This starter privacy notice describes the types of information the Roystore practice project may handle. It is a draft for review, not legal advice, and must be aligned with actual data practices before launch.',
    sections: [
      {
        title: 'Information handled',
        text: 'Depending on how you use the project, information may include account details such as your name and email, and information entered into shopping or checkout features, such as an address or phone number.',
      },
      {
        title: 'How information is used',
        text: 'Information is used to provide account, shopping, and order demonstration features, maintain the service, and respond to support requests.',
      },
      {
        title: 'Sharing and storage',
        text: 'Information may be processed by the project’s hosting or infrastructure providers to operate the service. This draft does not specify retention periods or provider practices; those details should be confirmed before launch.',
      },
      {
        title: 'Your choices and contact',
        text: 'For questions or requests concerning information associated with an account, contact support@roystore.com. Applicable rights and request processes should be confirmed for the jurisdictions where the service is offered.',
      },
      {
        title: 'Security and updates',
        text: 'Reasonable safeguards should be used to protect information, but no online service can guarantee absolute security. This notice may be updated as the project and its data practices change.',
      },
    ],
  },
};

export default function Policies() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const policy = policyContent[pathname] || policyContent['/terms'];

  return (
    <main className="min-h-screen bg-white px-5 py-10">
      <article className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <ArrowLeft size={18} />
          </button>
          <Link to="/" className="text-sm font-medium text-primary hover:underline">Roystore</Link>
        </div>
       
        <h1 className="mt-2 text-3xl font-extrabold">{policy.title}</h1>
        <p className="mt-4 leading-relaxed text-gray-600">{policy.introduction}</p>

        <div className="mt-8 space-y-6">
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold">{section.title}</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{section.text}</p>
            </section>
          ))}
        </div>

        <nav aria-label="Policies" className="mt-10 flex gap-5 border-t border-gray-100 pt-5 text-sm">
          <Link to="/terms" className="font-medium text-primary hover:underline">Terms of Use</Link>
          <Link to="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
        </nav>
      </article>
    </main>
  );
}
