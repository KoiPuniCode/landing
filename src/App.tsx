import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css'
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { t, i18n } = useTranslation();
  const [animateMirror, setAnimateMirror] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState<'success' | 'error' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const changeState = () => {
    setAnimateMirror(true)
    setTimeout(() => {
      setAnimateMirror(false); // Update state after 5 seconds
    }, 2000); // 4000 milliseconds = 4 seconds
  };

  // Add language toggle function
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  // Add this useEffect to check localStorage on component mount
  useEffect(() => {
    const submitted = localStorage.getItem('formSubmitted');
    if (submitted) {
      setHasSubmitted(true);
    }
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading
    try {
      const response = await fetch('https://koipunicode.com/api/submit-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatusKind('success');
        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        setStatus(t('contact.submitSuccess'));
        setFormData({ name: '', email: '', message: '' });
        // Set localStorage and state to prevent further submissions
        localStorage.setItem('formSubmitted', 'true');
        setHasSubmitted(true);
      } else {
        setStatusKind('error');
        setStatus(data.error || t('contact.submitFailed'));
      }
    } catch (error) {
      setStatusKind('error');
      setStatus(t('contact.submitError'));
    } finally {
      setIsSubmitting(false); // End loading regardless of outcome
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    changeState()
  }, [])


  return (
    <ErrorBoundary>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://koipunicode.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.title')} />
        <meta name="twitter:description" content={t('meta.description')} />
        <meta name="twitter:image" content="/logo.png" />
        
        {/* Keywords and additional meta */}
        <meta name="keywords" content="web desarrollo, desarrollo de software, sistemas web, React, NextJS, Argentina, Cipolletti, Río Negro, desarrollo full-stack" />
        <meta name="author" content="KoiPuni Code" />
        <link rel="canonical" href="https://koipunicode.com" />
        
        {/* Social links */}
        <link rel="me" href="https://github.com/KoiPuniCode" />
        <link rel="me" href="https://www.linkedin.com/company/koipunicode" />
      </Helmet>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
        <div className="min-h-screen overflow-x-hidden">
          <div className="tech-bg">
            <div className="relative pt-6 px-6 z-10 flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center">
                <img src="./logo.png" alt="logo circle with s inside" className="w-12 h-12 mx-2" />
                <div className="flex flex-col justify-center">
                  <div className="text-16 font-bold">KoiPuni Code</div>
                  <div className="text-14 max-w-40 text-muted-foreground">{t('header.slogan')}</div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-14 font-semibold text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {i18n.language === 'en' ? 'ES' : 'EN'}
                </button>
              </div>
            </div>

            <div className="px-6 pt-12 max-w-3xl mx-auto flex flex-col justify-start relative z-10">
              <h1
                className="break-normal text-32 text-center font-bold leading-tight mb-4"
                onMouseEnter={changeState}
              >
                {t('hero.we')}{' '}
                <span
                  className={`${animateMirror ? 'animate-mirror' : ''} text-primary transition-all inline-block`}
                >
                  {t('hero.build')}
                </span>{' '}
                <span
                  className={`${animateMirror ? 'animate-mirror' : ''} text-secondary transition-all inline-block`}
                >
                  {t('hero.cool')}
                </span>{' '}
                <span
                  className={`${animateMirror ? 'animate-mirror' : ''} text-primary transition-all inline-block`}
                >
                  {t('hero.webApps')}
                </span>
              </h1>
              <p className="text-center max-w-2xl mx-auto text-16 text-muted-foreground">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center my-12">
                <a
                  href="#contact"
                  className="w-fit inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-16 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm hover:shadow transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t('hero.getInTouch')}
                </a>
                <a
                  href="https://wa.me/5492984400833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-16 font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img src="./whatsapp-icon.png" alt="WhatsApp" className="w-6 h-6" />
                  {t('contact.whatsapp')}
                </a>
              </div>
            </div>
          </div>

          <div className="py-24 px-6 bg-muted/40">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-24 font-bold mb-16 text-center text-foreground">
                {t('projects.productionSystemsTitle')}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Polaris (live in production) */}
                <a
                  href="https://www.polarisneuquen.com.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                    <img
                      src="/prod-showcase/polaris/polaris-hero.png"
                      alt={t('projects.polaris.altHero')}
                      className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </div>
                  <h3 className="text-20 font-bold mb-3 text-foreground">{t('projects.polaris.title')}</h3>
                  <p className="text-16 text-muted-foreground mb-4">
                    {t('projects.polaris.description')}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <img
                      src="/prod-showcase/polaris/polaris-feature.png"
                      alt={t('projects.polaris.altFeature')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                    <img
                      src="/prod-showcase/polaris/polaris-about-contact.png"
                      alt={t('projects.polaris.altAboutContact')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                    <img
                      src="/prod-showcase/polaris/polaris-hero.png"
                      alt={t('projects.polaris.altHero2')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-12 font-semibold">
                      {t('projects.polaris.chip1')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-12 font-semibold">
                      {t('projects.polaris.chip2')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-12 font-semibold">
                      {t('projects.polaris.chip3')}
                    </span>
                  </div>
                </a>

                {/* Balgu Cocina (live in production) */}
                <a
                  href="https://balgucocina.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                    <img
                      src="/prod-showcase/balgu/balgu-hero.png"
                      alt={t('projects.balgu.altHero')}
                      className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
                  </div>
                  <h3 className="text-20 font-bold mb-3 text-foreground">{t('projects.balgu.title')}</h3>
                  <p className="text-16 text-muted-foreground mb-4">
                    {t('projects.balgu.description')}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <img
                      src="/prod-showcase/balgu/balgu-menu.png"
                      alt={t('projects.balgu.altMenu')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                    <img
                      src="/prod-showcase/balgu/balgu-contact-map.png"
                      alt={t('projects.balgu.altDeliveryMap')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                    <img
                      src="/prod-showcase/balgu/balgu-hero.png"
                      alt={t('projects.balgu.altHero2')}
                      className="w-full h-24 object-cover rounded-md border border-border/60"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-12 font-semibold">
                      {t('projects.balgu.chip1')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-12 font-semibold">
                      {t('projects.balgu.chip2')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-12 font-semibold">
                      {t('projects.balgu.chip3')}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="py-24 px-6 bg-background">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-24 font-bold mb-16 text-center text-foreground">{t('services.title')}</h2>

              <div className="grid md:grid-cols-3 gap-12">
                {/* Design Service */}
                <div className="bg-card border border-border rounded-xl p-8 transition-shadow hover:shadow-sm">
                  <img className="w-40 object-contain h-40 mx-auto mb-6" src="./14206603_5421912.svg" alt="Web Design" />
                  <h3 className="font-bold text-20 mb-4 text-primary">{t('services.design.title')}</h3>
                  <p className="text-16 text-muted-foreground">{t('services.design.description')}</p>
                </div>

                {/* Server Service */}
                <div className="bg-card border border-border rounded-xl p-8 transition-shadow hover:shadow-sm">
                  <img className="w-40 object-contain h-40 mx-auto mb-6" src="./server-concept-illustration.png" alt="Server Solutions" />
                  <h3 className="font-bold text-20 mb-4 text-secondary">{t('services.server.title')}</h3>
                  <p className="text-16 text-muted-foreground">{t('services.server.description')}</p>
                </div>

                {/* SEO Service */}
                <div className="bg-card border border-border rounded-xl p-8 transition-shadow hover:shadow-sm">
                  <img className="w-40 object-contain h-40 mx-auto mb-6" src="./4140191_2171152.jpg" alt="SEO Optimization" />
                  <h3 className="font-bold text-20 mb-4 text-success">{t('services.seo.title')}</h3>
                  <p className="text-16 text-muted-foreground">{t('services.seo.description')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div id="contact" className="tech-bg py-24 relative">
            <div className="max-w-3xl mx-auto px-6">
              <div className="relative z-10">
                <h2 className="text-24 font-bold mb-12 text-center">{t('contact.title')}</h2>

                {hasSubmitted ? (
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-8 shadow-sm text-center">
                    <h3 className="text-20 font-bold text-success mb-4">{t('contact.thankYou')}</h3>
                    <p className="text-16 text-muted-foreground mb-6">{t('contact.alreadySubmitted')}</p>
                    <a
                      href="https://wa.me/5492984400833"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <img src="./whatsapp-icon.png" alt="WhatsApp" className="w-5 h-5" />
                      {t('contact.reachWhatsapp')}
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-8 shadow-sm"
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-14 text-muted-foreground mb-2" htmlFor="name">
                          {t('contact.name')}
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-border bg-card text-16 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-14 text-muted-foreground mb-2" htmlFor="email">
                          {t('contact.email')}
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-border bg-card text-16 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-14 text-muted-foreground mb-2" htmlFor="message">
                        {t('contact.message')}
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-16 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('contact.submitting')}
                        </span>
                      ) : (
                        t('contact.submit')
                      )}
                    </button>
                    {status && (
                      <div className="mt-4 text-center font-medium">
                        <p
                          className={`text-14 ${statusKind === 'success' ? 'text-success' : 'text-danger'}`}
                        >
                          {status}
                        </p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="tech-bg mt-44 py-24 relative">
            <div className="max-w-6xl mx-auto px-6">
              <div className="relative z-10">
                <h2 className="text-24 font-bold mb-12 text-foreground">{t('about.title')}</h2>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-16 text-muted-foreground leading-relaxed">{t('about.description1')}</p>
                    <p className="text-16 text-muted-foreground leading-relaxed">{t('about.description2')}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm">
                      <h3 className="text-20 font-semibold mb-4 text-primary">{t('about.values.title')}</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-primary/40 mr-3"></span>
                          <span className="text-16 text-muted-foreground">{t('about.values.innovation')}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-secondary/40 mr-3"></span>
                          <span className="text-16 text-muted-foreground">{t('about.values.quality')}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-success/40 mr-3"></span>
                          <span className="text-16 text-muted-foreground">{t('about.values.userCentric')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col pt-6 pb-6 px-6 md:px-24 gap-8 md:gap-4 border-t border-border">
            <div className="flex flex-col items-center md:flex-row md:justify-between gap-8">
              <div className="flex flex-col items-center md:items-start gap-8 md:flex-row">
                <div className="flex">
                  <img src="./logo.png" alt="logo circle with s inside" className='w-12 h-12 self-center mx-2' />
                  <div className='flex flex-col justify-center'>
                    <div className='text-14 font-semibold'>KoiPuni Code</div>
                    <div className="text-12 text-primary font-semibold">{t('footer.global')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center md:text-left">
                  <address className="text-14 text-muted-foreground not-italic">
                    <div className="font-semibold mb-1">{t('footer.legal')}</div>
                    1209 Mountain Road PL NE STE R<br />
                    Albuquerque, NM
                  </address>
                  <address className="text-14 text-muted-foreground not-italic">
                    <div className="font-semibold mb-1">{t('footer.operations')}</div>
                    Cipolletti<br />
                    Río Negro, Argentina
                  </address>
                </div>
              </div>
            </div>
            <div className='text-center md:text-right text-14 text-muted-foreground/70'>{t('footer.rights')}</div>
          </div>
        </div>
        </>
      )}
    </ErrorBoundary>
  )
}

export default App
