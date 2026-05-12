import React from 'react';
import { Helmet } from 'react-helmet';
import ProcessSchematics from '@/components/public/ProcessSchematics';

const ProcessPage = () => (
  <>
    <Helmet><title>Werkwijze — Process Schematics</title><meta name="description" content="De schematische werkwijze van Vos Web Designs van survey tot handover." /></Helmet>
    <main className="pt-16"><ProcessSchematics /><section className="px-5 pb-24 md:px-10 lg:pl-28"><div className="mx-auto max-w-[1500px] diagonal-note">Elke stap eindigt met een tastbare artifact: sitemap, wire-spread, staging build of launch checklist. Zo blijft voortgang zichtbaar en meetbaar.</div></section></main>
  </>
);
export default ProcessPage;
