# GoldiDocs - Minimal Atomic Design System

## Table of Contents
1. [Design Principles](#design-principles)
2. [Design Tokens](#design-tokens)
3. [Atoms](#atoms)
4. [Molecules](#molecules)
5. [Organisms](#organisms)
6. [Templates](#templates)
7. [Pages](#pages)
8. [Motion & Choreography](#motion--choreography)

---

## Design Principles

### Core Principles
1. **Clarity First**: Every element serves a clear purpose
2. **Progressive Disclosure**: Complexity revealed gradually
3. **Visual Hierarchy**: Important elements command attention
4. **Consistent Feedback**: Every interaction has a response
5. **Dark Interface**: Optimized for long work sessions

---

## Design Tokens

### Color Palette

#### Obsidian Scale (Primary Dark)
```css
--color-obsidian-50: #F8F9FA;   /* Ultra light for text on dark */
--color-obsidian-100: #E9ECEF;  /* Light text/borders */
--color-obsidian-200: #CED4DA;  /* Medium light borders */
--color-obsidian-300: #ADB5BD;  /* Secondary text */
--color-obsidian-400: #6C757D;  /* Muted text */
--color-obsidian-500: #495057;  /* Medium contrast */
--color-obsidian-600: #343A40;  /* Dark surfaces */
--color-obsidian-700: #212529;  /* Darker surfaces */
--color-obsidian-800: #16191C;  /* Card backgrounds */
--color-obsidian-900: #0B1215;  /* Main Background */
--color-obsidian-950: #050708;  /* Deepest black */
```

#### Gold Scale (Primary Accent)
```css
--color-gold-50: #FFFEF7;    /* Ultra light gold tint */
--color-gold-100: #FFF9E6;   /* Light gold backgrounds */
--color-gold-200: #FFF1CC;   /* Subtle gold highlights */
--color-gold-300: #FFE499;   /* Light gold accents */
--color-gold-400: #FFD966;   /* Medium gold */
--color-gold-500: #FFD700;   /* Standard Gold (Primary) */
--color-gold-600: #D4AF37;   /* Metallic Gold (Secondary) */
--color-gold-700: #B8941F;   /* Dark gold */
--color-gold-800: #9C7A0C;   /* Darker gold */
--color-gold-900: #7A5F00;   /* Deep gold */
--color-gold-950: #4D3D00;   /* Darkest gold */
```

#### Slate Scale (Neutral Greys)
```css
--color-slate-50: #F8FAFC;   /* Light text on dark */
--color-slate-100: #F1F5F9;  /* Very light borders */
--color-slate-200: #E2E8F0;  /* Light borders */
--color-slate-300: #CBD5E1;  /* Medium borders */
--color-slate-400: #94A3B8;  /* Secondary text */
--color-slate-500: #64748B;  /* Muted text */
--color-slate-600: #475569;  /* Dark text */
--color-slate-700: #334155;  /* Surface borders */
--color-slate-800: #1E293B;  /* Dark surfaces */
--color-slate-900: #0F172A;  /* Very dark surfaces */
```

#### Semantic Colors
```css
--color-success-500: #22C55E;   /* Green for success states */
--color-success-600: #16A34A;   /* Darker green */
--color-warning-500: #FFD700;   /* Gold for warnings */
--color-warning-600: #D4AF37;   /* Metallic gold */
--color-error-500: #EF4444;     /* Red for errors */
--color-error-600: #DC2626;     /* Darker red */
--color-info-500: #3B82F6;      /* Blue for info */
--color-info-600: #2563EB;      /* Darker blue */
```

#### Node Colors (Obsidian Theme)
```css
--color-node-problem: #EF4444;   /* Red for problems */
--color-node-persona: #8B5CF6;   /* Purple for personas */
--color-node-pain: #F97316;      /* Orange for pain points */
--color-node-solution: #FFD700;  /* Gold for solutions */
--color-node-story: #3B82F6;     /* Blue for user stories */
--color-node-core: #D4AF37;      /* Metallic gold for core problems */
```

### Typography

#### Font Stack
```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
```

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.25rem;   /* 20px */
--radius-full: 9999px;
```

### Shadows (Obsidian Theme)

```css
--shadow-sm: 0 1px 2px 0 rgba(5, 7, 8, 0.3);
--shadow-base: 0 1px 3px 0 rgba(5, 7, 8, 0.4), 0 1px 2px 0 rgba(5, 7, 8, 0.2);
--shadow-md: 0 4px 6px -1px rgba(5, 7, 8, 0.4), 0 2px 4px -1px rgba(5, 7, 8, 0.2);
--shadow-lg: 0 10px 15px -3px rgba(5, 7, 8, 0.4), 0 4px 6px -2px rgba(5, 7, 8, 0.2);
--shadow-xl: 0 20px 25px -5px rgba(5, 7, 8, 0.5), 0 10px 10px -5px rgba(5, 7, 8, 0.3);
--shadow-2xl: 0 25px 50px -12px rgba(5, 7, 8, 0.6);

/* Glow effects */
--shadow-glow-gold: 0 0 20px rgba(255, 215, 0, 0.4);
--shadow-glow-metallic: 0 0 20px rgba(212, 175, 55, 0.3);
--shadow-glow-success: 0 0 20px rgba(34, 197, 94, 0.3);
--shadow-glow-error: 0 0 20px rgba(239, 68, 68, 0.3);

/* Obsidian-specific shadows */
--shadow-obsidian-inset: inset 0 2px 4px rgba(5, 7, 8, 0.8);
--shadow-obsidian-deep: 0 8px 32px rgba(5, 7, 8, 0.8);
```

### Transitions

```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Atoms

### A1. Text Styles

#### Heading Styles
```css
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: white;
}

.heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: white;
}

.heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: white;
}
```

#### Body Styles
```css
.body-base {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-200);
}

.body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-400);
}

.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### A2. Buttons

#### Primary Button
```css
.btn-primary {
  /* Sizing */
  padding: var(--space-3) var(--space-6);
  min-width: 120px;
  height: 48px;
  
  /* Typography */
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  
  /* Colors */
  background: var(--color-primary-600);
  color: white;
  
  /* Border & Shape */
  border: none;
  border-radius: var(--radius-md);
  
  /* Effects */
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-base);
}
```

#### Secondary Button
```css
.btn-secondary {
  /* Same sizing as primary */
  padding: var(--space-3) var(--space-6);
  min-width: 120px;
  height: 48px;
  
  /* Colors */
  background: transparent;
  color: var(--color-gray-300);
  border: 1px solid var(--color-gray-700);
  
  /* Effects */
  transition: all var(--duration-base) var(--ease-out);
}

.btn-secondary:hover {
  background: var(--color-gray-800);
  border-color: var(--color-gray-600);
  color: white;
}
```

#### Icon Button
```css
.btn-icon {
  /* Sizing */
  width: 40px;
  height: 40px;
  padding: 0;
  
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Colors */
  background: var(--color-gray-800);
  color: var(--color-gray-400);
  
  /* Shape */
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-700);
  
  /* Effects */
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-icon:hover {
  background: var(--color-gray-700);
  color: white;
  border-color: var(--color-gray-600);
}
```

#### Gold CTA Button
```css
.btn-gold {
  /* Sizing */
  padding: var(--space-3) var(--space-6) !important; /* 12px 24px */
  min-width: 140px;
  height: 48px;
  
  /* Typography */
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  
  /* Colors */
  background: var(--color-gold-600); /* Metallic Gold */
  color: var(--color-obsidian-950); /* Deepest black text */
  
  /* Border & Shape */
  border: none;
  border-radius: var(--radius-lg);
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  /* Effects */
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
  box-shadow: var(--shadow-base);
}

.btn-gold:hover {
  background: var(--color-gold-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-gold:active {
  transform: translateY(0);
  box-shadow: var(--shadow-base);
}

.btn-gold:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### A3. Icons

```css
.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.icon-sm { width: 14px; height: 14px; }
.icon-lg { width: 20px; height: 20px; }
.icon-xl { width: 24px; height: 24px; }
```

### A4. Badges

```css
.badge {
  /* Sizing */
  padding: var(--space-1) var(--space-2);
  
  /* Typography */
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
  
  /* Shape */
  border-radius: var(--radius-full);
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.badge-critical {
  background: var(--color-error-600);
  color: white;
}

.badge-warning {
  background: var(--color-warning-600);
  color: white;
}

.badge-info {
  background: var(--color-primary-600);
  color: white;
}
```

### A5. Input Fields

```css
.input {
  /* Sizing */
  width: 100%;
  padding: var(--space-3) var(--space-4);
  
  /* Typography */
  font-size: var(--text-base);
  color: white;
  
  /* Background & Border */
  background: var(--color-gray-800);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  
  /* Effects */
  transition: all var(--duration-base) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--color-gray-500);
}
```

### A6. Checkboxes

```css
.checkbox {
  /* Sizing */
  width: 20px;
  height: 20px;
  
  /* Appearance */
  appearance: none;
  background: var(--color-gray-800);
  border: 2px solid var(--color-gray-600);
  border-radius: var(--radius-base);
  
  /* Effects */
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  position: relative;
}

.checkbox:checked {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}
```

---

## Molecules

### M1. Form Field

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-400);
}

.form-field-error {
  font-size: var(--text-sm);
  color: var(--color-error-500);
  margin-top: var(--space-1);
}
```

### M2. Button Group

```css
.button-group {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.button-group--attached {
  gap: 0;
}

.button-group--attached > .btn-secondary:not(:first-child) {
  border-left: 0;
  border-radius: 0;
}

.button-group--attached > .btn-secondary:first-child {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.button-group--attached > .btn-secondary:last-child {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
```

### M3. Node Lock Control

```css
.node-lock {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  
  /* Icon button styling */
  width: 24px;
  height: 24px;
  padding: var(--space-1);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-base);
  
  /* Effects */
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.node-lock:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.node-lock--locked {
  color: var(--color-warning-500);
}
```

### M4. Progress Indicator

```css
.progress-step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-circle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-base) var(--ease-out);
}

.progress-circle--active {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-glow-primary);
}

.progress-line {
  width: 40px;
  height: 2px;
  background: var(--color-gray-700);
  transition: all var(--duration-slow) var(--ease-out);
}

.progress-line--complete {
  background: var(--color-primary-600);
}
```

### M5. Selection Counter

```css
.selection-counter {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid var(--color-primary-600);
  color: var(--color-primary-400);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-3xl);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  backdrop-filter: blur(10px);
}
```

---

## Organisms

### O1. Canvas Node

```css
.canvas-node {
  /* Base styling */
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  position: relative;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
  
  /* Shadow and effects */
  box-shadow: var(--shadow-lg);
}

.canvas-node:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.canvas-node--selected {
  ring: 2px solid;
  ring-offset: 2px;
  ring-offset-color: transparent;
}

/* Node type variants */
.canvas-node--problem {
  background: linear-gradient(135deg, var(--color-node-problem), #B91C1C);
  color: white;
  min-width: 320px;
  min-height: 120px;
}

.canvas-node--persona {
  background: linear-gradient(135deg, var(--color-node-persona), #0D9488);
  color: white;
  min-width: 280px;
  min-height: 160px;
}

.canvas-node--pain {
  background: linear-gradient(135deg, var(--color-node-pain), #EA580C);
  color: white;
  min-width: 300px;
  min-height: 120px;
}

.canvas-node--solution {
  background: linear-gradient(135deg, var(--color-node-solution), #2563EB);
  color: white;
  min-width: 320px;
  min-height: 140px;
}

/* Node animations */
@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.canvas-node--entering {
  animation: nodeAppear var(--duration-base) var(--ease-out) forwards;
}
```

### O2. Sidebar Navigation

```css
.sidebar {
  width: 256px;
  height: 100vh;
  background: var(--color-gray-800);
  border-right: 1px solid var(--color-gray-700);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 64px;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-700);
  display: flex;
  align-items: center;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.sidebar-item {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-gray-300);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar-item:hover {
  background: var(--color-gray-700);
  color: white;
}

.sidebar-item--active {
  background: var(--color-gray-700);
  color: white;
}
```

### O3. Modal Dialog

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  
  /* Animation */
  animation: fadeIn var(--duration-base) var(--ease-out);
}

.modal-content {
  background: var(--color-gray-800);
  border: 1px solid var(--color-gray-700);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  /* Animation */
  animation: slideUp var(--duration-base) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### O4. Card Component

```css
.card {
  background: var(--color-gray-800);
  border: 1px solid var(--color-gray-700);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--duration-base) var(--ease-out);
}

.card:hover {
  border-color: var(--color-gray-600);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-gray-700);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: white;
}

.card-content {
  color: var(--color-gray-300);
}
```

---

## Templates

### T1. Canvas Layout Template

```css
.canvas-layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar canvas";
  grid-template-columns: 256px 1fr;
  grid-template-rows: 80px 1fr;
  height: 100vh;
  background: var(--color-gray-900);
}

.canvas-layout__sidebar {
  grid-area: sidebar;
}

.canvas-layout__header {
  grid-area: header;
  background: var(--color-gray-800);
  border-bottom: 1px solid var(--color-gray-700);
}

.canvas-layout__main {
  grid-area: canvas;
  position: relative;
  overflow: hidden;
}
```

### T2. Centered Content Template

```css
.centered-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-900);
  padding: var(--space-8);
}

.centered-content {
  max-width: 672px;
  width: 100%;
  animation: fadeInScale var(--duration-slow) var(--ease-out);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Pages

### P1. Problem Input Page

```css
.problem-input-page {
  /* Uses centered-layout template */
}

.problem-heading {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: white;
  margin-bottom: var(--space-8);
  text-align: center;
}

/* Problem Text Input Areas - Compact Version */
.problem-textarea {
  width: 100%;
  min-height: 96px;
  padding: 8px 12px !important; /* 8px top/bottom, 12px left/right - Override CSS reset */
  background: rgba(22, 25, 28, 0.8);
  border: 1px solid #495057;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: all 300ms ease-out;
}

.problem-textarea:focus {
  outline: none;
  border-color: #6C757D;
  box-shadow: none;
}

.problem-textarea::placeholder {
  color: #6C757D;
  opacity: 1;
}

/* Alternative Large Problem Input */
.problem-textarea--large {
  width: 100%;
  min-height: 160px;
  padding: var(--space-4);
  background: var(--color-gray-800);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  color: white;
  font-size: var(--text-base);
  resize: vertical;
  transition: all var(--duration-base) var(--ease-out);
}

.problem-textarea--large:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### P2. Canvas Workflow Page

```css
.canvas-page {
  /* Uses canvas-layout template */
}

.canvas-controls {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  display: flex;
  gap: var(--space-2);
  z-index: 10;
}

.canvas-viewport {
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, var(--color-gray-800) 1px, transparent 1px);
  background-size: 12px 12px;
}
```

---

## Motion & Choreography

### Animation Philosophy

**Important**: We use pure CSS animations and transitions exclusively. Framer Motion and other JavaScript animation libraries are not used in this project to maintain optimal performance with React Flow and prevent conflicts with drag-and-drop functionality.

### Animation Sequences

#### 1. Initial Load Sequence
```css
/* Stagger delay for multiple elements */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 150ms; }
.stagger-3 { animation-delay: 300ms; }
.stagger-4 { animation-delay: 450ms; }
.stagger-5 { animation-delay: 600ms; }

/* Canvas node appearance - CSS only */
.node-sequence {
  opacity: 0;
  animation: nodeSequence var(--duration-base) var(--ease-out) forwards;
}

@keyframes nodeSequence {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  50% {
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

#### 2. Page Transitions
```css
.page-transition-exit {
  animation: pageExit var(--duration-base) var(--ease-in) forwards;
}

.page-transition-enter {
  animation: pageEnter var(--duration-base) var(--ease-out) forwards;
}

@keyframes pageExit {
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 3. Canvas Interactions
```css
/* Node hover lift */
.node-hover-lift {
  transition: all var(--duration-fast) var(--ease-out);
}

.node-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.25);
}

/* Edge connection animation */
.edge-animated {
  stroke-dasharray: 5 5;
  animation: edgeDash 20s linear infinite;
}

@keyframes edgeDash {
  to {
    stroke-dashoffset: -100;
  }
}

/* Selection pulse */
.selection-pulse {
  animation: pulse 2s var(--ease-in-out) infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(37, 99, 235, 0);
  }
}
```

### Interaction States

#### Focus States
```css
.focusable:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.focus-ring {
  position: relative;
}

.focus-ring:focus-visible::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--color-primary-500);
  border-radius: inherit;
  pointer-events: none;
}
```

#### Loading States
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-800) 25%,
    var(--color-gray-700) 50%,
    var(--color-gray-800) 75%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-700);
  border-top-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Micro-interactions

#### Button Press
```css
.btn-press {
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-press:active {
  transform: scale(0.98);
}
```

#### Toggle Switch
```css
.toggle {
  width: 48px;
  height: 24px;
  background: var(--color-gray-700);
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-base) var(--ease-out);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: var(--radius-full);
  transition: transform var(--duration-base) var(--ease-bounce);
}

.toggle--active {
  background: var(--color-primary-600);
}

.toggle--active .toggle-thumb {
  transform: translateX(24px);
}
```

### Responsive Utilities

```css
/* Breakpoints */
@media (max-width: 1440px) {
  .canvas-node {
    transform: scale(0.9);
  }
}

@media (max-width: 1280px) {
  .sidebar {
    position: absolute;
    transform: translateX(-100%);
    transition: transform var(--duration-base) var(--ease-out);
  }
  
  .sidebar--open {
    transform: translateX(0);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Notes

### CSS Architecture
1. Use CSS custom properties for all design tokens
2. Follow BEM naming convention for components
3. Separate structural and skin styles
4. Use utility classes sparingly

### Animation Framework Policy
1. **No Framer Motion**: We exclusively use CSS animations and transitions
2. **React Flow Compatibility**: All node animations must be CSS-based to prevent conflicts with React Flow's drag handling
3. **Performance First**: CSS animations are GPU-accelerated and don't interfere with React's reconciliation

### Performance Considerations
1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, or `top/left` properties
3. Use `will-change` sparingly on elements that will animate
4. Implement virtual scrolling for long lists
5. Disable hover effects during drag operations (use `.react-flow__node-dragging` selector)

### Accessibility
1. Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
2. Provide focus indicators for all interactive elements
3. Support keyboard navigation throughout
4. Include ARIA labels where necessary
5. Respect `prefers-reduced-motion` settings

This minimal atomic design system provides a solid foundation for building GoldiDocs while maintaining consistency, performance, and accessibility across the entire application.