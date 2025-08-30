// Automation Wizard JavaScript
class AutomationWizard {
    constructor() {
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
        // Add loaded class to show content
        const wizardContainer = document.querySelector('.automation-wizard');
        if (wizardContainer) {
            // Small delay to ensure CSS is fully loaded
            requestAnimationFrame(() => {
                wizardContainer.classList.add('loaded');
            });
        }
        
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
        // Simply add the animate-in class to trigger CSS animations
        const wizardContainer = document.querySelector('.automation-wizard');
        if (wizardContainer) {
            // Small delay to ensure the loaded class has been applied
            setTimeout(() => {
                wizardContainer.classList.add('animate-in');
            }, 50);
        }
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
        
        // Remove animate-in class from current step to clean up
        currentStepEl.classList.remove('animate-in');
        
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
                
                // Clean up any existing animate-in class on target
                targetStepEl.classList.remove('animate-in');
                
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
                        // Only animate step content if moving forward or if step hasn't been animated yet
                        if (isForward || !targetStepEl.dataset.animated) {
                            this.animateStepContent(targetStep);
                            targetStepEl.dataset.animated = 'true';
                        } else {
                            // Just add the class without re-triggering animations
                            targetStepEl.classList.add('animate-in');
                        }
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
        // Add animate-in class to the step to trigger CSS animations
        const stepElement = document.getElementById(`step${step}`);
        if (!stepElement) return;
        
        // Remove class first to ensure clean state
        stepElement.classList.remove('animate-in');
        
        // Use a proper timeout to ensure the browser resets the animation state
        setTimeout(() => {
            stepElement.classList.add('animate-in');
            
            // Ensure feather icons are replaced after animations
            setTimeout(() => {
                this.replaceFeatherIcons();
            }, 300);
        }, 50); // Small delay to allow CSS to reset
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
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const appCards = document.querySelectorAll('.app-card');
            
            // Clear any pending search timeout
            if (searchTimeout) clearTimeout(searchTimeout);
            
            // First, quickly hide non-matching cards
            const visibleCards = [];
            appCards.forEach(card => {
                const appName = card.querySelector('span').textContent.toLowerCase();
                const matches = query === '' || appName.includes(query);
                
                // Remove any existing anime.js animations
                if (typeof anime !== 'undefined') {
                    anime.remove(card);
                }
                
                if (!matches) {
                    // Quickly fade out non-matching cards
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    card.style.pointerEvents = 'none';
                } else {
                    visibleCards.push(card);
                    card.style.pointerEvents = 'auto';
                }
            });
            
            // After a brief delay, hide non-matching cards and animate visible ones
            searchTimeout = setTimeout(() => {
                appCards.forEach(card => {
                    const appName = card.querySelector('span').textContent.toLowerCase();
                    const matches = query === '' || appName.includes(query);
                    
                    if (!matches) {
                        card.style.display = 'none';
                    } else {
                        card.style.display = 'flex';
                    }
                });
                
                // Animate visible cards into position with stagger
                if (visibleCards.length > 0) {
                    anime({
                        targets: visibleCards,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        translateY: [20, 0],
                        duration: 400,
                        delay: anime.stagger(30, {start: 0}),
                        easing: 'easeOutQuart'
                    });
                }
            }, 150); // Small delay to allow fade out before reflow
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
        // Submit form data to social-ops API endpoint
        const formData = {
            email: this.formData.email,
            name: this.formData.name || '',
            company: this.formData.company || '',
            industry: this.formData.industry,
            apps: this.formData.apps,
            goals: this.formData.goals,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Determine the API endpoint based on environment
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiEndpoint = isDev 
            ? 'http://localhost:8080/api/forms/automation-wizard'
            : 'https://app.vlogical.ai/api/forms/automation-wizard';
        
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
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
                successStepEl.style.display = 'flex';
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
    if (typeof anime === 'undefined') {
        return false;
    }
    
    if (document.querySelector('.automation-wizard')) {
        window.wizard = new AutomationWizard();
        return true;
    }
    return false;
}

// Wait for both DOM and anime.js to be ready
function waitForDependencies() {
    if (initializeWizard()) {
        return;
    }
    
    // Check again in 100ms
    setTimeout(waitForDependencies, 100);
}

// Start checking for dependencies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForDependencies);
} else {
    waitForDependencies();
}