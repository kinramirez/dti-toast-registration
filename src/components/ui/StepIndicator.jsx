/**
 * StepIndicator — Visual step progress indicator.
 *
 * Design spec:
 * - 50×50px circles (responsive: 40px mobile, 50px desktop)
 * - Active: bg-[#1877F2] text-white
 * - Inactive: bg-[#808080] text-white
 * - Connecting line: flex-1 border-t-[3px]
 *   - Gray (border-[#DADADA]) when the next step is not yet active
 *   - Blue (border-[#1877F2]) when currentStep > step.number
 * - Labels: label text only, responsive sizing
 * - Optional onStepClick prop for backwards navigation
 *
 * @param {number} currentStep - The currently active step number (1-based)
 * @param {Array<{ number: number, label: string }>} steps - Step definitions
 * @param {function} [onStepClick] - Optional callback when a step is clicked.
 *   Only fires for steps where stepNumber <= currentStep (backwards-only).
 */
export default function StepIndicator({ currentStep, steps, onStepClick }) {
  function handleStepClick(stepNumber) {
    // Only allow clicking backwards to completed steps
    if (onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  }

  return (
    <div className='flex flex-col items-center w-full mb-16'>
      <div className='flex items-start w-full max-w-4xl px-2'>
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isLast = index === steps.length - 1;
          // Line is blue when the step AFTER this one is active or completed
          const isLineActive = step.number < currentStep;
          const isClickable = onStepClick && step.number <= currentStep;

          return (
            <div key={step.number} className={`flex items-start ${!isLast ? 'flex-1' : ''}`}>
              {/* Step circle + label */}
              <div className='flex flex-col items-center w-[100px] sm:w-[120px] md:w-auto'>
                <button
                  type='button'
                  disabled={!isClickable}
                  onClick={() => handleStepClick(step.number)}
                  className={`rounded-full flex items-center justify-center font-bold shrink-0 transition-all w-[40px] h-[40px] text-[18px] md:w-[50px] md:h-[50px] md:text-[24px] ${
                    isActive
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-[#808080] text-white'
                  } ${
                    isClickable
                      ? 'cursor-pointer hover:opacity-90'
                      : 'cursor-default'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={
                    isClickable
                      ? `Go back to Step ${step.number}: ${step.label}`
                      : `Step ${step.number}: ${step.label}`
                  }
                >
                  {step.number}
                </button>
                <span className='mt-2 text-[14px] sm:text-[16px] md:text-[24px] font-bold text-center leading-tight'>
                  {step.label}
                </span>
              </div>

              {/* Connecting line (except after last step) */}
              {!isLast && (
                <div
                  className={`flex-1 mx-4 border-t-[3px] self-start mt-[25px] transition-colors ${
                    isLineActive ? 'border-[#1877F2]' : 'border-[#DADADA]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
