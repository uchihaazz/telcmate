// Import the sample Reading Teil 3 exercise
import { sampleReadingPart3 } from "./sample-reading-part3"

// Default exercise data to initialize the application
const exercises = [
  // Reading Exercises
  {
    id: "reading-part1-1",
    type: "reading",
    part: "part1",
    title: "Reading Part 1: Title Matching",
    description: "Match the titles to the appropriate texts. Each title can only be used once.",
    timeLimit: 15, // minutes
    texts: [
      {
        content:
          "The city council announced yesterday that it will be implementing a new recycling program starting next month. Residents will receive three separate bins for different types of waste: one for paper and cardboard, one for plastics and metals, and one for organic waste. The council hopes this initiative will reduce landfill waste by up to 40% within the first year.",
        correctTitle: "New Waste Management System",
      },
      {
        content:
          "A recent study conducted by the University of Berlin has found that people who spend at least 30 minutes per day reading have significantly lower stress levels compared to non-readers. The research, which followed 500 participants over six months, also indicated improved sleep quality and better concentration among regular readers.",
        correctTitle: "Reading Reduces Stress",
      },
      {
        content:
          "Starting from January, all public transportation in the city center will be free of charge for residents. This measure aims to reduce traffic congestion and air pollution in the downtown area. Visitors and non-residents will still need to purchase tickets, but at reduced rates compared to current prices.",
        correctTitle: "Free Public Transport Initiative",
      },
      {
        content:
          "The annual food festival will take place this weekend at Central Park. Over 50 local restaurants will participate, offering a wide variety of cuisines from around the world. Live music performances and cooking demonstrations are also scheduled throughout the three-day event.",
        correctTitle: "International Food Festival",
      },
      {
        content:
          "Scientists at the National Weather Institute have predicted that this winter will be one of the coldest in the last decade. Temperatures are expected to drop significantly below average, with increased snowfall in northern and central regions. Residents are advised to prepare accordingly and check on elderly neighbors during extreme weather conditions.",
        correctTitle: "Severe Winter Weather Forecast",
      },
    ],
    titles: [
      "New Waste Management System",
      "Reading Reduces Stress",
      "Free Public Transport Initiative",
      "International Food Festival",
      "Severe Winter Weather Forecast",
      "Digital Literacy Program",
      "Healthcare Reform Proposal",
    ],
  },
  {
    id: "reading-part1-2",
    type: "reading",
    part: "part1",
    title: "Reading Part 1: News Articles",
    description: "Match the headlines to the appropriate news articles. Each headline can only be used once.",
    timeLimit: 15, // minutes
    texts: [
      {
        content:
          "After years of debate, the city has finally approved plans for a new bridge connecting the east and west sides of the river. Construction is set to begin next spring and is expected to take approximately two years to complete. The €45 million project will include dedicated lanes for cyclists and pedestrians, as well as improved public transportation connections.",
        correctTitle: "Major Infrastructure Project Approved",
      },
      {
        content:
          "Local resident Maria Schmidt was honored yesterday for her extraordinary community service. Over the past decade, Schmidt has volunteered more than 5,000 hours at the community center, organized food drives for the homeless, and established a mentoring program for at-risk youth. 'I just want to make our neighborhood a better place,' Schmidt said during the ceremony.",
        correctTitle: "Volunteer Receives Civic Award",
      },
      {
        content:
          "The university's research team has developed a new method for detecting early signs of a rare genetic disorder. The breakthrough could allow for treatment to begin months or even years earlier than currently possible, potentially improving outcomes for thousands of patients worldwide. Clinical trials are expected to begin next year.",
        correctTitle: "Medical Breakthrough Announced",
      },
      {
        content:
          "The historic theater that has stood in the town center for over a century will undergo extensive renovations starting next month. The €2.5 million project will restore the original architectural features while updating the sound system, seating, and accessibility. The theater is expected to reopen in time for the annual arts festival in September.",
        correctTitle: "Historic Venue to Be Restored",
      },
      {
        content:
          "A new study by environmental scientists has found concerning levels of microplastics in the city's drinking water supply. While officials maintain that the water meets all current safety standards, they have announced plans to upgrade filtration systems at treatment plants. Environmental groups are calling for stricter regulations on plastic waste disposal.",
        correctTitle: "Water Quality Concerns Emerge",
      },
    ],
    titles: [
      "Major Infrastructure Project Approved",
      "Volunteer Receives Civic Award",
      "Medical Breakthrough Announced",
      "Historic Venue to Be Restored",
      "Water Quality Concerns Emerge",
      "New Educational Initiative Launched",
      "Local Business Expansion Creates Jobs",
    ],
  },
  {
    id: "reading-part2-1",
    type: "reading",
    part: "part2",
    title: "Reading Part 2: Multiple Choice",
    description: "Read the text and answer the multiple-choice questions that follow.",
    timeLimit: 20, // minutes
    content:
      "The concept of remote work has undergone a dramatic transformation in recent years. Once considered a rare perk offered by progressive companies, working from home has now become mainstream across many industries. The COVID-19 pandemic accelerated this shift, forcing organizations worldwide to rapidly adapt to distributed work models.\n\nStudies conducted before the pandemic suggested that remote workers were often more productive than their office-based counterparts. A 2015 Stanford study found that remote workers showed a 13% performance increase, attributed to fewer distractions and more comfortable work environments. However, the mass transition to remote work during the pandemic revealed both benefits and challenges.\n\nOn the positive side, many employees report better work-life balance, reduced commuting stress, and greater autonomy over their schedules. Companies have also recognized potential cost savings from reduced office space requirements. Environmental benefits include decreased traffic congestion and lower carbon emissions from commuting.\n\nHowever, challenges have emerged as well. Many workers report feelings of isolation and disconnection from colleagues. Collaboration can be more difficult without face-to-face interaction, and some employees struggle with maintaining boundaries between work and personal life when both occur in the same space. Additionally, not all homes are equally suitable for productive work, creating potential inequalities among employees.\n\nAs we move forward, a hybrid model combining remote and in-office work appears to be gaining popularity. This approach aims to capture the benefits of both worlds: the flexibility and focus of remote work alongside the collaboration and social connection of office environments. Organizations are reimagining office spaces as collaboration hubs rather than daily work locations.\n\nThe long-term implications of this shift remain to be seen, but it's clear that the traditional concept of work has been permanently altered. Both employers and employees are now rethinking fundamental aspects of work: where it happens, when it happens, and how success is measured.",
    questions: [
      "According to the text, what was the main factor that accelerated the shift to remote work?",
      "What percentage performance increase did the Stanford study find in remote workers?",
      "Which of the following is NOT mentioned as a benefit of remote work?",
      "What challenge of remote work relates to personal space?",
      "What model is described as gaining popularity for the future of work?",
    ],
    options: [
      [
        "Technological advancements",
        "The COVID-19 pandemic",
        "Cost-saving initiatives by companies",
        "Environmental concerns",
      ],
      ["5%", "13%", "20%", "25%"],
      ["Better work-life balance", "Reduced commuting stress", "Higher salaries", "Greater autonomy"],
      [
        "Difficulty maintaining work-life boundaries",
        "Lack of proper equipment",
        "Increased utility costs",
        "Limited internet access",
      ],
      ["Fully remote model", "Traditional office model", "Hybrid model", "Flexible hours model"],
    ],
    correctAnswers: [1, 1, 2, 0, 2],
  },
  {
    id: "reading-part2-2",
    type: "reading",
    part: "part2",
    title: "Reading Part 2: Science Article",
    description: "Read the article about renewable energy and answer the multiple-choice questions.",
    timeLimit: 20, // minutes
    content:
      "Renewable energy sources have seen unprecedented growth over the past decade, transforming the global energy landscape. Solar and wind power, once considered expensive alternatives to fossil fuels, have become increasingly cost-competitive and are now the cheapest form of electricity in many regions worldwide.\n\nThis transformation has been driven by several factors. Technological improvements have dramatically increased efficiency while reducing manufacturing costs. Government policies, including subsidies and renewable energy targets, have created favorable market conditions. Growing public concern about climate change has also increased demand for clean energy solutions from both consumers and investors.\n\nSolar photovoltaic (PV) technology has experienced particularly remarkable progress. The cost of solar panels has fallen by approximately 90% since 2010, making solar energy accessible to millions more people. Innovations in panel design, including bifacial modules that can capture sunlight reflected off the ground, continue to improve efficiency rates.\n\nWind power has undergone similar advancements. Modern wind turbines are taller, with longer blades and more sophisticated control systems than their predecessors, allowing them to generate electricity even in areas with moderate wind speeds. Offshore wind farms, though more expensive to build, can harness stronger and more consistent winds, producing more electricity per turbine.\n\nHowever, the intermittent nature of these renewable sources presents challenges for grid stability. Solar panels only generate electricity during daylight hours, and wind turbines require appropriate wind conditions. This variability necessitates either energy storage solutions or backup power sources to ensure reliable electricity supply.\n\nBattery storage technology is advancing rapidly to address this issue. Lithium-ion batteries, similar to those used in electric vehicles, are increasingly being deployed alongside renewable installations. Other storage technologies, including pumped hydro, compressed air, and emerging options like hydrogen, are also being developed and implemented.\n\nThe transition to renewable energy is not merely a technological shift but also an economic one. The renewable energy sector now employs over 11 million people globally, with job growth outpacing many traditional industries. As countries and companies commit to carbon neutrality goals, investment in renewable infrastructure continues to accelerate.\n\nDespite this progress, significant challenges remain. Integrating high percentages of variable renewable energy into existing grids requires substantial infrastructure upgrades. Some renewable technologies still rely on rare earth elements and other materials with their own environmental and supply chain concerns. Additionally, the transition away from fossil fuels must be managed carefully to support communities currently dependent on these industries.\n\nNevertheless, the momentum behind renewable energy appears unstoppable. With continued technological innovation, supportive policies, and growing investment, renewable sources are projected to supply the majority of the world's electricity within the coming decades, playing a crucial role in addressing climate change while meeting humanity's energy needs.",
    questions: [
      "According to the text, what is the primary reason solar and wind power have become more competitive?",
      "By approximately what percentage have solar panel costs fallen since 2010?",
      "What is described as the main challenge of renewable energy sources like solar and wind?",
      "Which of the following is NOT mentioned as a storage solution for renewable energy?",
      "How many people does the renewable energy sector employ globally, according to the text?",
    ],
    options: [
      [
        "Government subsidies alone",
        "Public concern about climate change",
        "Multiple factors including technological improvements and favorable policies",
        "Reduced demand for electricity",
      ],
      ["50%", "75%", "90%", "99%"],
      [
        "High installation costs",
        "Intermittent nature affecting grid stability",
        "Land use requirements",
        "Public opposition",
      ],
      ["Lithium-ion batteries", "Pumped hydro", "Compressed air", "Nuclear fusion"],
      ["5 million", "11 million", "20 million", "50 million"],
    ],
    correctAnswers: [2, 2, 1, 3, 1],
  },
  {
    id: "reading-part3-1",
    type: "reading",
    part: "part3",
    title: "Reading Part 3: Gap-Filling",
    description: "Read the text and fill in the gaps with the appropriate sentences from the list.",
    timeLimit: 25, // minutes
    content: [
      "The history of coffee dates back to the 15th century, and possibly earlier with a number of reports and legends surrounding its first use.",
      "___1___",
      "The earliest credible evidence of coffee-drinking appears in the middle of the 15th century in the Sufi shrines of Yemen.",
      "___2___",
      "Coffee seeds were first exported from East Africa to Yemen, as the coffee plant is not native to the Arabian Peninsula.",
      "___3___",
      "Once coffee became popular in Yemen, it quickly spread to Egypt and North Africa, and by the 16th century, it had reached the rest of the Middle East, Persia and Turkey.",
      "___4___",
      "The first European coffee house opened in Venice in 1645, and soon these establishments became centers of social interaction and communication.",
      "___5___",
      "Today, coffee is one of the most popular beverages worldwide, with billions of cups consumed daily.",
    ],
    sentences: [
      "The plant was first cultivated in Yemen around the 14th century.",
      "From there, it spread to Italy and then to the rest of Europe, Indonesia, and the Americas.",
      "The earliest substantiated evidence of either coffee drinking or knowledge of the coffee tree is from the early 15th century, in the Sufi monasteries of Yemen.",
      "In these public coffee houses, people would gather to drink coffee, discuss politics, play games like chess, and listen to music.",
      "It was in Arabia that coffee seeds were first roasted and brewed in a similar way to how it is prepared now.",
      "Coffee cultivation and trade began on the Arabian Peninsula.",
      "The word 'coffee' entered the English language in 1582 via the Dutch 'koffie', borrowed from the Ottoman Turkish 'kahve'.",
    ],
    correctAnswers: [2, 4, 0, 1, 3],
  },
  {
    id: "reading-part3-2",
    type: "reading",
    part: "part3",
    title: "Reading Part 3: Text Completion",
    description: "Read the text and fill in the gaps with the appropriate sentences from the list.",
    timeLimit: 25, // minutes
    content: [
      "Artificial Intelligence (AI) has rapidly evolved from a niche research field to a technology that impacts our daily lives in countless ways.",
      "___1___",
      "Machine learning, a subset of AI, enables computers to learn from data and improve their performance without explicit programming.",
      "___2___",
      "Natural Language Processing (NLP) allows machines to understand, interpret, and generate human language.",
      "___3___",
      "Computer vision enables machines to interpret and make decisions based on visual information, similar to human vision.",
      "___4___",
      "As AI continues to advance, ethical considerations become increasingly important.",
      "___5___",
      "Despite these challenges, AI holds tremendous potential to solve complex problems and improve human life in areas ranging from healthcare to climate science.",
    ],
    sentences: [
      "This technology powers many applications we use daily, from recommendation systems on streaming platforms to fraud detection in banking.",
      "Questions about privacy, bias, job displacement, and autonomous decision-making must be addressed as these technologies become more integrated into society.",
      "The term 'artificial intelligence' was first coined in 1956 at a conference at Dartmouth College, where the founding researchers predicted that machines would soon be capable of any work that humans can do.",
      "This technology has revolutionized how we interact with devices, enabling voice assistants, automatic translation, and sophisticated text analysis.",
      "Applications include facial recognition, autonomous vehicles, medical image analysis, and augmented reality.",
      "Recent advances in deep learning have dramatically improved AI capabilities, leading to breakthroughs in various domains.",
      "The development of general artificial intelligence, which would match or exceed human intelligence across all domains, remains a distant but influential goal in the field.",
    ],
    correctAnswers: [2, 0, 3, 4, 1],
  },
  {
    id: "reading-part3-3",
    type: "reading",
    part: "part3",
    title: "Reading Part 3: Technology Article",
    description: "Read the text and fill in the gaps with the appropriate sentences from the list.",
    timeLimit: 25, // minutes
    content: [
      "The Internet of Things (IoT) is rapidly transforming how we interact with the world around us.",
      "___1___",
      "These connected devices collect and exchange data through the internet, enabling them to be remotely monitored and controlled.",
      "___2___",
      "Smart homes represent one of the most visible applications of IoT technology in everyday life.",
      "___3___",
      "In healthcare, IoT devices like wearable fitness trackers and remote monitoring systems are revolutionizing patient care.",
      "___4___",
      "The industrial sector has also embraced IoT through what is often called Industry 4.0.",
      "___5___",
      "As IoT continues to evolve, addressing security and privacy concerns will be crucial for its sustainable growth and adoption.",
    ],
    sentences: [
      "From smart thermostats to connected refrigerators, these technologies allow homeowners to control their environment, improve energy efficiency, and enhance security.",
      "The term refers to the billions of physical devices around the world that are now connected to the internet.",
      "This connectivity creates opportunities for more direct integration between the physical world and computer-based systems.",
      "These devices enable healthcare providers to monitor patients remotely and can alert both patients and medical professionals to potential health issues before they become serious.",
      "Smart factories use connected sensors and automated systems to monitor production processes, predict maintenance needs, and optimize supply chains.",
      "Many IoT devices collect sensitive personal data, raising concerns about how this information is stored, used, and protected.",
      "The concept was first proposed in the late 1990s but has only become technically and economically feasible in the last decade.",
    ],
    correctAnswers: [1, 2, 0, 3, 4],
  },
  {
    id: "reading-part3-4",
    type: "reading",
    part: "part3",
    title: "Reading Teil 3: Title-Text Matching",
    description: "Match each title with the appropriate text. Some titles do not match any text (mark as X).",
    timeLimit: 25, // minutes
    titles: [
      "Sustainable Urban Planning",
      "Digital Privacy Concerns",
      "Modern Educational Methods",
      "Climate Change Solutions",
      "Healthcare Innovations",
      "Cultural Heritage Preservation",
      "Economic Growth Strategies",
    ],
    texts: [
      {
        content:
          "As cities continue to grow, urban planners are increasingly focusing on sustainability. New developments now often include green spaces, renewable energy sources, and efficient public transportation networks. The concept of the '15-minute city,' where residents can access all essential services within a short walk or bike ride, is gaining popularity worldwide.",
      },
      {
        content:
          "The rapid digitization of healthcare has led to remarkable improvements in patient care. From AI-assisted diagnostics to remote monitoring devices, technology is transforming how medical professionals detect, treat, and manage diseases. Personalized medicine, tailored to individual genetic profiles, promises more effective treatments with fewer side effects.",
      },
      {
        content:
          "With rising global temperatures and extreme weather events becoming more frequent, scientists and policymakers are working on multi-faceted approaches to address climate change. These include transitioning to renewable energy, developing carbon capture technologies, implementing more sustainable agricultural practices, and designing climate-resilient infrastructure.",
      },
      {
        content:
          "Traditional economic models focused primarily on GDP growth are being reconsidered in light of environmental and social concerns. New frameworks emphasize inclusive growth that benefits all segments of society while respecting planetary boundaries. Metrics beyond GDP, such as well-being indices and environmental impact assessments, are increasingly being used to measure true economic progress.",
      },
    ],
    correctMatches: ["text-0", "X", "X", "text-2", "text-1", "X", "text-3"],
  },
  sampleReadingPart3,

  // Listening Exercises
  {
    id: "listening-part1-1",
    type: "listening",
    part: "part1",
    title: "Listening Part 1: Short Conversations",
    description: "Listen to the audio and answer the 5 questions about the short conversations.",
    timeLimit: 10, // minutes
    audioUrl: "/audio/listening-part1-1.mp3",
    questions: [
      "What time does the woman agree to meet the man?",
      "What will the speakers order for dinner?",
      "What is the man's opinion about the hotel service?",
      "Which transportation method does the woman recommend?",
      "What do the speakers think about the movie they saw?",
    ],
    options: [
      ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
      ["Pizza", "Sushi", "Burgers", "Chinese food"],
      ["Excellent", "Satisfactory", "Poor", "Terrible"],
      ["Bus", "Train", "Taxi", "Subway"],
      ["It was excellent", "It was average", "It was disappointing", "They had different opinions"],
    ],
    correctAnswers: [1, 0, 2, 1, 2],
  },
  {
    id: "listening-part1-2",
    type: "listening",
    part: "part1",
    title: "Listening Part 1: Job Interview",
    description: "Listen to the audio about a job interview and answer the 5 questions.",
    timeLimit: 10, // minutes
    audioUrl: "/audio/listening-part1-2.mp3",
    questions: [
      "How many years of experience does the candidate have in marketing?",
      "What software knowledge is required for the position?",
      "What working arrangement does the company offer?",
      "Will the job require international travel?",
      "Is the starting salary negotiable?",
    ],
    options: [
      ["Three years", "Five years", "Seven years", "Ten years"],
      ["Microsoft Office only", "Graphic design software", "Programming languages", "Database management"],
      ["Fixed hours only", "Flexible working hours", "Part-time only", "Weekend work"],
      ["Yes, frequently", "Yes, occasionally", "No, only domestic travel", "No travel required"],
      ["Yes, based on experience", "No, it's fixed", "Only after probation", "Only for senior positions"],
    ],
    correctAnswers: [1, 1, 1, 3, 0],
  },
  {
    id: "listening-part2-1",
    type: "listening",
    part: "part2",
    title: "Listening Part 2: Workplace Dialogue",
    description: "Listen to a dialogue between two colleagues and answer the 10 questions.",
    timeLimit: 15, // minutes
    audioUrl: "/audio/listening-part2-1.mp3",
    transcript:
      "Woman: Hi Mark, have you heard about the new company policy on remote work?\nMan: Yes, I got the email yesterday. It seems like they want us to come back to the office three days a week starting next month.\nWoman: That's right. I'm actually quite happy about it. I've been finding it difficult to separate work from my personal life while working from home.\nMan: I understand that, but I've really enjoyed the flexibility. It's saved me two hours of commuting every day.\nWoman: That's true. The commute is definitely a downside. But I've missed the face-to-face collaboration with the team.\nMan: I agree that some meetings are more productive in person. But I think two days in the office would have been enough.\nWoman: Maybe. By the way, did you see they're also renovating the office space?\nMan: No, I missed that part. What are they changing?\nWoman: They're creating more meeting rooms and collaborative spaces, and reducing the number of fixed desks.\nMan: That makes sense if people are only coming in part-time. I guess they're trying to reduce their real estate costs too.\nWoman: Probably. They also mentioned something about new technology for hybrid meetings.\nMan: That would be helpful. Our current setup isn't great for including remote participants.\nWoman: Exactly. Oh, and they're also opening a new cafeteria with healthier food options.\nMan: Now that's good news! The old cafeteria food was terrible.\nWoman: I know! I always ended up bringing my own lunch.\nMan: Well, I'm still not thrilled about commuting again, but at least there are some positive changes.\nWoman: I think it will be a good balance once we adjust to the new routine.",
    questions: [
      "How many days per week will employees need to work from the office?",
      "Is the woman happy about returning to the office part-time?",
      "What has the man enjoyed about working from home?",
      "How many days does the man think would be enough to work from the office?",
      "What is happening to the number of fixed desks in the office?",
      "What new technology is the company investing in?",
      "Did both speakers like the food at the old cafeteria?",
      "Is the man enthusiastic about returning to the office?",
      "What is being created more of in the office renovation?",
      "What did the woman usually do about lunch at the office?",
    ],
    options: [
      ["Two days", "Three days", "Four days", "Five days"],
      ["Yes", "No", "She's neutral", "She didn't say"],
      ["No commuting", "Better food", "More privacy", "Flexible hours"],
      ["One day", "Two days", "Three days", "Four days"],
      ["Increasing", "Decreasing", "Staying the same", "Not mentioned"],
      ["New computers", "Technology for hybrid meetings", "Virtual reality", "Artificial intelligence"],
      ["Yes", "No", "Only the man did", "Only the woman did"],
      ["Yes", "No", "He's neutral", "He didn't say"],
      ["Meeting rooms", "Individual offices", "Cafeteria space", "Parking spaces"],
      ["Ate at the cafeteria", "Brought her own lunch", "Went out to restaurants", "Skipped lunch"],
    ],
    correctAnswers: [1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  },
  {
    id: "listening-part2-2",
    type: "listening",
    part: "part2",
    title: "Listening Part 2: University Lecture",
    description: "Listen to a university lecture about climate change and answer the 10 questions.",
    timeLimit: 15, // minutes
    audioUrl: "/audio/listening-part2-2.mp3",
    transcript:
      "Good morning, everyone. Today we're going to discuss climate change and its global impacts. Climate change refers to significant changes in global temperature, precipitation, wind patterns, and other measures of climate that occur over several decades or longer.\n\nThe primary cause of current climate change is human expansion of the greenhouse effect. When we burn fossil fuels like coal, oil, and natural gas, we release carbon dioxide and other greenhouse gases into the atmosphere. These gases trap heat and cause the planet's temperature to rise, a process known as global warming.\n\nThe evidence for rapid climate change is compelling. Global temperature has risen by about 1 degree Celsius since the late 19th century. The oceans have absorbed much of this increased heat, with the top 100 meters of ocean showing warming of more than 0.3 degrees Celsius since 1969. The Greenland and Antarctic ice sheets have decreased in mass, and glaciers are retreating almost everywhere around the world.\n\nThe effects of climate change are far-reaching and include more frequent and severe weather events, rising sea levels, and ecosystem disruption. For example, heat waves are becoming more common and intense, while cold waves are becoming less frequent. Precipitation patterns are changing, with some regions experiencing increased rainfall and flooding, while others face more severe droughts.\n\nRising sea levels pose a significant threat to coastal communities and island nations. Since 1880, the global sea level has risen by about 8-9 inches, with about a third of that occurring in just the last two and a half decades. This is primarily due to melting ice sheets and glaciers, as well as the thermal expansion of seawater as it warms.\n\nEcosystems worldwide are being affected by climate change. Many plant and animal species are shifting their geographic ranges and changing seasonal behaviors in response to warming temperatures. Some species will adapt successfully, but others may face extinction if they cannot adapt quickly enough.\n\nAddressing climate change requires both mitigation and adaptation strategies. Mitigation involves reducing greenhouse gas emissions through transitioning to renewable energy sources, improving energy efficiency, and protecting carbon sinks like forests. Adaptation involves adjusting to actual or expected climate change effects to moderate harm or exploit beneficial opportunities.\n\nInternational cooperation is essential for effective climate action. The Paris Agreement, adopted in 2015, aims to limit global warming to well below 2 degrees Celsius above pre-industrial levels, with efforts to limit the increase to 1.5 degrees. However, current national pledges are insufficient to meet these targets.\n\nIndividuals can also take action by reducing their carbon footprint through choices about transportation, diet, energy use, and consumption. While individual actions alone cannot solve the climate crisis, collective changes in behavior can make a significant difference.\n\nIn conclusion, climate change is one of the defining challenges of our time. It requires urgent action at all levels of society, from international agreements to individual choices. The decisions we make today will determine the world future generations will inherit.",
    questions: [
      "What is the primary cause of current climate change according to the lecture?",
      "By how much has the global temperature risen since the late 19th century?",
      "What has happened to the Greenland and Antarctic ice sheets?",
      "Which weather events are becoming more common and intense?",
      "How much has the global sea level risen since 1880?",
      "What is causing sea levels to rise?",
      "How are ecosystems being affected by climate change?",
      "What does mitigation of climate change involve?",
      "What is the goal of the Paris Agreement regarding temperature increase?",
      "Are current national pledges sufficient to meet the Paris Agreement targets?",
    ],
    options: [
      ["Natural climate cycles", "Solar radiation", "Human expansion of the greenhouse effect", "Volcanic activity"],
      ["0.5 degrees Celsius", "1 degree Celsius", "2 degrees Celsius", "3 degrees Celsius"],
      [
        "They have increased in mass",
        "They have decreased in mass",
        "They have remained stable",
        "Only Antarctic ice has decreased",
      ],
      ["Cold waves", "Heat waves", "All weather events equally", "Only precipitation"],
      ["2-3 inches", "4-5 inches", "8-9 inches", "12-13 inches"],
      [
        "Only melting ice sheets",
        "Only thermal expansion",
        "Both melting ice and thermal expansion",
        "Changes in ocean currents",
      ],
      [
        "They are unaffected",
        "Species are shifting ranges and changing behaviors",
        "Only plant species are affected",
        "Only animal species are affected",
      ],
      [
        "Only adapting to changes",
        "Reducing greenhouse gas emissions",
        "Only international agreements",
        "Only individual actions",
      ],
      [
        "Below 1 degree Celsius",
        "Below 1.5 degrees Celsius",
        "Well below 2 degrees Celsius",
        "Below 3 degrees Celsius",
      ],
      ["Yes", "No", "Only from developed countries", "Only from developing countries"],
    ],
    correctAnswers: [2, 1, 1, 1, 2, 2, 1, 1, 2, 1],
  },
  {
    id: "listening-part3-1",
    type: "listening",
    part: "part3",
    title: "Listening Part 3: News and Announcements",
    description: "Listen to the audio of news and announcements and answer the 6 questions.",
    timeLimit: 15, // minutes
    audioUrl: "/audio/listening-part3-1.mp3",
    questions: [
      "When will the main bridge be closed for renovations?",
      "What facility will the new community center include?",
      "Why has the local festival been canceled?",
      "What is the university offering to residents?",
      "By what percentage will public transportation fares increase next year?",
      "What new item will the recycling program now accept?",
    ],
    options: [
      ["Next week", "Next month", "Next year", "It won't be closed"],
      ["Swimming pool", "Basketball court", "Library", "Cafeteria"],
      ["Due to weather concerns", "Due to lack of funding", "Due to low ticket sales", "It hasn't been canceled"],
      ["Free language courses", "Discounted gym memberships", "Computer workshops", "Art classes"],
      ["5%", "10%", "15%", "Fares will not increase"],
      ["Glass containers", "Electronic devices", "Clothing", "Furniture"],
    ],
    correctAnswers: [1, 3, 0, 0, 3, 0],
  },
  {
    id: "listening-part3-2",
    type: "listening",
    part: "part3",
    title: "Listening Part 3: Public Announcements",
    description: "Listen to the audio of public announcements and answer the 6 questions.",
    timeLimit: 15, // minutes
    audioUrl: "/audio/listening-part3-2.mp3",
    questions: [
      "What time will the museum close today?",
      "Which platform has the train to Berlin been moved to?",
      "What should passengers do with their electronic devices during takeoff?",
      "What special exhibition is currently at the art gallery?",
      "How long will the maintenance work on the subway line last?",
      "What is the special offer at the department store today?",
    ],
    options: [
      ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"],
      ["Platform 3", "Platform 5", "Platform 7", "Platform 9"],
      ["Turn them off", "Switch to airplane mode", "Keep them in bags", "Continue using them"],
      ["Renaissance Paintings", "Modern Sculpture", "Impressionist Art", "Photography"],
      ["One day", "One weekend", "One week", "One month"],
      ["20% off all items", "Buy one get one free", "50% off selected items", "Free gift with purchase"],
    ],
    correctAnswers: [2, 3, 1, 0, 2, 2],
  },

  // Grammar Exercises
  {
    id: "grammar-part1-1",
    type: "grammar",
    part: "part1",
    title: "Grammar Part 1: Fill in the Blanks",
    description: "Choose the correct option to complete each sentence.",
    timeLimit: 15, // minutes
    textWithBlanks: [
      { type: "text", content: "If I " },
      { type: "blank", blankIndex: 0 },
      { type: "text", content: " more time, I would learn another language. " },
      { type: "text", content: "She " },
      { type: "blank", blankIndex: 1 },
      { type: "text", content: " in Berlin since 2015. " },
      { type: "text", content: "By the time we arrived, the movie " },
      { type: "blank", blankIndex: 2 },
      { type: "text", content: ". " },
      { type: "text", content: "I wish I " },
      { type: "blank", blankIndex: 3 },
      { type: "text", content: " how to swim when I was younger. " },
      { type: "text", content: "The report " },
      { type: "blank", blankIndex: 4 },
      { type: "text", content: " by Friday, so we can review it next week. " },
    ],
    blanks: [
      {
        options: ["have", "had", "would have", "having"],
      },
      {
        options: ["lives", "has lived", "lived", "is living"],
      },
      {
        options: ["already started", "has already started", "had already started", "would have already started"],
      },
      {
        options: ["learned", "would learn", "had learned", "have learned"],
      },
      {
        options: ["will complete", "will be completed", "completes", "is completing"],
      },
    ],
    correctAnswers: [1, 1, 2, 2, 1],
  },
  {
    id: "grammar-part1-2",
    type: "grammar",
    part: "part1",
    title: "Grammar Part 1: Verb Tenses",
    description: "Choose the correct verb tense to complete each sentence.",
    timeLimit: 15, // minutes
    textWithBlanks: [
      { type: "text", content: "By next month, I " },
      { type: "blank", blankIndex: 0 },
      { type: "text", content: " in this company for ten years. " },
      { type: "text", content: "When I arrived at the party, most of the guests " },
      { type: "blank", blankIndex: 1 },
      { type: "text", content: " already. " },
      { type: "text", content: "I " },
      { type: "blank", blankIndex: 2 },
      { type: "text", content: " to the cinema three times this month. " },
      { type: "text", content: "She " },
      { type: "blank", blankIndex: 3 },
      { type: "text", content: " tennis every Saturday morning. " },
      { type: "text", content: "If I " },
      { type: "blank", blankIndex: 4 },
      { type: "text", content: " the lottery, I would travel around the world. " },
    ],
    blanks: [
      {
        options: ["will work", "will have worked", "have worked", "am working"],
      },
      {
        options: ["leave", "had left", "have left", "were leaving"],
      },
      {
        options: ["go", "went", "have gone", "had gone"],
      },
      {
        options: ["plays", "is playing", "played", "has played"],
      },
      {
        options: ["win", "won", "would win", "had won"],
      },
    ],
    correctAnswers: [1, 1, 2, 0, 0],
  },
  {
    id: "grammar-part2-1",
    type: "grammar",
    part: "part2",
    title: "Grammar Part 2: Word Formation",
    description: "Drag and drop the correct word to complete each sentence.",
    timeLimit: 15, // minutes
    textWithBlanks: [
      { type: "text", content: "The " },
      { type: "blank", blankIndex: 0 },
      { type: "text", content: " of the new shopping center has created many jobs in the area. " },
      { type: "text", content: "Scientists are concerned about the " },
      { type: "blank", blankIndex: 1 },
      { type: "text", content: " of several animal species due to climate change. " },
      { type: "text", content: "The company offers excellent " },
      { type: "blank", blankIndex: 2 },
      { type: "text", content: " opportunities for all employees. " },
      { type: "text", content: "There has been significant " },
      { type: "blank", blankIndex: 3 },
      { type: "text", content: " in air quality since the new regulations were implemented. " },
      { type: "text", content: "The " },
      { type: "blank", blankIndex: 4 },
      { type: "text", content: " between the two countries has improved in recent years. " },
    ],
    blanks: [
      { correctWord: "construction" },
      { correctWord: "extinction" },
      { correctWord: "training" },
      { correctWord: "improvement" },
      { correctWord: "relationship" },
    ],
    wordBank: [
      "construction",
      "extinction",
      "training",
      "improvement",
      "relationship",
      "development",
      "disappearance",
      "education",
      "increase",
      "connection",
    ],
  },
  {
    id: "grammar-part2-2",
    type: "grammar",
    part: "part2",
    title: "Grammar Part 2: Prepositions",
    description: "Drag and drop the correct preposition to complete each sentence.",
    timeLimit: 15, // minutes
    textWithBlanks: [
      { type: "text", content: "She's been working " },
      { type: "blank", blankIndex: 0 },
      { type: "text", content: " this project since last month. " },
      { type: "text", content: "The restaurant is located " },
      { type: "blank", blankIndex: 1 },
      { type: "text", content: " the corner of Main Street and Park Avenue. " },
      { type: "text", content: "He's interested " },
      { type: "blank", blankIndex: 2 },
      { type: "text", content: " studying abroad next year. " },
      { type: "text", content: "The meeting was postponed " },
      { type: "blank", blankIndex: 3 },
      { type: "text", content: " Friday due to unforeseen circumstances. " },
      { type: "text", content: "She's afraid " },
      { type: "blank", blankIndex: 4 },
      { type: "text", content: " heights and refuses to go on roller coasters. " },
    ],
    blanks: [
      { correctWord: "on" },
      { correctWord: "at" },
      { correctWord: "in" },
      { correctWord: "until" },
      { correctWord: "of" },
    ],
    wordBank: ["on", "at", "in", "until", "of", "for", "by", "with", "to", "from"],
  },
  {
    id: "grammar-part3-1",
    type: "grammar",
    part: "part3",
    title: "Grammar Part 3: Error Correction",
    description: "Identify and correct the grammatical errors in each sentence.",
    timeLimit: 20, // minutes
    sentences: [
      "She don't like coffee in the morning.",
      "We discussed about the problem yesterday.",
      "If I would have known earlier, I would have helped you.",
      "The children has been playing outside all day.",
      "He is working here since 2010.",
      "I look forward to see you next week.",
      "She's one of the best student in the class.",
      "Neither John nor his brothers was at the meeting.",
      "The news are not good today.",
      "I've been to Paris three times last year.",
    ],
    correctSentences: [
      "She doesn't like coffee in the morning.",
      "We discussed the problem yesterday.",
      "If I had known earlier, I would have helped you.",
      "The children have been playing outside all day.",
      "He has been working here since 2010.",
      "I look forward to seeing you next week.",
      "She's one of the best students in the class.",
      "Neither John nor his brothers were at the meeting.",
      "The news is not good today.",
      "I went to Paris three times last year.",
    ],
    errorTypes: [
      "Subject-verb agreement",
      "Unnecessary preposition",
      "Conditional structure",
      "Subject-verb agreement",
      "Present perfect continuous tense",
      "Gerund after preposition",
      "Plural form needed",
      "Subject-verb agreement with 'neither...nor'",
      "Uncountable noun agreement",
      "Past simple vs present perfect",
    ],
  },
  {
    id: "grammar-part3-2",
    type: "grammar",
    part: "part3",
    title: "Grammar Part 3: Sentence Transformation",
    description: "Rewrite each sentence using the word in brackets, keeping the same meaning.",
    timeLimit: 20, // minutes
    sentences: [
      "It's possible that he will arrive late. (MIGHT)",
      "I'm sorry I didn't call you yesterday. (WISH)",
      "The last time I saw her was three years ago. (FOR)",
      "It isn't necessary for you to finish the report today. (HAVE)",
      "Despite the rain, we enjoyed our trip. (ALTHOUGH)",
      "They made him work overtime. (WAS)",
      "She suggested going to the beach. (THAT)",
      "I'm certain that he didn't steal the money. (POSSIBLY)",
      "The book was so interesting that I couldn't put it down. (SUCH)",
      "I regret telling her the truth. (WISH)",
    ],
    correctTransformations: [
      "He might arrive late.",
      "I wish I had called you yesterday.",
      "I haven't seen her for three years.",
      "You don't have to finish the report today.",
      "Although it was raining, we enjoyed our trip.",
      "He was made to work overtime.",
      "She suggested that we (should) go to the beach.",
      "He couldn't possibly have stolen the money.",
      "It was such an interesting book that I couldn't put it down.",
      "I wish I hadn't told her the truth.",
    ],
  },

  // Writing Exercises
  {
    id: "writing-part1-1",
    type: "writing",
    part: "part1",
    title: "Writing Part 1: Formal Email",
    description: "Write a formal email (approximately 150-200 words) based on the given situation.",
    timeLimit: 30, // minutes
    prompt:
      "You recently stayed at a hotel and were not satisfied with the service. Write an email to the hotel manager explaining your concerns and requesting some form of compensation. Include specific details about the problems you experienced.",
    evaluationCriteria: [
      "Task completion",
      "Organization and coherence",
      "Range of vocabulary",
      "Grammatical accuracy",
      "Register and format",
    ],
  },
  {
    id: "writing-part1-2",
    type: "writing",
    part: "part1",
    title: "Writing Part 1: Complaint Letter",
    description: "Write a formal letter of complaint (approximately 150-200 words) based on the given situation.",
    timeLimit: 30, // minutes
    prompt:
      "You purchased a new laptop online three weeks ago, but it has several technical problems. Write a letter to the customer service department describing the issues and requesting a replacement or refund. Include all relevant details about your purchase.",
    evaluationCriteria: [
      "Task completion",
      "Organization and coherence",
      "Range of vocabulary",
      "Grammatical accuracy",
      "Register and format",
    ],
  },
  {
    id: "writing-part2-1",
    type: "writing",
    part: "part2",
    title: "Writing Part 2: Essay",
    description: "Write an essay (approximately 250-300 words) expressing your opinion on the given topic.",
    timeLimit: 45, // minutes
    prompt:
      "Some people believe that technology has made our lives easier and more convenient, while others argue that it has created new problems and challenges. Discuss both views and give your own opinion.",
    evaluationCriteria: [
      "Task completion",
      "Organization and coherence",
      "Range of vocabulary",
      "Grammatical accuracy",
      "Development of ideas",
    ],
  },
  {
    id: "writing-part2-2",
    type: "writing",
    part: "part2",
    title: "Writing Part 2: Argumentative Essay",
    description: "Write an argumentative essay (approximately 250-300 words) on the given topic.",
    timeLimit: 45, // minutes
    prompt:
      "In many countries, the number of young people pursuing careers in science and technology is declining. What do you think are the causes of this trend, and what measures could be taken to encourage more students to choose these fields?",
    evaluationCriteria: [
      "Task completion",
      "Organization and coherence",
      "Range of vocabulary",
      "Grammatical accuracy",
      "Development of ideas",
    ],
  },
]

// Initialize exercises in localStorage
export function initializeExercises() {
  if (!localStorage.getItem("exercises")) {
    localStorage.setItem("exercises", JSON.stringify(exercises))
  }
}

// Get all exercises
export function getAllExercises() {
  const exercises = localStorage.getItem("exercises")
  return exercises ? JSON.parse(exercises) : []
}

// Get exercises by type
export function getExercisesByType(type) {
  const allExercises = getAllExercises()
  return allExercises.filter((exercise) => exercise.type === type)
}

// Get exercises by type and part
export function getExercisesByTypeAndPart(type, part) {
  const allExercises = getAllExercises()
  return allExercises.filter((exercise) => exercise.type === type && exercise.part === part)
}

// Get exercise by ID
export function getExerciseById(id) {
  const allExercises = getAllExercises()
  return allExercises.find((exercise) => exercise.id === id)
}

// Add a new exercise
export function addExercise(exercise) {
  const allExercises = getAllExercises()
  allExercises.push(exercise)
  localStorage.setItem("exercises", JSON.stringify(allExercises))
}

// Update an existing exercise
export function updateExercise(updatedExercise) {
  const allExercises = getAllExercises()
  const index = allExercises.findIndex((ex) => ex.id === updatedExercise.id)

  if (index !== -1) {
    allExercises[index] = updatedExercise
    localStorage.setItem("exercises", JSON.stringify(allExercises))
    return true
  }

  return false
}

// Delete an exercise
export function deleteExercise(id) {
  const allExercises = getAllExercises()
  const filteredExercises = allExercises.filter((ex) => ex.id !== id)

  if (filteredExercises.length < allExercises.length) {
    localStorage.setItem("exercises", JSON.stringify(filteredExercises))
    return true
  }

  return false
}
