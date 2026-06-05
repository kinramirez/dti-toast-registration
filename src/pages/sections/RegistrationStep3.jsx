import toastSuccessBg from '@/assets/toast-success-bg.png';
import toastSuccessHero from '@/assets/toast-success-hero.png';

const NEXT_STEPS = [
  'Check your email for your e-ticket + event details',
  'Visit date, venue, and map will be sent 3 days before the fair',
  'Want early access to supplier deals? We\'ll email those too',
];

export default function RegistrationStep3({ onBackToHome }) {
  return (
    <div
      className='min-h-screen w-full bg-[#1877F2] bg-cover bg-center bg-no-repeat flex flex-col justify-start items-center py-20 px-4'
      style={{ backgroundImage: `url(${toastSuccessBg})` }}
    >
      <div className='bg-white rounded-2xl shadow-[0px_4px_4px_rgba(18,18,18,0.15)] p-6 sm:p-10 lg:p-16 max-w-4xl w-full font-satoshi flex flex-col items-center gap-16'>
        {/* ── Hero Image ── */}
        <img
          src={toastSuccessHero}
          alt='Toast Wedding Fair logo with red roses'
          className='w-full max-w-[703px] h-auto aspect-[703/407] object-cover'
        />

        {/* ── Messaging Block ── */}
        <div className='flex flex-col items-center text-center gap-8'>
          <h2 className='text-[32px] font-bold text-[#1877F2]'>
            Registration Complete!
          </h2>
          <p className='text-[20px] font-bold text-[#434343] text-center'>
            Thanks for registering for the Toast Wedding Fair. We've saved
            your details and matched your purpose of visit to our exhibitors.
          </p>
        </div>

        {/* ── Next Steps Block ── */}
        <div className='flex flex-col items-start'>
          <p className='text-[16px] font-bold text-[#808080]'>Next steps:</p>
          <ul className='flex flex-col gap-2 mt-2'>
            {NEXT_STEPS.map((step) => (
              <li key={step} className='flex flex-row items-center gap-4'>
                <span
                  aria-hidden='true'
                  className='w-2 h-2 rounded-full bg-[#1877F2] flex-shrink-0'
                />
                <span className='text-[16px] font-medium text-[#121212]'>
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Back to Home Button ── */}
        <div className='flex flex-row justify-center w-full'>
          <button
            type='button'
            onClick={onBackToHome}
            className='w-full max-w-[489px] h-[64px] bg-[#1877F2] hover:opacity-90 rounded-lg text-[24px] font-bold text-[#FAFAFA] transition-all shadow-lg'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
