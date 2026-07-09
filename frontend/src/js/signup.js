document.addEventListener('DOMContentLoaded', () => {
    const stepsWrapper = document.getElementById('steps-wrapper');
    const steps = document.querySelectorAll('.step-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const googleBtn = document.getElementById('google-btn');
    const googleDivider = document.getElementById('google-divider');
    const stepTitle = document.getElementById('step-title');
    const stepSubtitle = document.getElementById('step-subtitle');
    const indicators = document.querySelectorAll('.indicator');

    let currentStep = 0;
    const totalSteps = steps.length;

    // Content for each step matching Thai locale conceptually but keeping English code base
    const titles = [
        "What's your name?",
        "When were you born?",
        "What's your email?",
        "Create a password",
        "Verify your email"
    ];
    
    const subtitles = [
        "Please enter your real name.",
        "We need this to verify your age.",
        "You'll use this to log in.",
        "Make sure it's secure and unique.",
        "We sent a 6-digit code to your email."
    ];

    function updateUI() {
        // Slide the wrapper to show current step
        stepsWrapper.style.transform = `translateX(-${currentStep * 100}%)`;

        // Update Text
        if (window.t) {
            stepTitle.textContent = window.t(`signup.steps.title${currentStep}`);
            stepSubtitle.textContent = window.t(`signup.steps.subtitle${currentStep}`);
        } else {
            stepTitle.textContent = titles[currentStep];
            stepSubtitle.textContent = subtitles[currentStep];
        }

        // Update Indicators
        indicators.forEach((ind, index) => {
            if (index <= currentStep) {
                ind.classList.remove('bg-gray-200', 'dark:bg-gray-600');
                ind.classList.add('bg-royalblue');
                // Make current step wider
                if (index === currentStep) {
                    ind.classList.add('w-6');
                    ind.classList.remove('w-2.5');
                } else {
                    ind.classList.remove('w-6');
                    ind.classList.add('w-2.5');
                }
            } else {
                ind.classList.add('bg-gray-200', 'dark:bg-gray-600', 'w-2.5');
                ind.classList.remove('bg-royalblue', 'w-6');
            }
        });

        // Toggle Google Sign In (Show only on Step 0)
        if (currentStep === 0) {
            prevBtn.classList.add('hidden');
            prevBtn.classList.remove('flex');
            nextBtn.classList.remove('w-1/2');
            nextBtn.classList.add('w-full');
            
            if (googleBtn) googleBtn.classList.remove('hidden');
            if (googleDivider) googleDivider.classList.remove('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            prevBtn.classList.add('flex', 'w-1/2');
            nextBtn.classList.remove('w-full');
            nextBtn.classList.add('w-1/2');
            
            if (googleBtn) googleBtn.classList.add('hidden');
            if (googleDivider) googleDivider.classList.add('hidden');
        }

        // Button text
        if (currentStep === totalSteps - 1) {
            nextBtn.textContent = window.t ? window.t('signup.btnVerify') : 'Verify & Sign Up';
        } else {
            nextBtn.textContent = window.t ? window.t('signup.btnNext') : 'Next';
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            // Can add validation here before moving to next step
            currentStep++;
            updateUI();
        } else {
            // Form submission logic would go here
            console.log('Form Submitted - Sign Up Flow Complete');
            // For design preview, we can just alert or redirect
            alert('Sign Up Complete! (Design Preview)');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    // Initialize
    updateUI();

    // Listen for language updates
    window.addEventListener('i18n-updated', updateUI);
});
