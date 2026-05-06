// src/utils/LegalDatabase.js

export const legalDatabase = [
  {
    caseId: "CWJC-1024-2026",
    ubid: "IN-BR-PAT-HC-2026-1024",
    title: "State of Bihar vs. M/s Digital Infra",
    petitioner: "State of Bihar",
    respondent: "M/s Digital Infra",
    verdict: "Stay order granted against demolition.",
    tags: ["Land Dispute", "Stay Order", "Demolition"],
    actionPlan: {
      English: { directive: "Halt all demolition activities immediately in Sector 4.", department: "Revenue" },
      Hindi: { directive: "सेक्टर 4 में सभी विध्वंस गतिविधियों को तुरंत रोकें।", department: "राजस्व" },
      Marathi: { directive: "सेक्टर 4 मधील सर्व पाडकाम त्वरित थांबवा.", department: "महसूल" }
    }
  },
  {
    caseId: "Cr.W.-2045-2026",
    ubid: "IN-BR-PAT-HC-2026-2045",
    title: "Principal Secretary, Home Dept vs. Rameshwar Singh",
    petitioner: "Principal Secretary, Home Dept",
    respondent: "Rameshwar Singh",
    verdict: "Police protection ordered for 30 days.",
    tags: ["Service Matter", "Police Protection", "Bail"],
    actionPlan: {
      English: { directive: "Provide police protection to the petitioner for 30 days.", department: "Police" },
      Hindi: { directive: "याचिकाकर्ता को 30 दिनों के लिए पुलिस सुरक्षा प्रदान करें।", department: "पुलिस" },
      Marathi: { directive: "अर्जदाराला ३० दिवसांसाठी पोलीस संरक्षण द्या.", department: "पोलीस" }
    }
  },
  {
    caseId: "LPA-3088-2026",
    ubid: "IN-BR-PAT-HC-2026-3088",
    title: "Finance Dept, Govt of Bihar vs. Apex Corp",
    petitioner: "Finance Dept, Govt of Bihar",
    respondent: "Apex Corp",
    verdict: "Deposit required to registry.",
    tags: ["Taxation", "Financial Dispute", "Deposit"],
    actionPlan: {
      English: { directive: "Deposit 5 Lakhs within 2 months to the High Court Registry.", department: "Finance" },
      Hindi: { directive: "उच्च न्यायालय रजिस्ट्री में 2 महीने के भीतर 5 लाख रुपये जमा करें।", department: "वित्त" },
      Marathi: { directive: "उच्च न्यायालय रजिस्ट्रीमध्ये 2 महिन्यांत 5 लाख रुपये जमा करा.", department: "वित्त" }
    }
  },
  {
    caseId: "SLP-4100-2026",
    ubid: "IN-BR-PAT-HC-2026-4100",
    title: "Ravi Kumar vs. State Medical Board",
    petitioner: "Ravi Kumar",
    respondent: "State Medical Board",
    verdict: "Reinstatement of medical license pending inquiry.",
    tags: ["Licensing", "Medical", "Stay Order"],
    actionPlan: {
      English: { directive: "Reinstate medical license of Dr. Ravi Kumar pending final inquiry.", department: "Health" },
      Hindi: { directive: "अंतिम जांच लंबित रहने तक डॉ रवि कुमार का चिकित्सा लाइसेंस बहाल करें।", department: "स्वास्थ्य" },
      Marathi: { directive: "अंतिम चौकशी प्रलंबित होईपर्यंत डॉ. रवी कुमार यांचा वैद्यकीय परवाना पुनर्संचयित करा.", department: "आरोग्य" }
    }
  },
  // Continuing mock cases up to 20
  ...Array.from({ length: 16 }).map((_, i) => ({
    caseId: `CWJC-${5000 + i}-2026`,
    ubid: `IN-BR-PAT-HC-2026-${5000 + i}`,
    title: `Mock Case ${i + 5}: Local Govt vs. Citizen ${i + 5}`,
    petitioner: "Local Govt",
    respondent: `Citizen ${i + 5}`,
    verdict: "General compliance ordered.",
    tags: ["General", "Compliance", i % 2 === 0 ? "Land" : "Bail"],
    actionPlan: {
      English: { directive: "Ensure compliance with municipal guidelines within 15 days.", department: "Municipal" },
      Hindi: { directive: "15 दिनों के भीतर नगरपालिका दिशानिर्देशों का अनुपालन सुनिश्चित करें।", department: "नगरपालिका" },
      Marathi: { directive: "१५ दिवसांच्या आत नगरपालिका मार्गदर्शक तत्त्वांचे पालन सुनिश्चित करा.", department: "नगरपालिका" }
    }
  }))
];

export const searchLegalDatabase = (query) => {
  const q = query.toLowerCase();
  return legalDatabase.filter(c => 
    c.title.toLowerCase().includes(q) || 
    c.ubid.toLowerCase().includes(q) || 
    c.tags.some(t => t.toLowerCase().includes(q))
  );
};
