import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "bn";

const translations = {
  en: {
    nav: {
      brand: "Ibrahim Khalil",
      about: "About",
      leadership: "Leadership",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      gallery: "Gallery",
      contact: "Contact",
      getInTouch: "Get in touch",
      toggleMenu: "Toggle menu",
    },
    scroll: {
      scroll: "Scroll",
      scrollToTop: "Scroll to top",
      about: "About",
      leadership: "Leadership",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      gallery: "Gallery",
      contact: "Contact",
    },
    hero: {
      badge: "President · 10 No. Mathbari Union Youth Wing",
      firstName: "Ibrahim",
      lastName: "Khalil",
      introPrefix: "I am a dedicated ",
      roles: [
        "Community Leader",
        "Public Representative",
        "Social Worker",
        "Youth Mentor",
        "Professional",
        "Student",
      ],
      body: "community leader, youth organizer, and public servant from Trishal, Mymensingh — committed to building a stronger, more inclusive future for the people of this region through grassroots service and meaningful impact.",
      location: "Mymensingh, Bangladesh",
      contactMe: "Contact Me",
      downloadCv: "CV",
      email: "Email",
      call: "Call",
      facebook: "Facebook",
      linkedin: "LinkedIn",
      servingSince: "Serving since",
      communityPrograms: "Community Programs",
      heroAlt: "Ibrahim Khalil — President, 10 No. Mathbari Union Youth Wing",
    },
    about: {
      eyebrow: "About Me",
      title1: "A journey of",
      title2: "faith, learning & service",
      description: "Rooted in Trishal, Mymensingh. Driven by purpose. Built for impact.",
      profile: "Profile",
      para1part1: "I am ",
      para1em1: "Ibrahim Khalil",
      para1part2: ", a dedicated student and professional currently pursuing ",
      para1em2: "Fazil 2nd Year in Bengali",
      para1part3: " at ",
      para1em3: "Khagati Jamtoli Fazil Madrasa",
      para1part4: " and ",
      para1em4: "Honours 2nd Year in Philosophy",
      para1part5: " at ",
      para1em5: "M M Ali College, Tangail",
      para1part6: ". Alongside my academic journey, I serve as a ",
      para1em6: "Marketing Officer at SNR Electric & Electronics",
      para1part7: ".",
      para2part1:
        "My leadership journey reflects a deep commitment to public service and youth development. I previously served as the ",
      para2em1: "Secretary of Bangladesh Islami Chhatra Shibir, Trishal Upazila Unit (2023–25)",
      para2part2: ", and currently serve as ",
      para2em2:
        "President of Bangladesh Jamaat-e-Islami, 10 No. Mathbari Union Youth Wing, Trishal",
      para2part3:
        " — shaping grassroots initiatives and empowering the next generation of leaders.",
      para3:
        "My vision is to bridge academic excellence with professional integrity and social responsibility — contributing to a society where every individual has the opportunity to grow, lead, and make a meaningful difference.",
      tagline: "Built for impact",
      stat1label: "Leadership",
      stat1value: "2+",
      stat2label: "Education",
      stat2value: "2x",
      stat3label: "Service",
      stat3value: "3+",
      pillar1title: "Leadership",
      pillar1text: "Building bridges between people, government and grassroots needs.",
      pillar2title: "Education",
      pillar2text: "Championing access to quality learning for every young mind.",
      pillar3title: "Professional",
      pillar3text: "Bringing corporate discipline into public service delivery.",
      pillar4title: "Community",
      pillar4text: "Standing with families through every season of life.",
    },
    achievements: {
      eyebrow: "Achievements",
      title: "Honours & recognition",
      item1: { year: "2019–20", title: "Debate Competition", org: "Jamtoli Fazil Madrasah" },
      item2: {
        year: "2023–24",
        title: "Community Service Recognition",
        org: "Bangladesh Islami Chhatra Shibir, Trishal, Mymensingh",
      },
      item3: {
        year: "2024–25",
        title: "Excellence in Public Engagement",
        org: "Bangladesh Islami Chhatra Shibir, Trishal, Mymensingh",
      },
    },
    education: {
      eyebrow: "Education",
      title1: "Foundations of",
      title2: "a lifelong learner",
      item1: {
        year: "2023 — Present",
        title: "Honours in Philosophy",
        org: "M M Ali College, Tangail",
        desc: "2nd Year Honours Student. Department of Philosophy.",
      },
      item2: {
        year: "2023 — Present",
        title: "Fazil (Bengali)",
        org: "Khagati Jamtoli Fazil Madrasa",
        desc: "Fazil 2nd Year. Department of Bengali.",
      },
      item3: {
        year: "2023",
        title: "Alim (HSC Equivalent)",
        org: "Khagati Jamtoli Fazil Madrasa",
        desc: "Completed higher secondary education with a strong academic record.",
      },
      item4: {
        year: "2021",
        title: "Dakhil (SSC Equivalent)",
        org: "Khagati Jamtoli Fazil Madrasa",
        desc: "Completed secondary education with distinction.",
      },
    },
    experience: {
      eyebrow: "Experience",
      title1: "A career built on",
      title2: "service & impact",
      role: "Marketing Officer",
      org: "SNR Electric & Electronics",
      period: "Present",
      desc1:
        "Leading marketing strategy, brand positioning and market expansion across the region.",
      desc2: "Driving sales growth through targeted campaigns and client relationship management.",
      desc3:
        "Building brand awareness and distribution networks in the electrical and electronics sector.",
    },
    skills: {
      eyebrow: "Expertise",
      title1: "Forged through",
      title2: "a decade of dedicated service",
      description:
        "Ten core capabilities developed across years of grassroots leadership, community organizing, and public engagement.",
      list: [
        { name: "Leadership", value: 96 },
        { name: "Public Speaking", value: 93 },
        { name: "Community Development", value: 95 },
        { name: "Team Management", value: 90 },
        { name: "Event Management", value: 88 },
        { name: "Communication", value: 94 },
        { name: "Project Management", value: 89 },
        { name: "Research & Policy", value: 85 },
        { name: "Digital Skills", value: 87 },
        { name: "Microsoft Office", value: 92 },
      ],
    },
    projects: {
      eyebrow: "Projects",
      title1: "Community Impact",
      title2: "& Leadership",
      description:
        "Real initiatives driving change through community engagement, youth development, and public service.",
      viewProject: "View Project",
      aboutProject: "About this project",
      keyFocus: "Key focus areas",
      activities: "Activities & impact",
      learnMore: "Learn More",
      close: "Close",
      closeDetails: "Close project details",
      list: [
        {
          title: "Blood Donation Awareness Initiative",
          tag: "Community Health",
          tagColor: "from-rose-500/30 to-rose-700/20",
          desc: "Organized and promoted blood donation awareness activities, encouraged voluntary donors, and supported community members in emergency blood collection efforts.",
          highlights: ["Community impact", "Awareness campaigns", "Volunteer participation"],
          details: [
            "Organized awareness campaigns reaching 500+ community members through seminars and mosque announcements.",
            "Coordinated with local blood banks and hospitals for emergency blood collection drives.",
            "Built a volunteer network of 40+ regular donors ready to respond to urgent needs.",
            "Conducted health education sessions on the importance and safety of voluntary blood donation.",
          ],
        },
        {
          title: "Tree Plantation & Environmental Awareness",
          tag: "Environment",
          tagColor: "from-emerald-500/30 to-emerald-700/20",
          desc: "Participated in and coordinated tree plantation activities to promote environmental sustainability and community awareness regarding climate and environmental responsibility.",
          highlights: [
            "Environmental awareness",
            "Community participation",
            "Sustainable development",
          ],
          details: [
            "Coordinated seasonal tree plantation drives planting 2,000+ saplings across the union.",
            "Engaged 300+ local volunteers including students and community leaders in green initiatives.",
            "Conducted awareness workshops on climate change, deforestation, and environmental responsibility.",
            "Collaborated with local schools to establish student-led eco-clubs for ongoing environmental action.",
          ],
        },
        {
          title: "Youth Leadership Development Program",
          tag: "Youth Development",
          tagColor: "from-amber-500/30 to-amber-600/20",
          desc: "Led youth-focused activities, discussions, and organizational programs designed to develop leadership skills, teamwork, responsibility, and community engagement among young people.",
          highlights: ["Leadership training", "Team building", "Youth development"],
          details: [
            "Designed and facilitated leadership workshops for 200+ young participants across Trishal.",
            "Mentored youth groups in project planning, public speaking, and organizational management.",
            "Organized team-building retreats and collaborative problem-solving sessions.",
            "Created a youth leadership pipeline that placed 15+ young leaders in community organizing roles.",
          ],
        },
        {
          title: "Educational & Community Outreach",
          tag: "Education",
          tagColor: "from-sky-500/30 to-sky-700/20",
          desc: "Supported educational guidance programs, community service initiatives, public engagement activities, and awareness campaigns aimed at helping students and local communities.",
          highlights: ["Educational support", "Community engagement", "Public awareness"],
          details: [
            "Provided academic guidance and career counselling to 150+ students from under-resourced backgrounds.",
            "Organized community awareness campaigns on health, hygiene, and civic responsibility.",
            "Facilitated public engagement forums connecting community members with local government services.",
            "Distributed educational materials and school supplies to students in need across the union.",
          ],
        },
        {
          title: "Skill Development & Employment Support",
          tag: "Skill Development",
          tagColor: "from-violet-500/30 to-violet-700/20",
          desc: "Organized skill development workshops and career guidance programs for youth and community members. Focused on building practical skills, digital literacy, communication, and employability to help individuals become self-reliant and confident in their careers.",
          highlights: [
            "Skill training",
            "Career guidance",
            "Employment support",
            "Digital literacy",
            "Self-reliance",
          ],
          details: [
            "Conducted vocational skill workshops in digital literacy, communication, and basic computer proficiency.",
            "Provided one-on-one career counselling sessions for 100+ job-seeking youth.",
            "Partnered with local businesses to create internship and apprenticeship opportunities.",
            "Organized resume-building and interview-preparation workshops for first-time job seekers.",
          ],
        },
        {
          title: "Community Welfare & Social Support",
          tag: "Social Welfare",
          tagColor: "from-orange-500/30 to-orange-600/20",
          desc: "Supported underprivileged families and local communities through humanitarian activities, emergency assistance, food distribution, and social support initiatives. Focused on building a stronger, more compassionate community through collective responsibility and service.",
          highlights: [
            "Humanitarian support",
            "Community service",
            "Emergency assistance",
            "Social welfare",
            "Charity initiatives",
          ],
          details: [
            "Led food distribution drives reaching 300+ underprivileged families during hardship periods.",
            "Coordinated emergency relief efforts including cash and supplies for families facing crisis.",
            "Organized winter clothing and blanket collection campaigns for vulnerable communities.",
            "Established a community support network connecting donors with families in genuine need.",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title1: "Moments from",
      title2: "the field",
      description: "Snapshots from community programs, public events and grassroots leadership.",
      captions: [
        "Community Meeting",
        "Youth Summit 2024",
        "Education Drive",
        "Tree Plantation",
        "Public Address",
      ],
    },
    leadership: {
      eyebrow: "Leadership & Politics",
      title1: "Public service,",
      title2: "reimagined",
      description:
        "Currently serving as President of Bangladesh Jamaat-e-Islami's 10 No. Mathbari Union Youth Wing, with a track record of organisational leadership.",
      roles: [
        {
          title: "President",
          org: "Bangladesh Jamaat-e-Islami",
          unit: "10 No. Mathbari Union Youth Wing, Trishal",
          period: "Current",
          description:
            "Leading youth engagement, community outreach and grassroots development initiatives across the union.",
        },
        {
          title: "Former Secretary",
          org: "Bangladesh Islami Chhatra Shibir",
          unit: "Trishal Upazila Unit",
          period: "2023 – 2025",
          description:
            "Led organisational activities, youth programs and administrative operations at the upazila level.",
        },
      ],
      futureVision: "Future Vision",
      tooltip: "Leadership is service.",
      modalTitle: "Vision Statement",
      modalSubtitle: "Leadership Philosophy",
      modalClose: "Close",
      quote:
        "A community where every young person finds purpose, every family finds support, and every voice finds representation — built on integrity, powered by service, and driven by faith.",
    },
    contact: {
      eyebrow: "Contact",
      title1: "Let's",
      title2: "build together",
      description:
        "Whether it's a community concern, a partnership idea, or a media request — I'd love to hear from you.",
      labels: {
        email: "Email",
        phone: "Phone",
        whatsapp: "WhatsApp",
        office: "Office",
        facebook: "Facebook",
      },
      values: {
        email: "kholilebrahim2005@gmail.com",
        phone: "+880 1846-827978",
        whatsapp: "01846827978",
        office: "Mathbari Union, Trishal, Mymensingh",
        facebook: "Md. Ibrahim Kholil",
      },
      formName: "Name",
      formEmail: "Email",
      formSubject: "Subject",
      formMessage: "Message",
      sendMessage: "Send Message",
      sending: "Sending...",
      successTitle: "Message sent!",
      successText: "Thank you for reaching out. I'll get back to you as soon as possible.",
      dismiss: "Dismiss",
      errorDefault: "Something went wrong. Please try again.",
      facebookAria: "Facebook",
      linkedinAria: "LinkedIn",
      whatsappAria: "WhatsApp",
    },
    stats: {
      programs: { label: "Community Programs", suffix: "+" },
      projects: { label: "Projects Completed", suffix: "+" },
      volunteers: { label: "Volunteers Managed", suffix: "+" },
      service: { label: "Years of Service", suffix: "" },
      events: { label: "Public Events", suffix: "+" },
    },
    testimonials: {
      eyebrow: "Testimonials",
      title1: "Words from",
      title2: "the people",
      quotes: [
        {
          text: "Leadership is not about power, it is about responsibility and service to people.",
          name: "Inspired Leadership Thought",
        },
        {
          text: "The best way to find yourself is to lose yourself in the service of others.",
          name: "Community Leadership Philosophy",
        },
        {
          text: "True success is measured by the positive impact you create in society.",
          name: "Public Service Reflection",
        },
        {
          text: "A leader is one who knows the way, goes the way, and shows the way.",
          name: "Leadership Principle",
        },
      ],
    },
    footer: {
      copyright: "Ibrahim Khalil. Built for the people of Trishal, Mymensingh.",
      location: "Trishal · Tangail · Mymensingh · Bangladesh",
    },
    error: {
      "404title": "404",
      "404heading": "Page not found",
      "404desc": "The page you're looking for doesn't exist or has been moved.",
      goHome: "Go home",
      errorHeading: "This page didn't load",
      errorDesc: "Something went wrong on our end. You can try refreshing or head back home.",
      tryAgain: "Try again",
    },
    meta: {
      description:
        "Ibrahim Khalil — Student, Marketing Officer & Youth Leader from Trishal, Mymensingh.",
    },
    ghost: {
      clickMe: "Click Me",
      tapToReveal: "Tap to reveal...",
    },
    pageLoader: {
      loading: "Loading",
    },
    interactions: {
      educationAria: "Education insight — Knowledge is a lifelong journey",
      educationText: "Knowledge is a lifelong journey.",
      experienceAria: "Experience insight — Every experience builds leadership",
      experienceText: "Every experience builds leadership.",
      galleryAria: "Gallery insight — Moments of journey",
      galleryText: "Moments of journey.",
      achievementsAria: "Achievements insight — Consistency creates success",
      achievementsText: "Consistency creates success.",
      contactAria: "Contact insight — Let's connect",
      contactText: "Let's connect.",
      communityAria: "Community insight — Small actions create big impact",
      communityText: "Small actions create big impact.",
      testimonialsAria: "Testimonials insight — Voices of trust",
      testimonialsText: "Voices of trust.",
      leadershipAria: "Leadership insight — Leadership is service",
    },
  },
  bn: {
    nav: {
      brand: "ইব্রাহীম খলিল",
      about: "আমার সম্পর্কে",
      leadership: "নেতৃত্ব",
      experience: "অভিজ্ঞতা",
      skills: "দক্ষতা",
      projects: "প্রকল্প",
      gallery: "গ্যালারি",
      contact: "যোগাযোগ",
      getInTouch: "যোগাযোগ করুন",
      toggleMenu: "মেনু টগল করুন",
    },
    scroll: {
      scroll: "স্ক্রল",
      scrollToTop: "উপরে যান",
      about: "আমার সম্পর্কে",
      leadership: "নেতৃত্ব",
      experience: "অভিজ্ঞতা",
      skills: "দক্ষতা",
      projects: "প্রকল্প",
      gallery: "গ্যালারি",
      contact: "যোগাযোগ",
    },
    hero: {
      badge: "সভাপতি · ১০ নং মাঠবাড়ি ইউনিয়ন যুব শাখা",
      firstName: "ইব্রাহীম",
      lastName: "খলিল",
      introPrefix: "আমি ত্রিশাল, ময়মনসিংহের একজন নিবেদিত ",
      roles: ["সমাজ নেতা", "জনপ্রতিনিধি", "সমাজকর্মী", "যুব মেন্টর", "পেশাজীবী", "শিক্ষার্থী"],
      body: "কমিউনিটি লিডার, যুব সংগঠক ও পাবলিক সার্ভেন্ট — গ্রাসরুটস সেবা ও অর্থপূর্ণ প্রভাবের মাধ্যমে এই অঞ্চলের মানুষের জন্য একটি শক্তিশালী, আরও অন্তর্ভুক্তিমূলক ভবিষ্যত গড়তে প্রতিশ্রুতিবদ্ধ।",
      location: "ময়মনসিংহ, বাংলাদেশ",
      contactMe: "যোগাযোগ করুন",
      downloadCv: "সিভি",
      email: "ইমেইল",
      call: "কল",
      facebook: "ফেসবুক",
      linkedin: "লিংকডইন",
      servingSince: "সেবায় আছি",
      communityPrograms: "কমিউনিটি প্রোগ্রাম",
      heroAlt: "ইব্রাহীম খলিল — সভাপতি, ১০ নং মাঠবাড়ি ইউনিয়ন যুব শাখা",
    },
    about: {
      eyebrow: "আমার সম্পর্কে",
      title1: "একটি যাত্রা",
      title2: "ঈমান, শিক্ষা ও সেবার",
      description: "শিকড় ত্রিশালে, ময়মনসিংহে। লক্ষ্যে চালিত। প্রভাবের জন্য তৈরি।",
      profile: "প্রোফাইল",
      para1part1: "আমি ",
      para1em1: "ইব্রাহীম খলিল",
      para1part2: ", একজন নিবেদিতপ্রাণ শিক্ষার্থী ও পেশাজীবী। বর্তমানে আমি ",
      para1em2: "বাংলায় ফাজিল ২য় বর্ষ",
      para1part3: " অধ্যায়ন করছি ",
      para1em3: "খাগাটি জামতলী ফাজিল মাদ্রাসায়",
      para1part4: " এবং ",
      para1em4: "দর্শনে অনার্স ২য় বর্ষ",
      para1part5: " অধ্যায়ন করছি ",
      para1em5: "এম এম আলী কলেজ, টাঙ্গাইলে",
      para1part6: "। পাশাপাশি আমি ",
      para1em6: "এসএনআর ইলেকট্রিক অ্যান্ড ইলেকট্রনিক্সে মার্কেটিং অফিসার",
      para1part7: " হিসেবে কাজ করছি।",
      para2part1:
        "আমার নেতৃত্বের যাত্রা গণসেবা ও যুব উন্নয়নের প্রতি গভীর অঙ্গীকার প্রতিফলিত করে। আমি পূর্বে ",
      para2em1: "বাংলাদেশ ইসলামী ছাত্রশিবির, ত্রিশাল উপজেলা শাখার সেক্রেটারি (২০২৩-২৫)",
      para2part2: " হিসেবে দায়িত্ব পালন করেছি এবং বর্তমানে ",
      para2em2: "বাংলাদেশ জামায়াতে ইসলামী, ১০ নং মাঠবাড়ি ইউনিয়ন যুব শাখার সভাপতি, ত্রিশাল",
      para2part3:
        " হিসেবে দায়িত্ব পালন করছি — গ্রাসরুট উদ্যোগ গঠন এবং নেতাদের পরবর্তী প্রজন্মকে ক্ষমতায়ন করছি।",
      para3:
        "আমার লক্ষ্য হল একাডেমিক উৎকর্ষতাকে পেশাদার সততা ও সামাজিক দায়বদ্ধতার সাথে সেতুবন্ধন করা — এমন একটি সমাজে অবদান রাখা যেখানে প্রতিটি ব্যক্তির বেড়ে ওঠার, নেতৃত্ব দেওয়ার এবং অর্থপূর্ণ পরিবর্তন আনার সুযোগ রয়েছে।",
      tagline: "প্রভাবের জন্য তৈরি",
      stat1label: "নেতৃত্ব",
      stat1value: "২+",
      stat2label: "শিক্ষা",
      stat2value: "২x",
      stat3label: "সেবা",
      stat3value: "৩+",
      pillar1title: "নেতৃত্ব",
      pillar1text: "জনগণ, সরকার ও গ্রাসরুটের চাহিদার মধ্যে সেতুবন্ধন তৈরি।",
      pillar2title: "শিক্ষা",
      pillar2text: "প্রত্যেক তরুণ মনের জন্য মানসম্মত শিক্ষার সুযোগ নিশ্চিত করা।",
      pillar3title: "পেশাদার",
      pillar3text: "পাবলিক সার্ভিস ডেলিভারিতে কর্পোরেট শৃঙ্খলা আনা।",
      pillar4title: "কমিউনিটি",
      pillar4text: "জীবনের প্রতিটি মৌসুমে পরিবারের পাশে দাঁড়ানো।",
    },
    achievements: {
      eyebrow: "অর্জন",
      title: "সম্মাননা ও স্বীকৃতি",
      item1: { year: "২০১৯-২০", title: "বিতর্ক প্রতিযোগিতা", org: "জামতলী ফাজিল মাদ্রাসা" },
      item2: {
        year: "২০২৩-২৪",
        title: "কমিউনিটি সার্ভিস স্বীকৃতি",
        org: "বাংলাদেশ ইসলামী ছাত্রশিবির, ত্রিশাল, ময়মনসিংহ",
      },
      item3: {
        year: "২০২৪-২৫",
        title: "পাবলিক এনগেজমেন্টে উৎকর্ষতা",
        org: "বাংলাদেশ ইসলামী ছাত্রশিবির, ত্রিশাল, ময়মনসিংহ",
      },
    },
    education: {
      eyebrow: "শিক্ষা",
      title1: "ভিত্তি",
      title2: "একজন আজীবন শিক্ষার্থীর",
      item1: {
        year: "২০২৩ — বর্তমান",
        title: "দর্শনে অনার্স",
        org: "এম এম আলী কলেজ, টাঙ্গাইল",
        desc: "২য় বর্ষ অনার্স শিক্ষার্থী। দর্শন বিভাগ।",
      },
      item2: {
        year: "২০২৩ — বর্তমান",
        title: "ফাজিল (বাংলা)",
        org: "খাগাটি জামতলী ফাজিল মাদ্রাসা",
        desc: "ফাজিল ২য় বর্ষ। বাংলা বিভাগ।",
      },
      item3: {
        year: "২০২৩",
        title: "আলিম (এইচএসসি সমমান)",
        org: "খাগাটি জামতলী ফাজিল মাদ্রাসা",
        desc: "শক্তিশালী একাডেমিক রেকর্ডসহ উচ্চ মাধ্যমিক শিক্ষা সমাপ্ত।",
      },
      item4: {
        year: "২০২১",
        title: "দাখিল (এসএসসি সমমান)",
        org: "খাগাটি জামতলী ফাজিল মাদ্রাসা",
        desc: "কৃতিত্বের সাথে মাধ্যমিক শিক্ষা সমাপ্ত।",
      },
    },
    experience: {
      eyebrow: "অভিজ্ঞতা",
      title1: "একটি ক্যারিয়ার",
      title2: "সেবা ও প্রভাবে গড়া",
      role: "মার্কেটিং অফিসার",
      org: "এসএনআর ইলেকট্রিক অ্যান্ড ইলেকট্রনিক্স",
      period: "বর্তমান",
      desc1: "এই অঞ্চলে মার্কেটিং কৌশল, ব্র্যান্ড পজিশনিং এবং বাজার সম্প্রসারণের নেতৃত্ব দিচ্ছি।",
      desc2:
        "লক্ষ্যভিত্তিক ক্যাম্পেইন এবং ক্লায়েন্ট সম্পর্ক ব্যবস্থাপনার মাধ্যমে বিক্রয় বৃদ্ধি করছি।",
      desc3:
        "ইলেকট্রিক্যাল ও ইলেকট্রনিক্স সেক্টরে ব্র্যান্ড সচেতনতা এবং ডিস্ট্রিবিউশন নেটওয়ার্ক গড়ে তুলছি।",
    },
    skills: {
      eyebrow: "দক্ষতা",
      title1: "গঠিত",
      title2: "এক দশকের নিবেদিত সেবার মাধ্যমে",
      description:
        "বছরের পর বছর গ্রাসরুট নেতৃত্ব, কমিউনিটি অর্গানাইজিং এবং গণসম্পৃক্ততার মাধ্যমে developed দশটি মূল সক্ষমতা।",
      list: [
        { name: "নেতৃত্ব", value: 96 },
        { name: "পাবলিক স্পিকিং", value: 93 },
        { name: "কমিউনিটি ডেভেলপমেন্ট", value: 95 },
        { name: "টিম ম্যানেজমেন্ট", value: 90 },
        { name: "ইভেন্ট ম্যানেজমেন্ট", value: 88 },
        { name: "যোগাযোগ", value: 94 },
        { name: "প্রজেক্ট ম্যানেজমেন্ট", value: 89 },
        { name: "গবেষণা ও নীতি", value: 85 },
        { name: "ডিজিটাল দক্ষতা", value: 87 },
        { name: "মাইক্রোসফট অফিস", value: 92 },
      ],
    },
    projects: {
      eyebrow: "প্রকল্প",
      title1: "কমিউনিটি ইমপ্যাক্ট",
      title2: "ও নেতৃত্ব",
      description:
        "কমিউনিটি এনগেজমেন্ট, যুব উন্নয়ন এবং পাবলিক সার্ভিসের মাধ্যমে পরিবর্তন আনার বাস্তব উদ্যোগ।",
      viewProject: "প্রকল্প দেখুন",
      aboutProject: "এই প্রকল্প সম্পর্কে",
      keyFocus: "মূল ফোকাস এলাকা",
      activities: "কার্যক্রম ও প্রভাব",
      learnMore: "আরও জানুন",
      close: "বন্ধ করুন",
      closeDetails: "প্রকল্পের বিবরণ বন্ধ করুন",
      list: [
        {
          title: "রক্তদান সচেতনতা উদ্যোগ",
          tag: "কমিউনিটি হেলথ",
          tagColor: "from-rose-500/30 to-rose-700/20",
          desc: "রক্তদান সচেতনতা কার্যক্রম সংগঠিত ও প্রচার করা, স্বেচ্ছায় রক্তদাতাদের উৎসাহিত করা এবং জরুরি রক্ত সংগ্রহে কমিউনিটি সদস্যদের সহায়তা করা।",
          highlights: ["কমিউনিটি ইমপ্যাক্ট", "সচেতনতা ক্যাম্পেইন", "স্বেচ্ছাসেবক অংশগ্রহণ"],
          details: [
            "সেমিনার ও মসজিদ ঘোষণার মাধ্যমে ৫০০+ কমিউনিটি সদস্যের কাছে সচেতনতা ক্যাম্পেইন সংগঠিত করা।",
            "জরুরি রক্ত সংগ্রহ ড্রাইভের জন্য স্থানীয় ব্লাড ব্যাংক ও হাসপাতালের সাথে সমন্বয় করা।",
            "জরুরি প্রয়োজনে সাড়া দেওয়ার জন্য ৪০+ নিয়মিত দাতার একটি স্বেচ্ছাসেবক নেটওয়ার্ক গড়ে তোলা।",
            "স্বেচ্ছায় রক্তদানের গুরুত্ব ও নিরাপত্তা নিয়ে স্বাস্থ্য শিক্ষা সেশন পরিচালনা।",
          ],
        },
        {
          title: "বৃক্ষরোপণ ও পরিবেশ সচেতনতা",
          tag: "পরিবেশ",
          tagColor: "from-emerald-500/30 to-emerald-700/20",
          desc: "পরিবেশগত স্থায়িত্ব এবং জলবায়ু ও পরিবেশগত দায়িত্ব সম্পর্কে কমিউনিটি সচেতনতা প্রচারের জন্য বৃক্ষরোপণ কার্যক্রমে অংশগ্রহণ ও সমন্বয় করা।",
          highlights: ["পরিবেশ সচেতনতা", "কমিউনিটি অংশগ্রহণ", "টেকসই উন্নয়ন"],
          details: [
            "ইউনিয়ন জুড়ে ২,০০০+ চারা রোপণ করে মৌসুমি বৃক্ষরোপণ ড্রাইভ সমন্বয় করা।",
            "সবুজ উদ্যোগে শিক্ষার্থী ও কমিউনিটি লিডারসহ ৩০০+ স্থানীয় স্বেচ্ছাসেবককে যুক্ত করা।",
            "জলবায়ু পরিবর্তন, বন উজাড় এবং পরিবেশগত দায়িত্ব নিয়ে সচেতনতা কর্মশালা পরিচালনা।",
            "টেকসই পরিবেশগত পদক্ষেপের জন্য স্থানীয় স্কুলের সাথে শিক্ষার্থী-নেতৃত্বাধীন ইকো-ক্লাব প্রতিষ্ঠায় সহযোগিতা করা।",
          ],
        },
        {
          title: "যুব নেতৃত্ব উন্নয়ন প্রোগ্রাম",
          tag: "যুব উন্নয়ন",
          tagColor: "from-amber-500/30 to-amber-600/20",
          desc: "তরুণদের মধ্যে নেতৃত্বের দক্ষতা, টিমওয়ার্ক, দায়িত্ববোধ এবং কমিউনিটি এনগেজমেন্ট বিকাশের জন্য যুব-কেন্দ্রিক কার্যক্রম, আলোচনা ও সাংগঠনিক প্রোগ্রাম পরিচালনা।",
          highlights: ["নেতৃত্ব প্রশিক্ষণ", "টিম বিল্ডিং", "যুব উন্নয়ন"],
          details: [
            "ত্রিশাল জুড়ে ২০০+ তরুণ অংশগ্রহণকারীর জন্য নেতৃত্ব কর্মশালা ডিজাইন ও পরিচালনা।",
            "প্রজেক্ট প্ল্যানিং, পাবলিক স্পিকিং এবং সাংগঠনিক ব্যবস্থাপনায় যুব গ্রুপগুলিকে মেন্টরিং করা।",
            "টিম-বিল্ডিং রিট্রিট এবং সহযোগিতামূলক সমস্যা সমাধান সেশন সংগঠিত করা।",
            "একটি যুব নেতৃত্ব পাইপলাইন তৈরি করা যা ১৫+ তরুণ নেতাকে কমিউনিটি অর্গানাইজিং রোলে স্থাপন করেছে।",
          ],
        },
        {
          title: "শিক্ষামূলক ও কমিউনিটি আউটরিচ",
          tag: "শিক্ষা",
          tagColor: "from-sky-500/30 to-sky-700/20",
          desc: "শিক্ষার্থী ও স্থানীয় কমিউনিটিকে সহায়তার জন্য শিক্ষাগত নির্দেশনা প্রোগ্রাম, কমিউনিটি সার্ভিস উদ্যোগ, গণসম্পৃক্ততা কার্যক্রম এবং সচেতনতা ক্যাম্পেইন সমর্থন করা।",
          highlights: ["শিক্ষাগত সহায়তা", "কমিউনিটি এনগেজমেন্ট", "সচেতনতা সৃষ্টি"],
          details: [
            "অনগ্রসর ব্যাকগ্রাউন্ডের ১৫০+ শিক্ষার্থীকে একাডেমিক গাইডেন্স ও ক্যারিয়ার কাউন্সেলিং প্রদান।",
            "স্বাস্থ্য, পরিচ্ছন্নতা ও নাগরিক দায়িত্ব নিয়ে কমিউনিটি সচেতনতা ক্যাম্পেইন সংগঠিত করা।",
            "কমিউনিটি সদস্যদের সাথে স্থানীয় সরকারি সেবা সংযোগকারী গণসম্পৃক্ততা ফোরাম পরিচালনা।",
            "ইউনিয়ন জুড়ে প্রয়োজনীয় শিক্ষার্থীদের মধ্যে শিক্ষামূলক উপকরণ ও স্কুল সরবরাহ বিতরণ।",
          ],
        },
        {
          title: "দক্ষতা উন্নয়ন ও কর্মসংস্থান সহায়তা",
          tag: "দক্ষতা উন্নয়ন",
          tagColor: "from-violet-500/30 to-violet-700/20",
          desc: "যুব ও কমিউনিটি সদস্যদের জন্য দক্ষতা উন্নয়ন কর্মশালা এবং ক্যারিয়ার গাইডেন্স প্রোগ্রাম সংগঠিত করা। ব্যক্তিদের আত্মনির্ভরশীল ও আত্মবিশ্বাসী হতে সাহায্য করার জন্য ব্যবহারিক দক্ষতা, ডিজিটাল লিটারেসি, যোগাযোগ এবং কর্মসংস্থান ক্ষমতার উপর ফোকাস করা।",
          highlights: [
            "দক্ষতা প্রশিক্ষণ",
            "ক্যারিয়ার গাইডেন্স",
            "কর্মসংস্থান সহায়তা",
            "ডিজিটাল লিটারেসি",
            "আত্মনির্ভরশীলতা",
          ],
          details: [
            "ডিজিটাল লিটারেসি, যোগাযোগ এবং মৌলিক কম্পিউটার দক্ষতায় ভোকেশনাল স্কিল কর্মশালা পরিচালনা।",
            "১০০+ চাকরিপ্রত্যাশী যুবকের জন্য একের পর এক ক্যারিয়ার কাউন্সেলিং সেশন প্রদান।",
            "ইন্টার্নশিপ ও অ্যাপ্রেন্টিসশিপ সুযোগ তৈরিতে স্থানীয় ব্যবসার সাথে অংশীদারিত্ব।",
            "প্রথমবার চাকরিপ্রার্থীদের জন্য রিজিউমি-বিল্ডিং এবং ইন্টারভিউ-প্রস্তুতি কর্মশালা সংগঠিত করা।",
          ],
        },
        {
          title: "কমিউনিটি কল্যাণ ও সামাজিক সহায়তা",
          tag: "সামাজিক কল্যাণ",
          tagColor: "from-orange-500/30 to-orange-600/20",
          desc: "মানবিক কার্যক্রম, জরুরি সহায়তা, খাদ্য বিতরণ এবং সামাজিক সহায়তা উদ্যোগের মাধ্যমে সুবিধাবঞ্চিত পরিবার ও স্থানীয় কমিউনিটিকে সহায়তা করা। সম্মিলিত দায়িত্ব ও সেবার মাধ্যমে একটি শক্তিশালী, আরও সহানুভূতিশীল কমিউনিটি গড়ে তোলার উপর ফোকাস করা।",
          highlights: [
            "মানবিক সহায়তা",
            "কমিউনিটি সার্ভিস",
            "জরুরি সহায়তা",
            "সামাজিক কল্যাণ",
            "দাতব্য উদ্যোগ",
          ],
          details: [
            "দুর্দশার সময় ৩০০+ সুবিধাবঞ্চিত পরিবারের কাছে খাদ্য বিতরণ ড্রাইভ পরিচালনা।",
            "সংকটে থাকা পরিবারের জন্য নগদ ও সরবরাহসহ জরুরি ত্রাণ প্রচেষ্টা সমন্বয় করা।",
            "দুর্বল কমিউনিটির জন্য শীতবস্ত্র ও কম্বল সংগ্রহ ক্যাম্পেইন সংগঠিত করা।",
            "প্রকৃত প্রয়োজনীয় পরিবারের সাথে দাতাদের সংযোগকারী একটি কমিউনিটি সহায়তা নেটওয়ার্ক প্রতিষ্ঠা।",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "গ্যালারি",
      title1: "মাঠের",
      title2: "মুহূর্ত",
      description: "কমিউনিটি প্রোগ্রাম, পাবলিক ইভেন্ট এবং গ্রাসরুট নেতৃত্বের স্মরণীয় মুহূর্ত।",
      captions: [
        "কমিউনিটি মিটিং",
        "যুব সম্মেলন ২০২৪",
        "শিক্ষা ড্রাইভ",
        "বৃক্ষরোপণ",
        "পাবলিক বক্তব্য",
      ],
    },
    leadership: {
      eyebrow: "নেতৃত্ব ও রাজনীতি",
      title1: "পাবলিক সার্ভিস,",
      title2: "পুনর্কল্পিত",
      description:
        "বর্তমানে বাংলাদেশ জামায়াতে ইসলামীর ১০ নং মাঠবাড়ি ইউনিয়ন যুব শাখার সভাপতি হিসেবে দায়িত্ব পালন করছেন, সাংগঠনিক নেতৃত্বের সাফল্যের প্রমাণসহ।",
      roles: [
        {
          title: "সভাপতি",
          org: "বাংলাদেশ জামায়াতে ইসলামী",
          unit: "১০ নং মাঠবাড়ি ইউনিয়ন যুব শাখা, ত্রিশাল",
          period: "বর্তমান",
          description:
            "ইউনিয়ন জুড়ে যুব এনগেজমেন্ট, কমিউনিটি আউটরিচ এবং গ্রাসরুট উন্নয়ন উদ্যোগের নেতৃত্ব দিচ্ছেন।",
        },
        {
          title: "সাবেক সেক্রেটারি",
          org: "বাংলাদেশ ইসলামী ছাত্রশিবির",
          unit: "ত্রিশাল উপজেলা শাখা",
          period: "২০২৩ – ২০২৫",
          description:
            "উপজেলা পর্যায়ে সাংগঠনিক কার্যক্রম, যুব প্রোগ্রাম এবং প্রশাসনিক কার্যক্রম পরিচালনা করেছেন।",
        },
      ],
      futureVision: "ভবিষ্যত দৃষ্টি",
      tooltip: "নেতৃত্বই সেবা।",
      modalTitle: "দৃষ্টি বিবৃতি",
      modalSubtitle: "নেতৃত্বের দর্শন",
      modalClose: "বন্ধ করুন",
      quote:
        "একটি কমিউনিটি যেখানে প্রতিটি তরুণ ব্যক্তি উদ্দেশ্য খুঁজে পায়, প্রতিটি পরিবার সমর্থন পায় এবং প্রতিটি কণ্ঠস্বর প্রতিনিধিত্ব পায় — সততার উপর নির্মিত, সেবা দ্বারা চালিত এবং ঈমান দ্বারা পরিচালিত।",
    },
    contact: {
      eyebrow: "যোগাযোগ",
      title1: "চলুন",
      title2: "একসাথে গড়ি",
      description:
        "একটি কমিউনিটি উদ্বেগ, একটি অংশীদারিত্বের ধারণা, বা একটি মিডিয়া অনুরোধ — আমি আপনার কাছ থেকে শুনতে চাই।",
      labels: {
        email: "ইমেইল",
        phone: "ফোন",
        whatsapp: "হোয়াটসঅ্যাপ",
        office: "অফিস",
        facebook: "ফেসবুক",
      },
      values: {
        email: "kholilebrahim2005@gmail.com",
        phone: "+৮৮০ ১৮৪৬-৮২৭৯৭৮",
        whatsapp: "০১৮৪৬৮২৭৯৭৮",
        office: "মাঠবাড়ি ইউনিয়ন, ত্রিশাল, ময়মনসিংহ",
        facebook: "মোঃ ইব্রাহীম খলিল",
      },
      formName: "নাম",
      formEmail: "ইমেইল",
      formSubject: "বিষয়",
      formMessage: "বার্তা",
      sendMessage: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে...",
      successTitle: "বার্তা পাঠানো হয়েছে!",
      successText: "আপনার যোগাযোগের জন্য ধন্যবাদ। আমি যত তাড়াতাড়ি সম্ভব আপনার কাছে ফিরে আসব।",
      dismiss: "বন্ধ করুন",
      errorDefault: "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      facebookAria: "ফেসবুক",
      linkedinAria: "লিংকডইন",
      whatsappAria: "হোয়াটসঅ্যাপ",
    },
    stats: {
      programs: { label: "কমিউনিটি প্রোগ্রাম", suffix: "+" },
      projects: { label: "প্রকল্প সম্পন্ন", suffix: "+" },
      volunteers: { label: "স্বেচ্ছাসেবক ব্যবস্থাপিত", suffix: "+" },
      service: { label: "সেবার বছর", suffix: "" },
      events: { label: "পাবলিক ইভেন্ট", suffix: "+" },
    },
    testimonials: {
      eyebrow: "প্রশংসাপত্র",
      title1: "মানুষের",
      title2: "কথা",
      quotes: [
        {
          text: "নেতৃত্ব ক্ষমতা সম্পর্কে নয়, এটি মানুষের প্রতি দায়িত্ব এবং সেবা সম্পর্কে।",
          name: "অনুপ্রাণিত নেতৃত্ব চিন্তা",
        },
        {
          text: "নিজেকে খুঁজে পাওয়ার সর্বোত্তম উপায় হল অন্যদের সেবায় নিজেকে বিলিয়ে দেওয়া।",
          name: "কমিউনিটি নেতৃত্ব দর্শন",
        },
        {
          text: "প্রকৃত সাফল্য সমাজে আপনি যে ইতিবাচক প্রভাব তৈরি করেন তা দ্বারা পরিমাপ করা হয়।",
          name: "পাবলিক সার্ভিস রিফ্লেকশন",
        },
        { text: "একজন নেতা তিনিই যিনি পথ জানেন, পথে চলেন এবং পথ দেখান।", name: "নেতৃত্বের নীতি" },
      ],
    },
    footer: {
      copyright: "ইব্রাহীম খলিল। ত্রিশাল, ময়মনসিংহের মানুষের জন্য নির্মিত।",
      location: "ত্রিশাল · টাঙ্গাইল · ময়মনসিংহ · বাংলাদেশ",
    },
    error: {
      "404title": "৪০৪",
      "404heading": "পৃষ্ঠা পাওয়া যায়নি",
      "404desc": "আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।",
      goHome: "হোম পেজে যান",
      errorHeading: "এই পৃষ্ঠাটি লোড হয়নি",
      errorDesc:
        "আমাদের পক্ষ থেকে কিছু ভুল হয়েছে। আপনি রিফ্রেশ করতে পারেন বা হোম পেজে ফিরে যেতে পারেন।",
      tryAgain: "আবার চেষ্টা করুন",
    },
    meta: {
      description:
        "ইব্রাহীম খলিল — ত্রিশাল, ময়মনসিংহের একজন শিক্ষার্থী, মার্কেটিং অফিসার ও যুব নেতা।",
    },
    ghost: {
      clickMe: "ক্লিক করুন",
      tapToReveal: "টাচ করে দেখুন...",
    },
    pageLoader: {
      loading: "লোড হচ্ছে",
    },
    interactions: {
      educationAria: "শিক্ষা — জ্ঞান একটি জীবনব্যাপী যাত্রা",
      educationText: "জ্ঞান একটি জীবনব্যাপী যাত্রা।",
      experienceAria: "অভিজ্ঞতা — প্রতিটি অভিজ্ঞতা নেতৃত্ব গড়ে তোলে",
      experienceText: "প্রতিটি অভিজ্ঞতা নেতৃত্ব গড়ে তোলে।",
      galleryAria: "গ্যালারি — যাত্রার মুহূর্তগুলো",
      galleryText: "যাত্রার মুহূর্তগুলো।",
      achievementsAria: "অর্জন — ধারাবাহিকতা সাফল্য তৈরি করে",
      achievementsText: "ধারাবাহিকতা সাফল্য তৈরি করে।",
      contactAria: "যোগাযোগ — সংযোগ স্থাপন করি",
      contactText: "সংযোগ স্থাপন করি।",
      communityAria: "সমাজসেবা — ছোট পদক্ষেপ বড় প্রভাব ফেলে",
      communityText: "ছোট পদক্ষেপ বড় প্রভাব ফেলে।",
      testimonialsAria: "প্রশংসাপত্র — আস্থার কণ্ঠস্বর",
      testimonialsText: "আস্থার কণ্ঠস্বর।",
      leadershipAria: "নেতৃত্ব — নেতৃত্বই সেবা",
    },
  },
};

type TranslationValue = string | string[] | Record<string, unknown>;

type NestedTranslations = {
  [key: string]: TranslationValue | NestedTranslations;
};

function getNested(obj: NestedTranslations, path: string): TranslationValue | undefined {
  const keys = path.split(".");
  let current: NestedTranslations | string | string[] | undefined = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) return undefined;
    current = current[key] as NestedTranslations | string | string[] | undefined;
    if (current === undefined) return undefined;
  }
  return current;
}

export function useTranslation() {
  const { language } = useLanguage();
  const t = (key: string): string => {
    const value = getNested(translations[language] as unknown as NestedTranslations, key);
    if (typeof value === "string") return value;
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };
  const tArray = (key: string): string[] => {
    const value = getNested(translations[language] as unknown as NestedTranslations, key);
    if (Array.isArray(value)) return value;
    return [];
  };
  const tObject = <T,>(key: string): T => {
    const value = getNested(translations[language] as unknown as NestedTranslations, key);
    return typeof value === "object" && value !== null ? (value as T) : ({} as T);
  };
  return { t, tArray, tObject };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
    if (stored === "en" || stored === "bn") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  };

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
