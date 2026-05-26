import fs from 'fs/promises'
import path from 'path'

import { FRONTEND_SRC_ROOT } from './env.mjs'

export const CORE_PAGE_SLUGS = new Set([
  'home',
  'about',
  'services',
  'contact',
  'privacy-policy',
  't-c',
  'thank-you',
])

export const MEDIA_LIBRARY = {
  logo: {
    seedKey: 'logo',
    sourceRelativePath: 'images/uploads/interesting-sports-black-.png',
    publicPath: '/images/uploads/interesting-sports-black-.png',
    uploadFileName: 'interesting-america-logo.png',
    alt: 'Interesting America logo',
  },
  favicon: {
    seedKey: 'favicon',
    sourceRelativePath: 'images/uploads/favicon-512.png',
    publicPath: '/images/uploads/favicon-512.png',
    uploadFileName: 'interesting-america-favicon-512.png',
    alt: 'Interesting America favicon',
  },
  heroAtlanta: {
    seedKey: 'heroAtlanta',
    sourceRelativePath: 'images/uploads/hero-atl-marriott-marquis.jpg',
    publicPath: '/images/uploads/hero-atl-marriott-marquis.jpg',
    uploadFileName: 'hero-atl-marriott-marquis.jpg',
    alt: 'Atlanta Marriott Marquis hotel exterior',
  },
  heroStRegis: {
    seedKey: 'heroStRegis',
    sourceRelativePath: 'images/uploads/hero-st-regis-san-francisco.jpg',
    publicPath: '/images/uploads/hero-st-regis-san-francisco.jpg',
    uploadFileName: 'hero-st-regis-san-francisco.jpg',
    alt: 'The St. Regis hotel in San Francisco',
  },
  heroLosAngeles: {
    seedKey: 'heroLosAngeles',
    sourceRelativePath: 'images/uploads/hero-los-angeles-ca.jpg',
    publicPath: '/images/uploads/hero-los-angeles-ca.jpg',
    uploadFileName: 'hero-los-angeles-ca.jpg',
    alt: 'Los Angeles city scene',
  },
  heroDallas: {
    seedKey: 'heroDallas',
    sourceRelativePath: 'images/uploads/hero-dallas-tx.jpg',
    publicPath: '/images/uploads/hero-dallas-tx.jpg',
    uploadFileName: 'hero-dallas-tx.jpg',
    alt: 'Dallas skyline',
  },
  heroSantaMonica: {
    seedKey: 'heroSantaMonica',
    sourceRelativePath: 'images/uploads/hero-santa-monica-ca.jpg',
    publicPath: '/images/uploads/hero-santa-monica-ca.jpg',
    uploadFileName: 'hero-santa-monica-ca.jpg',
    alt: 'Santa Monica coastal scene',
  },
  heroMaracana: {
    seedKey: 'heroMaracana',
    sourceRelativePath: 'images/uploads/hero-maracana-2014.jpg',
    publicPath: '/images/uploads/hero-maracana-2014.jpg',
    uploadFileName: 'hero-maracana-2014.jpg',
    alt: 'Maracana Stadium in Rio de Janeiro',
  },
  heroColony: {
    seedKey: 'heroColony',
    sourceRelativePath: 'images/uploads/hero-colony-hotel-mia.jpg',
    publicPath: '/images/uploads/hero-colony-hotel-mia.jpg',
    uploadFileName: 'hero-colony-hotel-mia.jpg',
    alt: 'The Colony Hotel in Miami Beach',
  },
  heroSofi: {
    seedKey: 'heroSofi',
    sourceRelativePath: 'images/uploads/hero-sofi-2025.jpg',
    publicPath: '/images/uploads/hero-sofi-2025.jpg',
    uploadFileName: 'hero-sofi-2025.jpg',
    alt: 'Inglewood Olympic venue rendering',
  },
  heroParis: {
    seedKey: 'heroParis',
    sourceRelativePath: 'images/uploads/hero-paris-stadium.jpg',
    publicPath: '/images/uploads/hero-paris-stadium.jpg',
    uploadFileName: 'hero-paris-stadium.jpg',
    alt: 'Stade de France in Paris',
  },
  heroSouthAfrica: {
    seedKey: 'heroSouthAfrica',
    sourceRelativePath: 'images/uploads/hero-southafrica.jpeg',
    publicPath: '/images/uploads/hero-southafrica.jpeg',
    uploadFileName: 'hero-southafrica.jpeg',
    alt: 'Soccer City Stadium in Johannesburg',
  },
  serviceAccommodation: {
    seedKey: 'serviceAccommodation',
    sourceRelativePath: 'images/uploads/services-accommodation.jpg',
    publicPath: '/images/uploads/services-accommodation.jpg',
    uploadFileName: 'services-accommodation.jpg',
    alt: 'Accommodation setting for event stays',
  },
  serviceTransportation: {
    seedKey: 'serviceTransportation',
    sourceRelativePath: 'images/uploads/services-transportation.jpg',
    publicPath: '/images/uploads/services-transportation.jpg',
    uploadFileName: 'services-transportation.jpg',
    alt: 'Transportation service for event arrivals and departures',
  },
  serviceHospitality: {
    seedKey: 'serviceHospitality',
    sourceRelativePath: 'images/uploads/services-hospitality.jpg',
    publicPath: '/images/uploads/services-hospitality.jpg',
    uploadFileName: 'services-hospitality.jpg',
    alt: 'Hospitality setting for premium guest programs',
  },
  projectBrazil: {
    seedKey: 'projectBrazil',
    sourceRelativePath: 'images/uploads/brazil 2014.jpg',
    publicPath: '/images/uploads/brazil 2014.jpg',
    uploadFileName: 'project-brazil-2014.jpg',
    alt: 'Brazil 2014 World Cup host city setting',
  },
  projectTokyo: {
    seedKey: 'projectTokyo',
    sourceRelativePath: 'images/uploads/tokyo 2020+1.jpg',
    publicPath: '/images/uploads/tokyo 2020+1.jpg',
    uploadFileName: 'project-tokyo-2020-plus-1.jpg',
    alt: 'Tokyo Olympic accommodation setting',
  },
  projectCortina: {
    seedKey: 'projectCortina',
    sourceRelativePath: 'images/uploads/cortina 2026.jpg',
    publicPath: '/images/uploads/cortina 2026.jpg',
    uploadFileName: 'project-cortina-2026.jpg',
    alt: 'Milano Cortina mountain hospitality setting',
  },
}

