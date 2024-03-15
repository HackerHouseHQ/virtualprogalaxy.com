import Head from 'next/head'
import axios from 'axios'
import { PublicLayout } from '@/layouts/PublicLayout'
// import mailer from '@/lib/nodemailer'
import {
  Hero,
  Services,
  Features,
  Worlds,
  About,
  ContactSectionWithForm,
} from '@/page-components/Index'
import type { ContactFormData } from '@/components/ContactForm'
// import logger from '@/utils/logger'

async function handleContactSubmit(values: ContactFormData) {
  console.info('submitting contact form', values)
  const r = await axios.post('/api/contacts', values)
  console.info('result', r)
  return r.statusText === 'OK'
}


const Home: React.FC = () => {

  return (
    <>
      <Head>
        <title>Virtual Pro Galaxy</title>
        <meta name="description" content="Virtual Pro Galaxy" />
      </Head>
      <PublicLayout>
        {/* <Hero onPrimaryClick={() => setDemoDialogOpen((p) => !p)} /> */}
        <Hero />
        <Features />
        <Worlds />
        <About />
        <Services />
        <ContactSectionWithForm onSubmit={handleContactSubmit} />
      </PublicLayout>
    </>
  )
}
export default Home
