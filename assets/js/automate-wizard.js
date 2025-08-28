// Automation Wizard JavaScript
class AutomationWizard {
    constructor() {
        console.log('🚀 AutomationWizard constructor called!');
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            industry: '',
            apps: [],
            goals: [],
            email: '',
            name: '',
            company: ''
        };
        
        this.init();
    }
    
    init() {
        console.log('📦 Init called!');
        this.bindEvents();
        this.loadSavedData();
        this.animateInitialLoad();
        this.initSearch();
        // Initialize feather icons with proper check
        this.replaceFeatherIcons();
    }
    
    replaceFeatherIcons() {
        // Simple feather icons replacement
        if (typeof feather !== 'undefined' && typeof feather.replace === 'function') {
            try {
                feather.replace();
            } catch (e) {
                console.warn('Failed to replace feather icons:', e);
            }
        } else {
            // Try again if feather isn't ready
            setTimeout(() => this.replaceFeatherIcons(), 100);
        }
    }
    
    bindEvents() {
        // Step navigation
        document.getElementById('step1Next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('step2Prev')?.addEventListener('click', () => this.prevStep());
        document.getElementById('step2Next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('step3Prev')?.addEventListener('click', () => this.prevStep());
        document.getElementById('step3Next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('step4Prev')?.addEventListener('click', () => this.prevStep());
        
        // Industry selection
        document.querySelectorAll('.industry-card').forEach(card => {
            card.addEventListener('click', () => this.selectIndustry(card));
        });
        
        // App selection
        document.querySelectorAll('.app-card').forEach(card => {
            card.addEventListener('click', () => this.toggleApp(card));
        });
        
        // Goal selection
        document.querySelectorAll('.goal-item').forEach(item => {
            item.addEventListener('click', () => this.toggleGoal(item));
        });
        
        // Form submission
        document.getElementById('wizardForm')?.addEventListener('submit', (e) => this.submitForm(e));
        
        // Form validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearError('email'));
        }
        
        // Auto-save on input change
        ['name', 'company'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => this.saveData());
            }
        });
    }
    
    animateInitialLoad() {
        console.log('✨ animateInitialLoad called! anime exists?', typeof anime !== 'undefined');
        
        // Animate hero section
        anime({
            targets: '.wizard-hero h1',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuart',
            delay: 200
        });
        
        anime({
            targets: '.wizard-hero p',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuart',
            delay: 400
        });
        
        // Animate progress indicator
        anime({
            targets: '.wizard-progress-compact',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuart',
            delay: 600
        });
        
        // Animate first step cards (they start with opacity: 0 from CSS)
        anime({
            targets: '#step1 .industry-card',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutQuart',
            delay: anime.stagger(100, {start: 800})
        });
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.animateStepTransition(this.currentStep + 1);
            this.updateProgress();
            this.saveData();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.animateStepTransition(this.currentStep - 1);
            this.updateProgress();
        }
    }
    
    animateStepTransition(targetStep) {
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        const targetStepEl = document.getElementById(`step${targetStep}`);
        
        if (!currentStepEl || !targetStepEl) return;
        
        const isForward = targetStep > this.currentStep;
        
        // Animate out current step
        anime({
            targets: currentStepEl,
            opacity: [1, 0],
            translateX: isForward ? [-0, -50] : [0, 50],
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                currentStepEl.classList.remove('active');
                currentStepEl.style.display = 'none';
                
                // Prepare target step
                targetStepEl.style.display = 'block';
                targetStepEl.style.opacity = '0';
                targetStepEl.classList.add('active');
                
                // Animate in target step
                anime({
                    targets: targetStepEl,
                    opacity: [0, 1],
                    translateX: isForward ? [50, 0] : [-50, 0],
                    duration: 600,
                    easing: 'easeOutQuart',
                    complete: () => {
                        // Animate step content
                        this.animateStepContent(targetStep);
                        // Replace feather icons in new content
                        requestAnimationFrame(() => {
                            this.replaceFeatherIcons();
                        });
                    }
                });
                
                // Update step number after transition starts
                this.currentStep = targetStep;
                this.updateProgress();
                
                if (targetStep === 4) {
                    // Delay summary update to ensure step is visible
                    setTimeout(() => {
                        this.updateSummaryPreview();
                    }, 50);
                }
            }
        });
    }
    
    animateStepContent(step) {
        let targets = [];
        let delay = 0;
        
        switch(step) {
            case 1:
                targets = '.industry-card';
                delay = 100;
                break;
            case 2:
                // Animate search bar first, then app cards
                anime({
                    targets: '.apps-search',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 400,
                    easing: 'easeOutQuart'
                });
                targets = '.app-card';
                delay = 300;
                break;
            case 3:
                targets = '.goal-category';
                delay = 100;
                break;
            case 4:
                // Animate form elements
                anime({
                    targets: '#summaryPreview',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                anime({
                    targets: '.contact-form-container',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutQuart',
                    delay: 200,
                    complete: () => {
                        // Ensure all icons in step 4 are replaced
                        this.replaceFeatherIcons();
                    }
                });
                return;
        }
        
        if (targets) {
            anime({
                targets: targets,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutQuart',
                delay: anime.stagger(50, {start: delay})
            });
        }
    }
    
    updateProgress() {
        // Progress dots are now embedded in each step, so we'll update them dynamically during transitions
        // This is handled in the animateStepTransition method
    }
    
    selectIndustry(card) {
        // Remove previous selection
        document.querySelectorAll('.industry-card').forEach(c => c.classList.remove('selected'));
        
        // Add selection
        card.classList.add('selected');
        
        // Store data
        this.formData.industry = card.dataset.industry;
        
        // Enable next button
        document.getElementById('step1Next').disabled = false;
        
        // Animate selection
        anime({
            targets: card,
            scale: [1, 1.02, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        this.saveData();
    }
    
    toggleApp(card) {
        const appName = card.dataset.app;
        const isSelected = card.classList.contains('selected');
        
        if (isSelected) {
            card.classList.remove('selected');
            this.formData.apps = this.formData.apps.filter(app => app !== appName);
        } else {
            card.classList.add('selected');
            this.formData.apps.push(appName);
        }
        
        // Animate selection
        anime({
            targets: card,
            scale: [1, 1.05, 1],
            duration: 200,
            easing: 'easeOutQuart'
        });
        
        this.updateAppsSummary();
        this.saveData();
    }
    
    toggleGoal(item) {
        const goalId = item.dataset.goal || `${item.closest('.goal-category').dataset.category}-${item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '-')}`;
        const isSelected = item.classList.contains('selected');
        
        if (isSelected) {
            item.classList.remove('selected');
            this.formData.goals = this.formData.goals.filter(goal => goal !== goalId);
        } else {
            item.classList.add('selected');
            this.formData.goals.push(goalId);
        }
        
        // Animate selection
        anime({
            targets: item.querySelector('.goal-checkbox'),
            scale: [1, 1.2, 1],
            duration: 200,
            easing: 'easeOutQuart'
        });
        
        this.updateGoalsSummary();
        this.saveData();
    }
    
    updateAppsSummary() {
        const summary = document.getElementById('appsSummary');
        if (summary) {
            const count = this.formData.apps.length;
            const text = count === 1 ? '1 app selected' : `${count} apps selected`;
            summary.querySelector('span').textContent = text;
        }
    }
    
    updateGoalsSummary() {
        const summary = document.getElementById('goalsSummary');
        if (summary) {
            const count = this.formData.goals.length;
            const text = count === 1 ? '1 goal selected' : `${count} goals selected`;
            summary.querySelector('span').textContent = text;
        }
    }
    
    updateSummaryPreview() {
        const preview = document.getElementById('summaryPreview');
        if (!preview) return;
        
        const summaryItems = [
            {
                icon: 'briefcase',
                title: 'Industry Analysis',
                description: `Tailored recommendations for ${this.formData.industry.replace(/-/g, ' ')}`
            },
            {
                icon: 'layers',
                title: 'App Integration Map',
                description: `Connect your ${this.formData.apps.length} selected apps efficiently`
            },
            {
                icon: 'target',
                title: 'Goal-Focused Strategy',
                description: `${this.formData.goals.length} automation opportunities identified`
            },
            {
                icon: 'trending-up',
                title: 'ROI Projections',
                description: 'Time and cost savings estimates for your business'
            },
            {
                icon: 'clock',
                title: 'Implementation Timeline',
                description: 'Step-by-step 30-60-90 day action plan'
            }
        ];
        
        preview.innerHTML = summaryItems.map(item => `
            <div class="summary-item">
                <div class="summary-icon">
                    <i data-feather="${item.icon}"></i>
                </div>
                <div class="summary-text">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
        
        // Replace feather icons
        requestAnimationFrame(() => {
            this.replaceFeatherIcons();
        });
    }
    
    initSearch() {
        const searchInput = document.getElementById('appsSearch');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const appCards = document.querySelectorAll('.app-card');
            
            appCards.forEach(card => {
                const appName = card.querySelector('span').textContent.toLowerCase();
                const matches = appName.includes(query);
                
                if (matches) {
                    card.style.display = 'flex';
                    anime({
                        targets: card,
                        opacity: [0.5, 1],
                        scale: [0.95, 1],
                        duration: 200,
                        easing: 'easeOutQuart'
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: 0,
                        scale: 0.95,
                        duration: 200,
                        easing: 'easeOutQuart',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.formData.industry) {
                    this.showError('Please select your industry type.');
                    return false;
                }
                break;
            case 2:
                // Apps are optional, always valid
                break;
            case 3:
                // Goals are optional, always valid
                break;
            case 4:
                return this.validateEmail();
        }
        return true;
    }
    
    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput?.value.trim();
        
        if (!email) {
            this.showFieldError('email', 'Email address is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.formData.email = email;
        return true;
    }
    
    showError(message) {
        // Create or update error message
        let errorEl = document.querySelector('.wizard-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'wizard-error';
            errorEl.style.cssText = `
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: #ff6b6b;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            `;
            document.body.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        
        // Animate in
        anime({
            targets: errorEl,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: errorEl,
                opacity: 0,
                translateY: -20,
                duration: 300,
                easing: 'easeInQuart',
                complete: () => errorEl.remove()
            });
        }, 3000);
    }
    
    showFieldError(fieldName, message) {
        const errorEl = document.getElementById(`${fieldName}Error`);
        const fieldEl = document.getElementById(fieldName);
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        
        if (fieldEl) {
            fieldEl.classList.add('shake');
            setTimeout(() => fieldEl.classList.remove('shake'), 500);
        }
    }
    
    clearError(fieldName) {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.classList.remove('visible');
        }
    }
    
    async submitForm(e) {
        e.preventDefault();
        
        if (!this.validateEmail()) {
            return;
        }
        
        // Collect final form data
        this.formData.name = document.getElementById('name')?.value.trim() || '';
        this.formData.company = document.getElementById('company')?.value.trim() || '';
        
        const submitButton = document.getElementById('submitWizard');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<span>Processing...</span>';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.sendFormData();
            
            // Show success step
            this.showSuccessStep();
            
            // Clear saved data
            this.clearSavedData();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Something went wrong. Please try again.');
            
            // Restore button
            submitButton.classList.remove('loading');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    async sendFormData() {
        // This would be replaced with your actual form submission endpoint
        const formData = {
            ...this.formData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Log form data for development (remove in production)
        console.log('Form submission data:', formData);
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        
        // Example of real form submission:
        /*
        const response = await fetch('/api/automation-wizard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        
        return response.json();
        */
    }
    
    showSuccessStep() {
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        const successStepEl = document.getElementById('stepSuccess');
        
        // Hide current step
        anime({
            targets: currentStepEl,
            opacity: 0,
            translateY: -30,
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                currentStepEl.classList.remove('active');
                
                // Show success step
                successStepEl.style.display = 'block';
                successStepEl.classList.add('active');
                
                // Animate success step
                anime({
                    targets: successStepEl,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                
                // Replace feather icons in success step
                this.replaceFeatherIcons();
                
                // Animate success icon
                anime({
                    targets: '.success-icon',
                    scale: [0, 1],
                    rotateY: [0, 360],
                    duration: 800,
                    easing: 'easeOutElastic(1, .8)',
                    delay: 400
                });
                
                // Animate content
                anime({
                    targets: '.success-content h2, .success-content > p',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart',
                    delay: anime.stagger(100, {start: 600})
                });
                
                // Animate next steps
                anime({
                    targets: '.next-steps',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart',
                    delay: 800
                });
                
                // Animate actions
                anime({
                    targets: '.success-content .wizard-actions .button',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 400,
                    easing: 'easeOutQuart',
                    delay: anime.stagger(100, {start: 1000})
                });
            }
        });
        
        // Mark all dots as completed
        const progressDots = document.querySelectorAll('.progress-dot');
        progressDots.forEach(dot => {
            dot.classList.add('completed');
            dot.classList.remove('active');
        });
        
        // Update label to success
        const stepLabel = document.getElementById('currentStepLabel');
        if (stepLabel) {
            stepLabel.textContent = 'Complete!';
            anime({
                targets: stepLabel,
                opacity: [0.5, 1],
                scale: [1, 1.1, 1],
                duration: 600,
                easing: 'easeOutQuart'
            });
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('automationWizardData', JSON.stringify({
                ...this.formData,
                currentStep: this.currentStep,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Could not save wizard data to localStorage:', error);
        }
    }
    
    loadSavedData() {
        try {
            const saved = localStorage.getItem('automationWizardData');
            if (!saved) return;
            
            const data = JSON.parse(saved);
            const age = Date.now() - (data.timestamp || 0);
            
            // Only restore if data is less than 1 hour old
            if (age > 60 * 60 * 1000) {
                this.clearSavedData();
                return;
            }
            
            // Restore form data
            if (data.industry) {
                this.formData.industry = data.industry;
                const industryCard = document.querySelector(`[data-industry="${data.industry}"]`);
                if (industryCard) {
                    industryCard.classList.add('selected');
                    document.getElementById('step1Next').disabled = false;
                }
            }
            
            if (data.apps && Array.isArray(data.apps)) {
                this.formData.apps = data.apps;
                data.apps.forEach(app => {
                    const appCard = document.querySelector(`[data-app="${app}"]`);
                    if (appCard) {
                        appCard.classList.add('selected');
                    }
                });
                this.updateAppsSummary();
            }
            
            if (data.goals && Array.isArray(data.goals)) {
                this.formData.goals = data.goals;
                // Note: Goal restoration would need additional logic based on your goal structure
                this.updateGoalsSummary();
            }
            
            // Restore form fields
            ['email', 'name', 'company'].forEach(field => {
                if (data[field]) {
                    this.formData[field] = data[field];
                    const input = document.getElementById(field);
                    if (input) {
                        input.value = data[field];
                    }
                }
            });
            
        } catch (error) {
            console.warn('Could not load saved wizard data:', error);
            this.clearSavedData();
        }
    }
    
    clearSavedData() {
        try {
            localStorage.removeItem('automationWizardData');
        } catch (error) {
            console.warn('Could not clear saved wizard data:', error);
        }
    }
}

// Initialize wizard when both DOM and anime.js are ready
function initializeWizard() {
    console.log('🔍 Checking initialization... anime?', typeof anime, 'wizard element?', !!document.querySelector('.automation-wizard'));
    
    if (typeof anime === 'undefined') {
        console.log('⏳ anime.js not loaded yet, waiting...');
        return false;
    }
    
    if (document.querySelector('.automation-wizard')) {
        console.log('✅ Creating AutomationWizard!');
        window.wizard = new AutomationWizard();
        return true;
    }
    return false;
}

// Wait for both DOM and anime.js to be ready
function waitForDependencies() {
    console.log('⏰ waitForDependencies called');
    if (initializeWizard()) {
        console.log('🎉 Successfully initialized!');
        return;
    }
    
    // Check again in 100ms
    setTimeout(waitForDependencies, 100);
}

// Start checking for dependencies
console.log('📄 Script loaded, document.readyState:', document.readyState);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForDependencies);
} else {
    waitForDependencies();
}