// context/LangContext.jsx — Gestion de la langue FR/AR
// Permet à tous les composants d'accéder à la langue courante
// et aux traductions sans passer les props manuellement

import { createContext, useContext, useState } from 'react'

const translations = {
  fr: {
    // Navbar
    home: 'Accueil',
    dashboard: 'Mon espace',
    login: 'Connexion',
    register: "S'inscrire",
    logout: 'Déconnexion',
    // Home
    badge: 'Assistant IA pour étudiants marocains',
    heroTitle: 'Ton assistant',
    heroTitleBold: 'intelligent',
    heroDesc: 'Résumés de cours, quiz de révision, orientation scolaire — tout en un, en français ou en arabe.',
    startBtn: 'Commencer maintenant',
    // Features
    feat1Title: 'Chat IA',
    feat1Desc: 'Pose tes questions, obtiens des réponses claires et pédagogiques.',
    feat2Title: 'Résumé de cours',
    feat2Desc: 'Colle ton cours, reçois un résumé structuré en secondes.',
    feat3Title: 'Quiz de révision',
    feat3Desc: 'Génère des QCM automatiquement à partir de ton cours.',
    feat4Title: 'Orientation',
    feat4Desc: 'Trouve la filière idéale selon tes notes et tes intérêts.',
    // Dashboard
    welcomeBack: 'Bon retour,',
    chooseFeature: 'Que veux-tu faire aujourd\'hui ?',
    chatTitle: 'Assistant IA',
    chatDesc: 'Pose toutes tes questions sur tes cours.',
    summaryTitle: 'Résumé de cours',
    summaryDesc: 'Résume n\'importe quel texte en quelques secondes.',
    quizTitle: 'Quiz de révision',
    quizDesc: 'Génère des questions depuis ton cours.',
    orientTitle: 'Orientation',
    orientDesc: 'Trouve ta filière idéale.',
    // Auth
    loginTitle: 'Connexion',
    loginSub: 'Bienvenue ! Connecte-toi pour continuer.',
    emailLabel: 'Adresse email',
    passLabel: 'Mot de passe',
    nameLabel: 'Nom complet',
    loginBtn: 'Se connecter',
    registerBtn: "S'inscrire",
    noAccount: 'Pas de compte ?',
    hasAccount: 'Déjà un compte ?',
    registerTitle: 'Créer un compte',
    registerSub: 'Rejoins des milliers d\'étudiants marocains.',
    // Chat
    chatWelcome: 'Salam ! Je suis ton assistant IA 🎓\nPose-moi tes questions sur tes cours, tes révisions, ou ton orientation.',
    chatPlaceholder: 'Pose ta question...',
    quickQ1: 'Comment réviser efficacement ?',
    quickQ2: 'Explique-moi les équations du second degré',
    quickQ3: 'Quelles filières après le Bac scientifique ?',
    quickQ4: 'Aide-moi à faire un plan de révision',
    // Summary
    summaryPageTitle: 'Résumé de cours',
    summaryPageSub: 'Colle ton cours et reçois un résumé structuré',
    summaryPlaceholder: 'Colle ton cours ici...',
    summaryBtn: 'Générer le résumé',
    // Quiz
    quizPageTitle: 'Quiz de révision',
    quizPageSub: 'Génère des questions depuis ton cours ou une matière',
    quizCoursePlaceholder: 'Colle ton cours ici (optionnel)...',
    quizSubjectPlaceholder: 'Ou entre une matière (ex: Mathématiques, Histoire...)',
    quizBtn: 'Générer le quiz',
    quizNext: 'Question suivante',
    quizFinish: 'Voir mon score',
    quizRestart: 'Recommencer',
    quizScore: 'Ton score',
    // Orientation
    orientPageTitle: 'Orientation scolaire',
    orientPageSub: 'Décris tes notes, tes matières préférées et tes ambitions',
    orientPlaceholder: 'Ex: J\'ai 16/20 en maths, 14 en physique, j\'aime l\'informatique...',
    orientBtn: 'Obtenir des recommandations',
  },
  ar: {
    home: 'الرئيسية',
    dashboard: 'فضائي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'خروج',
    badge: 'مساعد ذكي للطلاب المغاربة',
    heroTitle: 'مساعدك',
    heroTitleBold: 'الذكي',
    heroDesc: 'ملخصات الدروس، اختبارات المراجعة، التوجيه المدرسي — كل شيء في مكان واحد.',
    startBtn: 'ابدأ الآن',
    feat1Title: 'المحادثة مع الذكاء الاصطناعي',
    feat1Desc: 'اطرح أسئلتك واحصل على إجابات واضحة وتعليمية.',
    feat2Title: 'ملخص الدرس',
    feat2Desc: 'الصق درسك واحصل على ملخص منظم في ثوانٍ.',
    feat3Title: 'اختبار المراجعة',
    feat3Desc: 'أنشئ أسئلة اختيار من متعدد تلقائياً من درسك.',
    feat4Title: 'التوجيه المدرسي',
    feat4Desc: 'اعثر على المسار المثالي حسب درجاتك واهتماماتك.',
    welcomeBack: 'مرحباً بعودتك،',
    chooseFeature: 'ماذا تريد أن تفعل اليوم؟',
    chatTitle: 'المساعد الذكي',
    chatDesc: 'اطرح جميع أسئلتك حول دروسك.',
    summaryTitle: 'ملخص الدرس',
    summaryDesc: 'لخص أي نص في ثوانٍ معدودة.',
    quizTitle: 'اختبار المراجعة',
    quizDesc: 'أنشئ أسئلة من درسك.',
    orientTitle: 'التوجيه المدرسي',
    orientDesc: 'اعثر على مسارك المثالي.',
    loginTitle: 'تسجيل الدخول',
    loginSub: 'مرحباً! سجل دخولك للمتابعة.',
    emailLabel: 'البريد الإلكتروني',
    passLabel: 'كلمة المرور',
    nameLabel: 'الاسم الكامل',
    loginBtn: 'تسجيل الدخول',
    registerBtn: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    registerTitle: 'إنشاء حساب',
    registerSub: 'انضم إلى آلاف الطلاب المغاربة.',
    chatWelcome: 'السلام عليكم! أنا مساعدك الذكي 🎓\nاطرح عليّ أسئلتك حول دروسك أو مراجعتك أو توجيهك المدرسي.',
    chatPlaceholder: 'اطرح سؤالك...',
    quickQ1: 'كيف أراجع بفعالية؟',
    quickQ2: 'اشرح لي معادلات الدرجة الثانية',
    quickQ3: 'ما هي المسارات بعد الباكالوريا العلمية؟',
    quickQ4: 'ساعدني في وضع خطة مراجعة',
    summaryPageTitle: 'ملخص الدرس',
    summaryPageSub: 'الصق درسك واحصل على ملخص منظم',
    summaryPlaceholder: 'الصق درسك هنا...',
    summaryBtn: 'إنشاء الملخص',
    quizPageTitle: 'اختبار المراجعة',
    quizPageSub: 'أنشئ أسئلة من درسك أو مادة دراسية',
    quizCoursePlaceholder: 'الصق درسك هنا (اختياري)...',
    quizSubjectPlaceholder: 'أو أدخل مادة دراسية (مثال: رياضيات، تاريخ...)',
    quizBtn: 'إنشاء الاختبار',
    quizNext: 'السؤال التالي',
    quizFinish: 'عرض نتيجتي',
    quizRestart: 'البدء من جديد',
    quizScore: 'نتيجتك',
    orientPageTitle: 'التوجيه المدرسي',
    orientPageSub: 'صف درجاتك ومواضيعك المفضلة وطموحاتك',
    orientPlaceholder: 'مثال: درجتي في الرياضيات 16، أحب الإعلاميات...',
    orientBtn: 'الحصول على توصيات',
  }
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('fr')
  const t = translations[lang]
  const isRTL = lang === 'ar'

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
