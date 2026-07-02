/**
 * StepIndicator — Visual step progress indicator.
 *
 * Design spec (Figma redesign):
 * - 50×50px circles (responsive: 40px mobile, 50px desktop)
 * - Active: bg-[#C55F61] text-white
 * - Inactive: bg-[#DADADA] text-white
 * - Connecting line: flex-1 border-t-[3px]
 *   - Gray (border-[#DADADA]) when the next step is not yet active
 *   - Rose (border-[#C55F61]) when currentStep > step.number
 * - Labels: Cormorant Garamond 700, 16px
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
          const isCompleted = step.number <= currentStep;
          const isLast = index === steps.length - 1;
          // Line is rose when the step AFTER this one is active or completed
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
                    isCompleted
                      ? 'bg-[#C55F61] text-white'
                      : 'bg-[#DADADA] text-white'
                  } ${
                    isClickable
                      ? 'cursor-pointer hover:opacity-90'
                      : 'cursor-default'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={
                    isCompleted && !isActive
                      ? `Step ${step.number}: ${step.label} — completed`
                      : isClickable
                        ? `Go back to Step ${step.number}: ${step.label}`
                        : `Step ${step.number}: ${step.label}`
                  }
                >
                  {step.number}
                </button>
                <span className='mt-2 text-[16px] font-bold text-center leading-tight font-cormorant'>
                  {step.label}
                </span>
              </div>

              {/* Connecting line (except after last step) */}
              {!isLast && (
                <div
                  className={`flex-1 mx-4 border-t-[3px] self-start mt-[25px] transition-colors ${
                    isLineActive ? 'border-[#C55F61]' : 'border-[#DADADA]'
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