function mediaRef(seedKey) {
  return { seedKey }
}

function link(label, url, openInNewTab = false) {
  return { label, url, openInNewTab }
}

function paragraphs(items) {
  return items.map((item) => `<p>${item}</p>`).join('\n')
}

async function readLegalFile(filename) {
  const filePath = path.join(FRONTEND_SRC_ROOT, '_includes', 'modules', filename)
  return fs.readFile(filePath, 'utf8')
}

export async function getSeedBlueprint() {
  const [privacyHtml, termsHtml] = await Promise.all([
    readLegalFile('legal-privacy-flow.njk'),
    readLegalFile('legal-terms-flow.njk'),
  ])

  return {
    mediaLibrary: MEDIA_LIBRARY,
    globals: {
      header: {
        brandName: 'INTERESTING AMERICA',
        brandAriaLabel: 'INTERESTING AMERICA - Back to Home',
        logo: mediaRef('logo'),
        navItems: [
          link('About', '/about/'),
          link('Services', '/services/'),
          link('Contact', '/contact/'),
        ],
      },
      footer: {
        newsletterPrompt: 'Sign up now and stay updated about accommodation, transfers, and hospitality at the major global sports events:',
        newsletterPlaceholder: 'Email address',
        newsletterButtonLabel: 'Subscribe',
        navItems: [
          link('Home', '/'),
          link('About', '/about/'),
          link('Services', '/services/'),
          link('Contact', '/contact/'),
          link('Terms & Conditions', '/t-c/'),
          link('Privacy Policy', '/privacy-policy/'),
        ],
        copyrightLine: '© {year} INTERESTING AMERICA LLC. All rights reserved.',
      },
      seoSettings: {
        siteName: 'INTERESTING AMERICA',
        titleSuffix: ' | INTERESTING AMERICA',
        defaultDescription: 'Global Accommodation, Transfers, and Hospitality at large Sports Events',
        defaultOgImage: mediaRef('heroLosAngeles'),
      },
      companyInfo: {
        companyName: 'INTERESTING AMERICA, LLC',
        description: 'Accommodation, transfers and hospitality for major global sports events.',
        address: '1427 Wilcox Ave, Hollywood, CA 90028-8123 Los Angeles, U.S.A.',
        email: 'america@interesting.global',
        phone: '',
        whatsApp: '',
      },
      socialLinks: {
        items: [],
      },
    },
    pages: [
      {
        title: 'Home',
        slug: 'home',
        pageClasses: 'page-home',
        hideFooter: false,
        seoTitle: 'INTERESTING AMERICA',
        seoDescription: 'Accommodation, transfers and hospitality for major global sports events.',
        ogImage: mediaRef('heroAtlanta'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'home',
            title: 'We secure rooms\nfor your groups\nat major global\nsports events.',
            typewriterText: 'We secure rooms\nfor your groups\nat major global\nsports events.',
            subcopyItems: [
              { text: '2026 World Cup' },
              { text: '2027 Women\'s World Cup' },
              { text: '2027 Champions League Final' },
              { text: '2028 Summer Olympics' },
            ],
            slides: [
              { image: mediaRef('heroAtlanta'), caption: 'Marriott Marquis**** · Atlanta, GA' },
              { image: mediaRef('heroParis'), caption: 'Stade de France, Paris, France · Summer Olympics 2024' },
              { image: mediaRef('heroSouthAfrica'), caption: 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' },
              { image: mediaRef('heroStRegis'), caption: 'The St. Regis***** · San Francisco, CA' },
              { image: mediaRef('heroLosAngeles'), caption: 'Los Angeles, CA · Host City of the 2028 Summer Olympics' },
              { image: mediaRef('heroDallas'), caption: 'Dallas, TX · 2026 Soccer World Cup Host City' },
              { image: mediaRef('heroSantaMonica'), caption: 'Santa Monica, CA' },
              { image: mediaRef('heroMaracana'), caption: 'Maracana Stadium, Rio de Janeiro, Brazil · 2014 World Cup Final Venue' },
              { image: mediaRef('heroColony'), caption: 'The Colony Hotel*** · Miami Beach, FL' },
              { image: mediaRef('heroSofi'), caption: '2028 Stadium, Inglewood, CA · Olympic Ceremonies and Swimming Venue' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Get in Touch', '/contact/'),
          },
        ],
      },
      {
        title: 'About',
        slug: 'about',
        pageClasses: 'subpage-home page-about',
        hideFooter: false,
        seoTitle: 'About | INTERESTING AMERICA',
        seoDescription: 'About INTERESTING AMERICA',
        ogImage: mediaRef('heroStRegis'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'subpage',
            title: 'Sourcing and\ncoordinating,\nas required by\ncomplex event travel.',
            copy: 'Clients work with us when the project matters, timelines are tight, and a standard booking process is not enough - as usually the case at high-stakes sports events.',
            slides: [
              { image: mediaRef('heroStRegis'), caption: 'The St. Regis***** · San Francisco, CA' },
              { image: mediaRef('heroParis'), caption: 'Stade de France, Paris, France · Summer Olympics 2024' },
              { image: mediaRef('heroSouthAfrica'), caption: 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' },
              { image: mediaRef('heroLosAngeles'), caption: 'Los Angeles, CA · Host City of the 2028 Summer Olympics' },
              { image: mediaRef('heroDallas'), caption: 'Dallas, TX · 2026 Soccer World Cup Host City' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Start an Inquiry', '/contact/'),
          },
          {
            blockType: 'processSteps',
            heading: 'How we work',
            items: [
              {
                index: '01',
                title: 'Understand the brief',
                text: 'We start by understanding the group\'s requirements and preferences, as well as the location, the timing, and the budget.',
                tone: 'blue',
              },
              {
                index: '02',
                title: 'Source and negotiate',
                text: 'Then we source the right accommodation and, if required, the transportation and hospitality set-up, negotiate the terms, and coordinate the details with everyone involved.',
                tone: 'red',
              },
              {
                index: '03',
                title: 'Coordinate to delivery',
                text: 'We stay hands-on and close to the process from arrival to departure.',
                tone: 'dark',
              },
            ],
          },
          {
            blockType: 'gallery',
            heading: 'Selected Projects',
            style: 'cards',
            items: [
              {
                image: mediaRef('projectBrazil'),
                title: '2014 World Cup, Brazil',
                summary: 'Delivered 50,000+ room nights across all Brazilian host cities, managing accommodation, transfers, tours and hospitality for corporate clients, tour operators, sponsors and federations.',
                detail: 'Key clients included DFB Germany and KNVB Netherlands.',
                secondaryDetail: 'Highlight project: Venue sourcing for adidas at the Museum of Modern Art in Rio de Janeiro during the 2013 Confederations Cup.',
              },
              {
                image: mediaRef('projectTokyo'),
                title: '2020+1 Olympic Games, Tokyo',
                summary: 'Managed Olympic accommodation challenges including reservation rollovers and COVID bubble compliance.',
                detail: 'Key clients included USTA and adidas.',
                secondaryDetail: 'Highlight project: Executed emergency rebooking 48 hours before guest arrival, securing alternative high-level accommodation in Tokyo under extreme time pressure.',
              },
              {
                image: mediaRef('projectCortina'),
                title: '2026 Winter Olympic Games, Milano Cortina',
                summary: 'Supported NOCs, sponsors, elite athletes and VIP guests across the Games. In the Livigno Mountain Cluster alone, 24 properties were contracted, delivering 3,800 room nights for more than 200 guests including crew, athletes, senior management and sponsor VIPs.',
                detail: 'Key clients included VISA and ABInBev.',
                secondaryDetail: 'Highlight project: Media hub venue and VVIP accommodation for ABInBev\'s Corona brand.',
              },
            ],
          },
          {
            blockType: 'clientList',
            heading: 'Selected clients include',
            items: [
              'Adidas', 'ABInBev', 'Česká Televize', 'DFB Germany', 'JTB Japan', 'KNVB Netherlands',
              'Nestlé', 'RedBull', 'RFEF Spain', 'Team USA', 'US Tennis Association', 'P&G',
              'Televisión Cubana', 'SRG/SSR', 'Octagon', 'ORF', 'VISA',
            ].map((name) => ({ name })),
          },
          {
            blockType: 'timeline',
            heading: 'Additional event highlights',
            items: [
              { title: '2010 World Cup, South Africa', text: 'NOKIA LatAm VIP Final program in Johannesburg, including premium accommodation, match transfers, curated experiences and hospitality.' },
              { title: '2016 Olympic Games, Brazil', text: 'Accommodation sourcing for NOCs, sponsors, media and sports marketing firms, including long-stay crew housing for adidas House and stays involving USTA athletes.' },
              { title: '2018 World Cup, Russia', text: 'Full logistics for an 80-person Nestlé Mexico guest program, including charter flights, hotel, hospitality and staffing.' },
              { title: '2022 World Cup, Qatar', text: 'Accommodation sourcing for national team friends & family programs, sponsors and broadcasters, including projects for Netflix documentary production and RFEF player families.' },
              { title: '2024 Olympic Games, Paris', text: 'Integrated accommodation and mobility solutions for sponsors, NOCs and broadcasters, including work for P&G and SRG Television.' },
              { title: '2024 Champions League Final, Istanbul', text: 'Full-property buyout of the Grand Hotel Pera Palace for VVIP accommodation and match hospitality.' },
            ],
          },
          {
            blockType: 'testimonial',
            heading: 'Client feedback',
            items: [
              { quote: 'I have to say Thank You for everything! You guys have been amazing helping out everywhere and every time!', author: 'Adidas (B. Jung), Germany', role: 'Sponsor' },
              { quote: 'Nos que agradecemos pelo apolo e cooperação!. Deu tudo certo e conseguimos proporcionar uma experiência única para os nossos clientes. Esperamos ter mais oportunidade de trabalhar com vocês.', author: 'PB Incoming, Brasil', role: 'Agency' },
              { quote: 'Prima. Overnachtingen waren prima. Appartement trouwens ook. Waren twee mooie weken!', author: 'Maison van den Boer, Netherlands', role: 'Hospitality' },
              { quote: 'Literally this partnership has been a life saver for us id Integral!:-) You guys are amazing. High high high five from Integral Team.', author: 'INTEGRAL, Nigeria', role: 'Agency' },
              { quote: 'Thanks so much for arranging everything. The apartment was perfect and made the stay even more enjoyable and successful.', author: 'Adidas (M. Heising), Germany', role: 'Sponsor' },
              { quote: 'Stuiten we een prachtige periode af. Bedankt voor je huip!', author: 'Watersportverbond, Netherlands', role: 'Federation' },
              { quote: 'Thanks for all your help. It was really good to work with you.', author: 'GMR Marketing, USA', role: 'Agency' },
              { quote: 'I\'d like to say thank you for your cooperation, that was always great fun. Also my group at the Augusto\'s Copacabana was totally happy and enjoyed their stay pretty much.', author: 'DER Touristik, Germany', role: 'Tour operator' },
              { quote: 'I have received a few thank you emails. Which is pleasing & they all had a wonderful time.', author: 'Prestige Holidays, UK', role: 'Tour operator' },
            ],
          },
        ],
      },
      {
        title: 'Services',
        slug: 'services',
        pageClasses: 'subpage-home page-services',
        hideFooter: false,
        seoTitle: 'Services | INTERESTING AMERICA',
        seoDescription: 'Services by INTERESTING AMERICA',
        ogImage: mediaRef('heroSofi'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'subpage',
            title: 'Global accommodation,\ntransfers,\nand hospitality,\nall in one place.',
            copy: 'We provide solutions for federations, sponsors, media, and travel agencies since 2010.',
            slides: [
              { image: mediaRef('heroSofi'), caption: '2028 Stadium, Inglewood, CA · Olympic Ceremonies and Swimming Venue' },
              { image: mediaRef('heroParis'), caption: 'Stade de France, Paris, France · Summer Olympics 2024' },
              { image: mediaRef('heroSouthAfrica'), caption: 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' },
              { image: mediaRef('heroAtlanta'), caption: 'Marriott Marquis**** · Atlanta, GA' },
              { image: mediaRef('heroColony'), caption: 'The Colony Hotel*** · Miami Beach, FL' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Start an Inquiry', '/contact/'),
          },
          {
            blockType: 'splitSection',
            image: mediaRef('serviceAccommodation'),
            headline: 'We secure rooms for your groups at major global sports events.',
            contentHtml: paragraphs([
              'With experience across eight World Cups and Olympic Games, we understand what major events demand from accommodation.',
              'We work with sponsors and agencies to house guest-program attendees and staff during brand activations, and with media organizations to secure long-stay accommodation for technical crews, journalists, and broadcasters close to media centers.',
              'For federations, we source accommodation for friends and families of athletes and staff, placed close to the venues where their loved ones compete.',
            ]),
            reverse: false,
            objectPosition: 'center 38%',
            primaryLink: link('Get in Touch', '/contact/'),
          },
          {
            blockType: 'splitSection',
            image: mediaRef('serviceTransportation'),
            headline: 'We also transfer your staff and guests. On arrival, on departure, and on match day.',
            contentHtml: paragraphs([
              'We provide reliable air and ground transportation tailored to the demands of sports events. From airport pickups and shuttle services to hotel-to-stadium transfers, we focus on understanding your needs and delivering solutions that cover every aspect of your event.',
              'Whether you require precision logistics for a global championship or a smaller, highly customized setup, we handle pre-event and post-event travel end to end.',
            ]),
            reverse: true,
            objectPosition: 'center 42%',
            primaryLink: link('Get in Touch', '/contact/'),
          },
          {
            blockType: 'splitSection',
            image: mediaRef('serviceHospitality'),
            headline: 'And on your behalf, we get access to hospitality: tickets and tables at the finest venues in town.',
            contentHtml: paragraphs([
              'From restaurant bookings and on-site catering to city tours, we offer a wide range of hospitality services. We present you with a hospitality concept shaped around your event, your guests, and your budget to create meaningful and memorable experiences for your groups between match days.',
            ]),
            reverse: false,
            objectPosition: 'center 42%',
            primaryLink: link('Get in Touch', '/contact/'),
          },
        ],
      },
      {
        title: 'Contact',
        slug: 'contact',
        pageClasses: 'subpage-home page-contact',
        hideFooter: false,
        seoTitle: 'Contact | INTERESTING AMERICA',
        seoDescription: 'Contact INTERESTING AMERICA',
        ogImage: mediaRef('heroAtlanta'),
        pageBlocks: [
          {
            blockType: 'contactForm',
            showTrustBadge: true,
          },
        ],
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        pageClasses: 'subpage-home page-privacy',
        hideFooter: false,
        seoTitle: 'Privacy Policy | INTERESTING AMERICA',
        seoDescription: 'Privacy Policy',
        ogImage: mediaRef('heroStRegis'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'subpage',
            title: 'Privacy Policy\nfor website use,\ncontact forms,\nand newsletter signups.',
            copy: 'How we collect, use, disclose, and safeguard information when you visit this website or communicate with us.',
            slides: [
              { image: mediaRef('heroStRegis'), caption: 'The St. Regis***** · San Francisco, CA' },
              { image: mediaRef('heroParis'), caption: 'Stade de France, Paris, France · Summer Olympics 2024' },
              { image: mediaRef('heroSouthAfrica'), caption: 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' },
              { image: mediaRef('heroDallas'), caption: 'Dallas, TX · 2026 Soccer World Cup Host City' },
              { image: mediaRef('heroSantaMonica'), caption: 'Santa Monica, CA · Illustrative destination imagery' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Contact Us', '/contact/'),
          },
          {
            blockType: 'richTextSection',
            maxWidth: 'legal',
            contentHtml: privacyHtml,
          },
        ],
      },
      {
        title: 'Terms & Conditions',
        slug: 't-c',
        pageClasses: 'subpage-home page-terms',
        hideFooter: false,
        seoTitle: 'Terms & Conditions | INTERESTING AMERICA',
        seoDescription: 'Terms & Conditions',
        ogImage: mediaRef('heroDallas'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'subpage',
            title: 'INTERESTING AMERICA\nTerms of Use and\nStandard Commercial Terms',
            slides: [
              { image: mediaRef('heroDallas'), caption: 'Dallas, TX · 2026 Soccer World Cup Host City' },
              { image: mediaRef('heroParis'), caption: 'Stade de France, Paris, France · Summer Olympics 2024' },
              { image: mediaRef('heroSouthAfrica'), caption: 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' },
              { image: mediaRef('heroMaracana'), caption: 'Maracana Stadium, Rio de Janeiro, Brazil · Reference Venue Context' },
              { image: mediaRef('heroSantaMonica'), caption: 'Santa Monica, CA · Illustrative destination imagery' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Contact Us', '/contact/'),
          },
          {
            blockType: 'richTextSection',
            maxWidth: 'legal',
            contentHtml: termsHtml,
          },
        ],
      },
      {
        title: 'Thank You',
        slug: 'thank-you',
        pageClasses: 'subpage-home page-thank-you',
        hideFooter: false,
        seoTitle: 'Thank You | INTERESTING AMERICA',
        seoDescription: 'Thank-you page for INTERESTING AMERICA inquiries',
        ogImage: mediaRef('heroAtlanta'),
        pageBlocks: [
          {
            blockType: 'hero',
            variant: 'subpage',
            title: 'Your inquiry\nhas been sent.',
            copy: 'We have received your request and will come back with availability, options, and next steps as quickly as possible.',
            slides: [
              { image: mediaRef('heroAtlanta'), caption: 'Marriott Marquis**** · Atlanta, GA' },
            ],
            dimmingPercent: 100,
            primaryLink: link('Return Home', '/'),
          },
        ],
      },
    ],
  }
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)]))
  }

  return value
}

function resolveMediaRefs(value, mediaResolver) {
  if (Array.isArray(value)) {
    return value.map((item) => resolveMediaRefs(item, mediaResolver))
  }

  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && value.seedKey && mediaResolver[value.seedKey]) {
      return cloneValue(mediaResolver[value.seedKey])
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolveMediaRefs(entry, mediaResolver)]),
    )
  }

  return value
}

export function materializeSeedContent(blueprint, mediaResolver) {
  return {
    mediaLibrary: cloneValue(blueprint.mediaLibrary),
    globals: resolveMediaRefs(blueprint.globals, mediaResolver),
    pages: resolveMediaRefs(blueprint.pages, mediaResolver),
  }
}

export function createFrontendMediaResolver(mediaLibrary) {
  return Object.fromEntries(
    Object.entries(mediaLibrary).map(([key, media]) => [
      key,
      {
        alt: media.alt,
        filename: path.basename(media.publicPath),
        frontendPath: media.publicPath,
      },
    ]),
  )
}
