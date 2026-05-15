import { createContext, useContext, useState } from 'react'

// ─── Supported locales ────────────────────────────────────────────────────────
const VALID_LANGS = ['fr', 'ar', 'darija', 'en']

const t = {
  // ── French ──────────────────────────────────────────────────────────────────
  fr: {
    home: 'Accueil', dashboard: 'Mon espace', login: 'Connexion', register: "S'inscrire", logout: 'Déconnexion',
    badge: 'Assistant IA pour étudiants marocains',
    heroTitle: 'Ton assistant', heroTitleBold: 'intelligent',
    heroDesc: 'Résumés, quiz, flashcards, examens blancs — tout en un.',
    startBtn: 'Commencer maintenant',
    feat1Title: 'Chat IA', feat1Desc: 'Pose tes questions, obtiens des réponses pédagogiques.',
    feat2Title: 'Résumé + PDF', feat2Desc: 'Importe un PDF ou une image, reçois un résumé.',
    feat3Title: 'Quiz QCM', feat3Desc: 'Génère des questions depuis ton cours.',
    feat4Title: 'Orientation', feat4Desc: 'Trouve ta filière idéale.',
    feat5Title: 'Flashcards', feat5Desc: 'Mémorise avec des fiches interactives.',
    feat6Title: 'Mode Examen', feat6Desc: 'Entraîne-toi avec un timer et un rapport.',
    welcomeBack: 'Bon retour,', chooseFeature: "Que veux-tu faire aujourd'hui ?",
    chatTitle: 'Assistant IA', chatDesc: 'Pose toutes tes questions.',
    summaryTitle: 'Résumé + PDF', summaryDesc: 'Résume un cours ou importe un fichier.',
    quizTitle: 'Quiz QCM', quizDesc: 'Génère des questions depuis ton cours.',
    orientTitle: 'Orientation', orientDesc: 'Trouve ta filière idéale.',
    flashTitle: 'Flashcards', flashDesc: 'Mémorise avec des fiches Q&R.',
    examTitle: 'Mode Examen', examDesc: 'Examen blanc avec timer et score.',
    loginTitle: 'Connexion', loginSub: 'Bienvenue ! Connecte-toi.',
    emailLabel: 'Email', passLabel: 'Mot de passe', nameLabel: 'Nom complet',
    loginBtn: 'Se connecter', registerBtn: "S'inscrire",
    noAccount: 'Pas de compte ?', hasAccount: 'Déjà un compte ?',
    registerTitle: 'Créer un compte', registerSub: "Rejoins l'aventure !",
    chatWelcome: 'Salam ! Je suis ton assistant IA\nPose-moi tes questions sur tes cours ou ton orientation.',
    chatPlaceholder: 'Pose ta question...',
    quickQ1: 'Comment réviser efficacement ?',
    quickQ2: 'Explique les équations du 2nd degré',
    quickQ3: 'Quelles filières après le Bac S ?',
    quickQ4: 'Aide-moi à faire un plan de révision',
    summaryPageTitle: 'Résumé de cours', summaryPageSub: 'Texte, PDF ou image → résumé structuré',
    summaryPlaceholder: 'Colle ton cours ici...', summaryBtn: 'Générer le résumé',
    uploadClick: 'Clique', uploadDrag: 'ou glisse un PDF / une image ici',
    quizPageTitle: 'Quiz de révision', quizPageSub: 'Génère des QCM depuis ton cours',
    quizCoursePlaceholder: 'Colle ton cours (optionnel)...',
    quizSubjectPlaceholder: 'Ou entre une matière (ex: Maths, Histoire...)',
    quizBtn: 'Générer le quiz', quizNext: 'Suivant', quizFinish: 'Voir mon score',
    quizRestart: 'Recommencer', quizScore: 'Ton score',
    orientPageTitle: 'Orientation scolaire', orientPageSub: 'Décris ton profil',
    orientPlaceholder: "Ex: 16/20 en maths, j'aime l'informatique...", orientBtn: 'Obtenir des recommandations',
    flashSub: 'Génère des fiches question/réponse depuis ton cours',
    flashPlaceholder: 'Colle ton cours ici...', flashBtn: 'Générer les flashcards',
    flashClickHint: 'Clique pour révéler la réponse',
    prev: 'Précédent', next: 'Suivant', flip: 'Retourner', newDeck: 'Nouveau deck',
    examSub: 'Entraîne-toi avec un vrai examen chronométré',
    examSubject: 'Matière', examNumQ: 'Nombre de questions', examDuration: 'Durée',
    startExam: "Démarrer l'examen", submitExam: 'Terminer',
    examAnswered: 'répondues', newExam: 'Nouvel examen',
    examExcellent: 'Excellent !', examGood: 'Bien joué !', examKeepGoing: 'Continue tes efforts !',
    statTotal: 'Sessions totales', statChats: 'Chats', statSummaries: 'Résumés', statQuizzes: 'Quiz',
    recentActivity: 'Activité récente', progressTitle: 'Ma progression',
    profileTitle: 'Mon profil',
    guestBannerMsg: 'Connecte-toi pour sauvegarder ton travail et accéder à ton historique.',
    guestBannerDismiss: 'Fermer',
  },

  // ── Arabic (MSA / Moroccan standard) ────────────────────────────────────────
  ar: {
    home: 'الرئيسية', dashboard: 'فضائي', login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'خروج',
    badge: 'مساعد ذكي للطلاب المغاربة',
    heroTitle: 'مساعدك', heroTitleBold: 'الذكي',
    heroDesc: 'ملخصات، اختبارات، بطاقات تعليمية، امتحانات تجريبية — كل شيء في مكان واحد.',
    startBtn: 'ابدأ الآن',
    feat1Title: 'المحادثة الذكية', feat1Desc: 'اطرح أسئلتك واحصل على إجابات تعليمية.',
    feat2Title: 'ملخص + PDF', feat2Desc: 'استورد PDF أو صورة واحصل على ملخص.',
    feat3Title: 'اختبار QCM', feat3Desc: 'أنشئ أسئلة من درسك.',
    feat4Title: 'التوجيه المدرسي', feat4Desc: 'اعثر على مسارك المثالي.',
    feat5Title: 'البطاقات التعليمية', feat5Desc: 'احفظ بالبطاقات التفاعلية.',
    feat6Title: 'وضع الامتحان', feat6Desc: 'تدرب مع مؤقت وتقرير نهائي.',
    welcomeBack: 'مرحباً بعودتك،', chooseFeature: 'ماذا تريد أن تفعل اليوم؟',
    chatTitle: 'المساعد الذكي', chatDesc: 'اطرح جميع أسئلتك.',
    summaryTitle: 'ملخص + PDF', summaryDesc: 'لخص درسًا أو استورد ملفًا.',
    quizTitle: 'اختبار QCM', quizDesc: 'أنشئ أسئلة من درسك.',
    orientTitle: 'التوجيه', orientDesc: 'اعثر على مسارك المثالي.',
    flashTitle: 'البطاقات التعليمية', flashDesc: 'احفظ ببطاقات سؤال/جواب.',
    examTitle: 'وضع الامتحان', examDesc: 'امتحان تجريبي مع مؤقت ونتيجة.',
    loginTitle: 'تسجيل الدخول', loginSub: 'مرحباً! سجل دخولك.',
    emailLabel: 'البريد الإلكتروني', passLabel: 'كلمة المرور', nameLabel: 'الاسم الكامل',
    loginBtn: 'دخول', registerBtn: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب؟',
    registerTitle: 'إنشاء حساب', registerSub: 'انضم إلى المجتمع!',
    chatWelcome: 'السلام عليكم! أنا مساعدك الذكي\nاطرح أسئلتك حول دروسك أو توجيهك.',
    chatPlaceholder: 'اطرح سؤالك...',
    quickQ1: 'كيف أراجع بفعالية؟',
    quickQ2: 'اشرح معادلات الدرجة الثانية',
    quickQ3: 'ما هي المسارات بعد الباكالوريا؟',
    quickQ4: 'ساعدني في وضع خطة مراجعة',
    summaryPageTitle: 'ملخص الدرس', summaryPageSub: 'نص أو PDF أو صورة ← ملخص منظم',
    summaryPlaceholder: 'الصق درسك هنا...', summaryBtn: 'إنشاء الملخص',
    uploadClick: 'انقر', uploadDrag: 'أو اسحب PDF أو صورة هنا',
    quizPageTitle: 'اختبار المراجعة', quizPageSub: 'أنشئ أسئلة QCM',
    quizCoursePlaceholder: 'الصق درسك (اختياري)...',
    quizSubjectPlaceholder: 'أو أدخل مادة (مثال: رياضيات، تاريخ...)',
    quizBtn: 'إنشاء الاختبار', quizNext: 'التالي', quizFinish: 'عرض نتيجتي',
    quizRestart: 'البدء من جديد', quizScore: 'نتيجتك',
    orientPageTitle: 'التوجيه المدرسي', orientPageSub: 'صف ملفك الشخصي',
    orientPlaceholder: 'مثال: 16 في الرياضيات، أحب الإعلاميات...', orientBtn: 'الحصول على توصيات',
    flashSub: 'أنشئ بطاقات سؤال/جواب من درسك',
    flashPlaceholder: 'الصق درسك هنا...', flashBtn: 'إنشاء البطاقات',
    flashClickHint: 'انقر للكشف عن الإجابة',
    prev: 'السابق', next: 'التالي', flip: 'قلب', newDeck: 'مجموعة جديدة',
    examSub: 'تدرب بامتحان حقيقي مع توقيت',
    examSubject: 'المادة', examNumQ: 'عدد الأسئلة', examDuration: 'المدة',
    startExam: 'بدء الامتحان', submitExam: 'إنهاء',
    examAnswered: 'تمت الإجابة', newExam: 'امتحان جديد',
    examExcellent: 'ممتاز!', examGood: 'أحسنت!', examKeepGoing: 'واصل الجهد!',
    statTotal: 'الجلسات الكلية', statChats: 'محادثات', statSummaries: 'ملخصات', statQuizzes: 'اختبارات',
    recentActivity: 'النشاط الأخير', progressTitle: 'تقدمي',
    profileTitle: 'ملفي الشخصي',
    guestBannerMsg: 'سجّل دخولك لحفظ عملك والوصول إلى سجلّك.',
    guestBannerDismiss: 'إغلاق',
  },

  // ── Darija (Moroccan colloquial Arabic, RTL) ─────────────────────────────────
  darija: {
    home: 'الصفحة الرئيسية', dashboard: 'فضائي', login: 'دخول', register: 'سجل', logout: 'خروج',
    badge: 'مساعد ديال الذكاء الاصطناعي للطلبة المغاربة',
    heroTitle: 'المساعد ديالك', heroTitleBold: 'الذكي',
    heroDesc: 'ملخصات، quiz، flashcards، امتحانات تجريبية — كلشي ف بلاصة وحدة.',
    startBtn: 'بدا دابا',
    feat1Title: 'Chat IA', feat1Desc: 'سول أسئلتك وجاوبك بطريقة بيداغوجية.',
    feat2Title: 'ملخص + PDF', feat2Desc: 'حمّل PDF ولا صورة وتقدر تاخد ملخص.',
    feat3Title: 'Quiz QCM', feat3Desc: 'ولّد أسئلة من الدرس ديالك.',
    feat4Title: 'التوجيه', feat4Desc: 'لقى الفيليار المناسبة ليك.',
    feat5Title: 'Flashcards', feat5Desc: 'حفظ بالبطاقات التفاعلية.',
    feat6Title: 'Mode Examen', feat6Desc: 'تدرب مع timer وتقرير.',
    welcomeBack: 'مرحبا بيك،', chooseFeature: 'شنو بغيتي تدير اليوم؟',
    chatTitle: 'المساعد الذكي', chatDesc: 'سول جميع أسئلتك.',
    summaryTitle: 'ملخص + PDF', summaryDesc: 'لخص درس ولا حمّل فيشيي.',
    quizTitle: 'Quiz QCM', quizDesc: 'ولّد أسئلة من الدرس ديالك.',
    orientTitle: 'التوجيه', orientDesc: 'لقى الفيليار المناسبة ليك.',
    flashTitle: 'Flashcards', flashDesc: 'حفظ ببطاقات سؤال/جواب.',
    examTitle: 'Mode Examen', examDesc: 'امتحان تجريبي مع timer ونتيجة.',
    loginTitle: 'دخول', loginSub: 'مرحبا! دخل للحساب ديالك.',
    emailLabel: 'الإيميل', passLabel: 'كلمة السر', nameLabel: 'الاسم الكامل',
    loginBtn: 'دخول', registerBtn: 'سجل',
    noAccount: 'ما عندكش حساب؟', hasAccount: 'عندك حساب؟',
    registerTitle: 'إنشاء حساب', registerSub: 'انضم لينا!',
    chatWelcome: 'السلام! أنا المساعد الذكي ديالك\nسول أسئلتك على الدروس ولا التوجيه.',
    chatPlaceholder: 'سول سؤالك...',
    quickQ1: 'كيفاش نراجع بشكل مزيان؟',
    quickQ2: 'شرح ليا معادلات الدرجة الثانية',
    quickQ3: 'شنو هي الفيليارات بعد الباك؟',
    quickQ4: 'عاونني نصنع plan ديال المراجعة',
    summaryPageTitle: 'ملخص الدرس', summaryPageSub: 'نص ولا PDF ولا صورة ← ملخص منظم',
    summaryPlaceholder: 'لصق الدرس ديالك هنا...', summaryBtn: 'ولّد الملخص',
    uploadClick: 'كليك', uploadDrag: 'ولا جر PDF ولا صورة هنا',
    quizPageTitle: 'Quiz ديال المراجعة', quizPageSub: 'ولّد أسئلة QCM من الدرس ديالك',
    quizCoursePlaceholder: 'لصق الدرس (اختياري)...',
    quizSubjectPlaceholder: 'ولا دخل المادة (مثال: Maths، Histoire...)',
    quizBtn: 'ولّد Quiz', quizNext: 'التالي', quizFinish: 'شوف النتيجة ديالي',
    quizRestart: 'ابدا من جديد', quizScore: 'النتيجة ديالك',
    orientPageTitle: 'التوجيه المدرسي', orientPageSub: 'وصف البروفيل ديالك',
    orientPlaceholder: 'مثال: 16 فالرياضيات، كانعشق l\'informatique...', orientBtn: 'احصل على توصيات',
    flashSub: 'ولّد بطاقات سؤال/جواب من الدرس ديالك',
    flashPlaceholder: 'لصق الدرس ديالك هنا...', flashBtn: 'ولّد Flashcards',
    flashClickHint: 'كليك باش تشوف الجواب',
    prev: 'السابق', next: 'التالي', flip: 'قلب', newDeck: 'Deck جديد',
    examSub: 'تدرب بامتحان حقيقي مع توقيت',
    examSubject: 'المادة', examNumQ: 'عدد الأسئلة', examDuration: 'المدة',
    startExam: 'بدا الامتحان', submitExam: 'خلص',
    examAnswered: 'جاوبت عليهم', newExam: 'امتحان جديد',
    examExcellent: 'ممتاز!', examGood: 'برافو!', examKeepGoing: 'كمّل المجهود!',
    statTotal: 'مجموع الجلسات', statChats: 'محادثات', statSummaries: 'ملخصات', statQuizzes: 'Quiz',
    recentActivity: 'النشاط الأخير', progressTitle: 'التقدم ديالي',
    profileTitle: 'البروفيل ديالي',
    guestBannerMsg: 'دخل للحساب ديالك باش تحفظ الشغل ديالك وتوصل للتاريخ ديالك.',
    guestBannerDismiss: 'سكّت',
  },

  // ── English ──────────────────────────────────────────────────────────────────
  en: {
    home: 'Home', dashboard: 'My Space', login: 'Login', register: 'Sign Up', logout: 'Logout',
    badge: 'AI Assistant for Moroccan Students',
    heroTitle: 'Your', heroTitleBold: 'Smart Assistant',
    heroDesc: 'Summaries, quizzes, flashcards, mock exams — all in one place.',
    startBtn: 'Get Started',
    feat1Title: 'AI Chat', feat1Desc: 'Ask your questions and get educational answers.',
    feat2Title: 'Summary + PDF', feat2Desc: 'Import a PDF or image and receive a summary.',
    feat3Title: 'MCQ Quiz', feat3Desc: 'Generate questions from your course.',
    feat4Title: 'Orientation', feat4Desc: 'Find your ideal academic path.',
    feat5Title: 'Flashcards', feat5Desc: 'Memorize with interactive cards.',
    feat6Title: 'Exam Mode', feat6Desc: 'Practice with a timer and a final report.',
    welcomeBack: 'Welcome back,', chooseFeature: 'What do you want to do today?',
    chatTitle: 'AI Assistant', chatDesc: 'Ask all your questions.',
    summaryTitle: 'Summary + PDF', summaryDesc: 'Summarize a course or import a file.',
    quizTitle: 'MCQ Quiz', quizDesc: 'Generate questions from your course.',
    orientTitle: 'Orientation', orientDesc: 'Find your ideal academic path.',
    flashTitle: 'Flashcards', flashDesc: 'Memorize with Q&A cards.',
    examTitle: 'Exam Mode', examDesc: 'Mock exam with timer and score.',
    loginTitle: 'Login', loginSub: 'Welcome! Please sign in.',
    emailLabel: 'Email', passLabel: 'Password', nameLabel: 'Full Name',
    loginBtn: 'Sign In', registerBtn: 'Sign Up',
    noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
    registerTitle: 'Create an Account', registerSub: 'Join the adventure!',
    chatWelcome: 'Hello! I am your AI assistant\nAsk me anything about your courses or academic path.',
    chatPlaceholder: 'Ask your question...',
    quickQ1: 'How to study effectively?',
    quickQ2: 'Explain quadratic equations',
    quickQ3: 'What majors are available after high school?',
    quickQ4: 'Help me build a study plan',
    summaryPageTitle: 'Course Summary', summaryPageSub: 'Text, PDF or image → structured summary',
    summaryPlaceholder: 'Paste your course here...', summaryBtn: 'Generate Summary',
    uploadClick: 'Click', uploadDrag: 'or drag a PDF / image here',
    quizPageTitle: 'Revision Quiz', quizPageSub: 'Generate MCQs from your course',
    quizCoursePlaceholder: 'Paste your course (optional)...',
    quizSubjectPlaceholder: 'Or enter a subject (e.g. Maths, History...)',
    quizBtn: 'Generate Quiz', quizNext: 'Next', quizFinish: 'See My Score',
    quizRestart: 'Restart', quizScore: 'Your Score',
    orientPageTitle: 'Academic Orientation', orientPageSub: 'Describe your profile',
    orientPlaceholder: 'E.g. 16/20 in maths, I love computer science...', orientBtn: 'Get Recommendations',
    flashSub: 'Generate Q&A cards from your course',
    flashPlaceholder: 'Paste your course here...', flashBtn: 'Generate Flashcards',
    flashClickHint: 'Click to reveal the answer',
    prev: 'Previous', next: 'Next', flip: 'Flip', newDeck: 'New Deck',
    examSub: 'Practice with a real timed exam',
    examSubject: 'Subject', examNumQ: 'Number of Questions', examDuration: 'Duration',
    startExam: 'Start Exam', submitExam: 'Finish',
    examAnswered: 'answered', newExam: 'New Exam',
    examExcellent: 'Excellent!', examGood: 'Well done!', examKeepGoing: 'Keep it up!',
    statTotal: 'Total Sessions', statChats: 'Chats', statSummaries: 'Summaries', statQuizzes: 'Quizzes',
    recentActivity: 'Recent Activity', progressTitle: 'My Progress',
    profileTitle: 'My Profile',
    guestBannerMsg: 'Log in to save your work and access your history.',
    guestBannerDismiss: 'Dismiss',
  },
}

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'educompass_lang'

/** Read persisted lang, auto-detecting browser language on first visit. */
function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (VALID_LANGS.includes(stored)) return stored

    // First visit — detect from browser
    const browserLang = navigator.language || navigator.userLanguage || 'fr'
    const code = browserLang.toLowerCase().split('-')[0]
    if (code === 'ar') return 'ar'
    if (code === 'en') return 'en'
    // Default to French for Moroccan context (fr, fr-MA, etc.)
    return 'fr'
  } catch {
    return 'fr'
  }
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  /** Validate and persist the new language selection. */
  function setLang(newLang) {
    if (!VALID_LANGS.includes(newLang)) {
      console.warn(`[LangContext] Unsupported language "${newLang}". Must be one of: ${VALID_LANGS.join(', ')}.`)
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // localStorage unavailable (e.g. private browsing) — continue without persisting
    }
    setLangState(newLang)
  }

  // Task 4.2: Darija is also RTL
  const isRTL = lang === 'ar' || lang === 'darija'

  return (
    <LangContext.Provider value={{ lang, setLang, t: t[lang], isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : ''}>
        {children}
      </div>
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
