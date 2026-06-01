import React from 'react';

const AboutPage = () => {
  return (
    <main style={{ minHeight: '100vh', background: '#050b14', color: '#ffffff', padding: '120px 20px 80px' }}>
      <section style={{ maxWidth: 1120, margin: '0 auto' }}>
        <p style={{ color: '#d6f57a', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 13 }}>
          Over Vos Web Designs
        </p>

        <h1 style={{ marginTop: 24, fontSize: 'clamp(44px, 11vw, 118px)', lineHeight: 0.88, letterSpacing: '-0.08em', fontWeight: 950 }}>
          Eén specialist. Volledige focus. Geen template-smaak.
        </h1>

        <div style={{ display: 'grid', gap: 24, marginTop: 42 }}>
          <article style={{ border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.045)', borderRadius: 28, padding: 28 }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px, 7vw, 56px)', lineHeight: 1, letterSpacing: '-0.06em', fontWeight: 950 }}>
              Websites gebouwd met aandacht, strategie en techniek.
            </h2>
            <p style={{ marginTop: 20, color: '#cbd5e1', lineHeight: 1.8, fontSize: 17 }}>
              Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle, professionele websites die vertrouwen wekken en niet voelen als een standaard template.
            </p>
            <p style={{ marginTop: 14, color: '#cbd5e1', lineHeight: 1.8, fontSize: 17 }}>
              Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw. Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf.
            </p>
          </article>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              ['Geen standaard template-flow', 'Elke site krijgt een eigen richting en visuele stijl.'],
              ['Snel en mobielvriendelijk', 'Gebouwd voor bezoekers die snel willen begrijpen wat je doet.'],
              ['Persoonlijk contact', 'Korte lijnen en duidelijke communicatie zonder ruis.'],
              ['Doorontwikkelbaar', 'Techniek die later uitgebreid kan worden.'],
            ].map(([title, text]) => (
              <article key={title} style={{ border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.035)', borderRadius: 24, padding: 22 }}>
                <h3 style={{ margin: 0, color: '#8cd6ff', fontSize: 20, fontWeight: 900 }}>{title}</h3>
                <p style={{ marginTop: 10, color: '#94a3b8', lineHeight: 1.7 }}>{text}</p>
              </article>
            ))}
          </div>

          <article style={{ border: '1px solid rgba(214,245,122,.25)', background: 'rgba(214,245,122,.08)', borderRadius: 28, padding: 28, textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 8vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.07em', fontWeight: 950 }}>
              Kennismaken?
            </h2>
            <p style={{ margin: '18px auto 0', maxWidth: 620, color: '#cbd5e1', lineHeight: 1.8 }}>
              Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
            </p>
            <a href="/contact" style={{ display: 'inline-flex', marginTop: 24, borderRadius: 999, background: '#d6f57a', color: '#06101c', padding: '14px 22px', fontWeight: 950, textDecoration: 'none' }}>
              Contact opnemen
            </a>
          </article>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
