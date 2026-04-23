export type Language = 'en' | 'de';

export const translations = {
  en: {
    // App
    appName: 'Behörden Navigator',
    appTagline: 'Step by step through German bureaucracy',

    // Tabs
    tabProcedures: 'Procedures',
    tabMyProgress: 'My Progress',
    tabAssistant: 'Assistant',
    tabOffices: 'Offices',

    // Home screen
    homeGreeting: 'What do you need to do?',
    homeSubtitle: 'Choose a procedure to get started',
    searchPlaceholder: 'Search procedures...',
    allCategories: 'All',

    // Categories
    categoryRegistration: 'Registration',
    categoryVisa: 'Visa & Residence',
    categoryWork: 'Work & Tax',
    categoryDriving: 'Driving',
    categoryFamily: 'Family',
    categoryBusiness: 'Business',

    // Procedure detail
    stepsTitle: 'Steps',
    documentsTitle: 'Documents needed',
    estimatedTime: 'Estimated time',
    days: 'days',
    difficulty: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    startProcedure: 'Start this procedure',
    continueProc: 'Continue',
    completed: 'Completed',
    markDone: 'Mark as done',
    markPending: 'Mark as pending',
    nextStep: 'Next step',
    tip: 'Tip',
    required: 'Required documents for this step',

    // Progress
    progressTitle: 'My Progress',
    progressEmpty: 'No procedures started yet.',
    progressEmptyHint: 'Go to Procedures to start one.',
    inProgress: 'In progress',
    notStarted: 'Not started',
    completedLabel: 'Completed',
    resetProgress: 'Reset progress',

    // Assistant
    assistantTitle: 'AI Assistant',
    assistantSubtitle: 'Ask anything about German bureaucracy',
    assistantPlaceholder: 'Ask a question...',
    assistantWelcome: 'Hello! I can help you navigate German bureaucracy. Ask me about any procedure, document, or office.',
    assistantSend: 'Send',
    assistantThinking: 'Thinking...',
    assistantError: 'Something went wrong. Please try again.',
    assistantDisclaimer: 'AI responses are for guidance only. Always verify with the official Behörde.',

    // Offices
    officesTitle: 'Find an Office',
    officesSubtitle: 'Locate the right Amt near you',
    officeHours: 'Opening hours',
    officeCall: 'Call',
    officeBook: 'Book appointment',
    officeWebsite: 'Website',
    officeNoResults: 'No offices found near you.',

    // Documents
    original: 'Original',
    copy: 'Copy',
    whereToGet: 'Where to get this',

    // Common
    back: 'Back',
    close: 'Close',
    loading: 'Loading...',
    error: 'Something went wrong.',
    retry: 'Try again',
    updatedFor: '2025',
    langToggle: 'DE',
  },

  de: {
    appName: 'Behörden Navigator',
    appTagline: 'Schritt für Schritt durch den deutschen Behördendschungel',

    tabProcedures: 'Verfahren',
    tabMyProgress: 'Mein Fortschritt',
    tabAssistant: 'Assistent',
    tabOffices: 'Ämter',

    homeGreeting: 'Was möchtest du erledigen?',
    homeSubtitle: 'Wähle ein Verfahren um loszulegen',
    searchPlaceholder: 'Verfahren suchen...',
    allCategories: 'Alle',

    categoryRegistration: 'Anmeldung',
    categoryVisa: 'Visum & Aufenthalt',
    categoryWork: 'Arbeit & Steuer',
    categoryDriving: 'Führerschein',
    categoryFamily: 'Familie',
    categoryBusiness: 'Gewerbe',

    stepsTitle: 'Schritte',
    documentsTitle: 'Benötigte Dokumente',
    estimatedTime: 'Geschätzte Zeit',
    days: 'Tage',
    difficulty: 'Schwierigkeit',
    difficultyEasy: 'Einfach',
    difficultyMedium: 'Mittel',
    difficultyHard: 'Schwierig',
    startProcedure: 'Verfahren starten',
    continueProc: 'Weiter',
    completed: 'Abgeschlossen',
    markDone: 'Als erledigt markieren',
    markPending: 'Als offen markieren',
    nextStep: 'Nächster Schritt',
    tip: 'Tipp',
    required: 'Benötigte Dokumente für diesen Schritt',

    progressTitle: 'Mein Fortschritt',
    progressEmpty: 'Noch keine Verfahren gestartet.',
    progressEmptyHint: 'Gehe zu Verfahren um eines zu starten.',
    inProgress: 'In Bearbeitung',
    notStarted: 'Nicht begonnen',
    completedLabel: 'Abgeschlossen',
    resetProgress: 'Fortschritt zurücksetzen',

    assistantTitle: 'KI-Assistent',
    assistantSubtitle: 'Frag alles über deutsche Behörden',
    assistantPlaceholder: 'Frage stellen...',
    assistantWelcome: 'Hallo! Ich helfe dir beim Navigieren durch deutsche Behörden. Frag mich zu Verfahren, Dokumenten oder Ämtern.',
    assistantSend: 'Senden',
    assistantThinking: 'Denke nach...',
    assistantError: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    assistantDisclaimer: 'KI-Antworten dienen nur zur Orientierung. Bitte immer bei der zuständigen Behörde nachfragen.',

    officesTitle: 'Amt finden',
    officesSubtitle: 'Das richtige Amt in deiner Nähe finden',
    officeHours: 'Öffnungszeiten',
    officeCall: 'Anrufen',
    officeBook: 'Termin buchen',
    officeWebsite: 'Webseite',
    officeNoResults: 'Keine Ämter in deiner Nähe gefunden.',

    original: 'Original',
    copy: 'Kopie',
    whereToGet: 'Wo bekommt man das',

    back: 'Zurück',
    close: 'Schließen',
    loading: 'Lädt...',
    error: 'Etwas ist schiefgelaufen.',
    retry: 'Erneut versuchen',
    updatedFor: '2025',
    langToggle: 'EN',
  },
} as const;

export type Translations = typeof translations.en;