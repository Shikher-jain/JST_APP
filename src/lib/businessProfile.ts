import { BusinessProfile } from "@/types";

export const jstBusinessProfile: BusinessProfile = {
  legalName: "Jain Sarafa Thella",
  tradeName: "Jain Sarafa Thella (JST)",
  tagline: {
    hi: "आगरा सराफा की विश्वसनीय आभूषण पोटली एवं बैग निर्माण परंपरा",
    en: "Agra Sarafa's Trusted Jewellery Pouch & Custom Bag Manufacturing Heritage",
  },
  foundedYear: 1988,
  location: "Sarafa Bazar, Chowk, Agra, Uttar Pradesh, India",
  headquarters: {
    id: "loc-hq-agra",
    name: {
      hi: "मुख्य कार्यालय एवं निर्माण इकाई, आगरा",
      en: "Headquarters & Manufacturing Facility, Agra",
    },
    addressLine1: "Sarafa Bazar, Chowk",
    addressLine2: "Near Johri Market",
    city: "Agra",
    state: "Uttar Pradesh",
    stateCode: "09",
    pincode: "282001",
    country: "India",
    phone: "+91-9876543210",
    email: "support@jainsarafathella.com",
    isHeadquarters: true,
    coordinates: {
      latitude: 27.1856,
      longitude: 78.0142,
    },
    googleMapsUrl: "https://maps.google.com/?q=Sarafa+Bazar+Chowk+Agra",
  },
  operatingHours: [
    { dayOfWeek: "monday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "tuesday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "wednesday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "thursday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "friday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "saturday", openTime: "10:30", closeTime: "20:30", isClosed: false },
    { dayOfWeek: "sunday", openTime: "11:00", closeTime: "18:00", isClosed: false },
  ],
  about: {
    shortIntro: {
      hi: "जैन सराफा थैला आगरा के ऐतिहासिक सराफा बाजार में स्थित आभूषण पैकेजिंग, भारी नकद/बुलियन थैलों एवं कस्टमाइज्ड प्रिंटेड कैरी बैग्स का अग्रणी निर्माता है।",
      en: "Jain Sarafa Thella is a premier manufacturer in Agra's historic Sarafa Bazar, specializing in jewellery pouches, heavy cash/bullion transport bags, and bespoke printed showroom carry bags.",
    },
    fullNarrative: {
      hi: "तीन दशकों से अधिक समय से, जैन सराफा थैला उत्तर भारत के जौहरियों, सराफा व्यापारियों एवं रिटेल शोरूम्स को उच्चतम गुणवत्ता की पैकेजिंग उपलब्ध करा रहा है। मखमली जरी पोटली से लेकर बुलियन डिलीवरी के मजबूत कैनवास थैलों तक, हमारी इन-हाउस निर्माण इकाई में प्रत्येक उत्पाद को आभूषणों की सुरक्षा और भव्यता को ध्यान में रखकर तैयार किया जाता है।",
      en: "For over three decades, Jain Sarafa Thella has been the trusted packaging partner for jewellers, bullion traders, and retail showrooms across North India. From royal velvet zari potlis to ultra-durable canvas bullion carrier bags, our in-house Agra manufacturing facility engineers every product with the twin priorities of jewel safety and regal presentation.",
    },
    mission: {
      hi: "प्रत्येक भारतीय जौहरी और व्यापारी को टिकाऊ, सुरुचिपूर्ण और ब्रांड-अनुकूल पैकेजिंग सीधे निर्माता मूल्य पर उपलब्ध कराना।",
      en: "To empower Indian jewellers and retail merchants with durable, elegant, and custom-branded packaging at transparent factory-direct pricing.",
    },
    heritage: {
      hi: "आगरा सराफा बाजार का हृदय स्थल — जहाँ विश्वसनीयता और शुद्धता ही व्यवसाय की पहचान है।",
      en: "The historic heart of Agra Sarafa Bazar — where trust and uncompromised craftsmanship define commerce.",
    },
  },
  manufacturingDivisions: [
    {
      id: "div-jewellery-pouches",
      name: {
        hi: "सराफा एवं आभूषण पोटली प्रभाग",
        en: "Sarafa & Jewellery Pouch Division",
      },
      tagline: {
        hi: "सोने, चांदी और हीरों के लिए मखमली सुरक्षा",
        en: "Velvet Elegance & Anti-Tarnish Protection for Gold, Silver & Diamonds",
      },
      description: {
        hi: "उच्च घनत्व वाले मखमली (Velvet) कपड़े, साटन सिल्क अस्तर और मजबूत जरी डोरी से निर्मित पोटलियाँ। यह आभूषणों को खरोंच, नमी और हवा से सुरक्षित रखती हैं।",
        en: "Pouches engineered from high-density 280+ GSM velvet, inner satin silk lining, and high-tensile zari drawstrings to safeguard precious ornaments against micro-scratches and oxidation.",
      },
      keyProducts: [
        { hi: "शाही लाल मखमली आभूषण पोटली", en: "Royal Red Velvet Jewellery Potli" },
        { hi: "सिल्वर पायल व सिक्का ज़िप पाउच", en: "Silver Payal & Coin Zipper Pouch" },
        { hi: "नेवी ब्लू ब्राइडल गिफ्ट पोटली", en: "Navy Blue Bridal Gift Pouch" },
      ],
      capabilities: [
        { hi: "गोल्ड व सिल्वर फॉइल स्टैम्पिंग", en: "Gold & Silver Hot Foil Stamping" },
        { hi: "इनर सिल्क और स्पंज पैडिंग", en: "Inner Silk & Anti-Shock Foam Padding" },
        { hi: "कस्टम साइज व रंग डाईंग", en: "Custom Dimensions & Color Dyeing" },
      ],
      typicalLeadTime: "3 to 7 working days",
      minimumOrderQty: 50,
    },
    {
      id: "div-heavy-thella",
      name: {
        hi: "सुरक्षित सराफा थैला व बुलियन कैरियर प्रभाग",
        en: "Heavy Sarafa Thella & Bullion Carrier Division",
      },
      tagline: {
        hi: "भारी आभूषणों, चांदी की सिल्लियों व नकदी के लिए अति-मजबूत थैले",
        en: "Heavy-Duty Load-Bearing Bags for Bullion, Cash & Silver Bars",
      },
      description: {
        hi: "भारी 14-16 oz कॉटन कैनवास और प्रबलित नायलॉन स्ट्रैप्स से बने थैले, जो 25-50 किलोग्राम तक का भार सुरक्षित रूप से वहन कर सकते हैं।",
        en: "Industrial-grade 14-16 oz cotton canvas bags with reinforced nylon webbing handles, engineered to safely bear 25 to 50 kg of bullion, coins, or wholesale merchandise.",
      },
      keyProducts: [
        { hi: "सराफा हैवी बुलियन कैरियर थैला (35 KG लोड)", en: "Sarafa Heavy Bullion Carrier (35 KG Load)" },
        { hi: "चांदी पायल थोक ट्रांसपोर्ट बोरी/थैला", en: "Wholesale Silver Payal Transport Bag" },
        { hi: "सराफा तिजोरी व कैश कैरियर बैग", en: "Sarafa Vault & Cash Carrier Thella" },
      ],
      capabilities: [
        { hi: "डबल इंटरलॉक रिवेट सिलाई", en: "Double Interlocked Riveted Stitching" },
        { hi: "वॉटरप्रूफ आंतरिक कोटिंग", en: "Waterproof Inner Lining" },
        { hi: "सीक्रेसी पैड व सुरक्षा लॉक कम्पार्टमेंट", en: "Concealed Secrecy Flap & Lock Ring" },
      ],
      typicalLeadTime: "5 to 10 working days",
      minimumOrderQty: 25,
    },
    {
      id: "div-retail-showroom",
      name: {
        hi: "शोरूम रिटेल व ब्रांडेड शॉपिंग बैग प्रभाग",
        en: "Retail Showroom & Branded Shopping Bag Division",
      },
      tagline: {
        hi: "आपके ज्वैलरी शोरूम के लिए प्रीमियम वॉक-इन बैग्स",
        en: "Elevate Your Showroom's Brand Image with Every Customer Purchase",
      },
      description: {
        hi: "कॉटन, नॉन-वूवन एवं लैमिनेटेड क्राफ्ट से बने आकर्षक शॉपिंग बैग्स, जिन पर शोरूम का नाम, लोगो और पता सोने या चांदी की चमक में प्रिंट किया जाता है।",
        en: "Premium cotton, non-woven, and laminated craft shopping bags customized with jewel showroom logos, addresses, and statutory hallmarks.",
      },
      keyProducts: [
        { hi: "प्रीमियम मैट फिनिश लैमिनेटेड कैरी बैग", en: "Premium Matte Laminated Carry Bag" },
        { hi: "इको-फ्रेंडली कॉटन शोरूम दस्तकारी थैला", en: "Eco-Friendly Cotton Showroom Thella" },
        { hi: "गोल्डन हैंडल नॉन-वूवन लूप बैग", en: "Golden Handle Non-Woven Loop Bag" },
      ],
      capabilities: [
        { hi: "मल्टी-कलर स्क्रीन व ऑफसेट प्रिंटिंग", en: "Multi-Color Screen & Offset Printing" },
        { hi: "रोटरी कटिंग व ऑटो हैंडल पंचिंग", en: "Rotary Die-Cutting & Auto Handle Punching" },
        { hi: "ग्लोसी/मैट लेमिनेशन", en: "Gloss / Matte Thermal Lamination" },
      ],
      typicalLeadTime: "4 to 8 working days",
      minimumOrderQty: 100,
    },
    {
      id: "div-custom-bespoke",
      name: {
        hi: "कस्टम निर्माण व विशेष ऑर्डर प्रभाग",
        en: "Custom Bespoke & OEM Manufacturing Division",
      },
      tagline: {
        hi: "आपकी नाप, आपका कपड़ा, आपका लोगो — पूर्ण निर्माण समाधान",
        en: "Your Dimensions, Your Fabric, Your Branding — End-to-End OEM",
      },
      description: {
        hi: "विवाह समारोहों, कॉरपोरेट गिफ्टिंग और बड़े ज्वैलरी ब्रांड्स के लिए विशेष नाप, अनोखे रंग संयोजन और विशिष्ट पैकेजिंग का कस्टम उत्पादन।",
        en: "Tailor-made manufacturing for wedding celebrations, corporate gifting, and national jewellery chains requiring unique dimensions, custom Pantone shades, and branded embellishments.",
      },
      keyProducts: [
        { hi: "विवाह आभूषण गिफ्टिंग किट व पोटली सेट", en: "Royal Wedding Jewellery Gifting Kit & Potli Set" },
        { hi: "कस्टम लोगो गोल्ड एम्बॉस्ड दस्तकारी बॉक्स बैग", en: "Custom Logo Gold Embossed Rigid Box Bag" },
      ],
      capabilities: [
        { hi: "कस्टम डाई मेकिंग व डाई-कटिंग", en: "Custom Die Making & Precision Cutting" },
        { hi: "डिजिटल सैंपलिंग व 48-घंटे अप्रूवल", en: "Digital Mockups & 48-Hour Sample Approval" },
        { hi: "अग्रिम उत्पादन शेड्यूलिंग", en: "Batch Production Scheduling" },
      ],
      typicalLeadTime: "7 to 14 working days",
      minimumOrderQty: 200,
    },
  ],
  materials: [
    {
      id: "mat-velvet",
      name: { hi: "प्रीमियम भारी मखमल (280 GSM)", en: "Premium Heavy Velvet (280 GSM)" },
      description: {
        hi: "मुलायम स्पर्श, रोएँदार बुनावट जो आभूषणों पर घर्षण नहीं होने देती। सोने और हीरे के गहनों के लिए सर्वोपरि।",
        en: "Ultra-soft plush pile preventing abrasive friction on high-polish gold and diamond jewellery.",
      },
      availableGsmOrWeight: "280 - 320 GSM",
      primaryUses: [
        { hi: "आभूषण पोटली", en: "Jewellery Potlis" },
        { hi: "अंगूठी व कंगन पाउच", en: "Ring & Bangle Pouches" },
      ],
      durability: "high",
      ecoFriendly: true,
    },
    {
      id: "mat-canvas",
      name: { hi: "हैवी-ड्यूटी कॉटन कैनवास (14-16 oz)", en: "Heavy-Duty Cotton Canvas (14-16 oz)" },
      description: {
        hi: "उच्च भार-वहन क्षमता, मजबूत ताना-बाना, भारी चांदी व नकदी के परिवहन के लिए सर्वश्रेष्ठ।",
        en: "Dense weave industrial duck canvas designed for extreme tensile load and long-distance transport.",
      },
      availableGsmOrWeight: "400 - 500 GSM (14-16 oz)",
      primaryUses: [
        { hi: "बुलियन व चांदी ट्रांसपोर्ट थैला", en: "Bullion & Silver Transport Bags" },
        { hi: "कूरियर व तिजोरी बैग", en: "Courier & Vault Thellas" },
      ],
      durability: "heavy_duty",
      ecoFriendly: true,
    },
    {
      id: "mat-nonwoven",
      name: { hi: "वर्जिन नॉन-वूवन फैब्रिक (80-120 GSM)", en: "Virgin Non-Woven Fabric (80-120 GSM)" },
      description: {
        hi: "जल-प्रतिरोधी, पुनर्चक्रण योग्य, दैनिक शोरूम ग्राहकों के लिए किफायती एवं टिकाऊ।",
        en: "Water-repellent, recyclable spunbond fabric offering cost-effective daily showroom durability.",
      },
      availableGsmOrWeight: "80 - 120 GSM",
      primaryUses: [
        { hi: "शोरूम वॉक-इन कैरी बैग", en: "Showroom Walk-in Carry Bags" },
        { hi: "प्रमोशनल थैले", en: "Promotional Thellas" },
      ],
      durability: "standard",
      ecoFriendly: true,
    },
    {
      id: "mat-satin",
      name: { hi: "रेशमी साटन (सिल्क लाइनिंग)", en: "Silky Satin Silk (Inner Lining)" },
      description: {
        hi: "चिकनी, चमकदार रेशमी परत जो आंतरिक आभूषणों को पूर्ण सुरक्षा प्रदान करती है।",
        en: "High-sheen smooth barrier lining providing anti-friction cushioning inside pouches.",
      },
      availableGsmOrWeight: "110 - 140 GSM",
      primaryUses: [
        { hi: "पोटली का आंतरिक अस्तर", en: "Pouch Inner Silk Lining" },
        { hi: "गिफ्ट कवर्स", en: "Luxury Gift Covers" },
      ],
      durability: "high",
      ecoFriendly: true,
    },
  ],
  customizationOptions: {
    printMethods: [
      { hi: "गोल्ड व सिल्वर हॉट फॉइल स्टैम्पिंग", en: "Metallic Gold & Silver Hot Foil Stamping" },
      { hi: "प्रेसिजन स्क्रीन प्रिंटिंग (सदाबहार रंग)", en: "Precision Screen Printing (Non-Fading Inks)" },
      { hi: "मशीनी धागा कढ़ाई (Embroidery)", en: "Computerized Machine Embroidery" },
      { hi: "रिफ्लेक्टिव और एम्बॉस्ड ब्रांडिंग", en: "Embossed & Debossed Brand Badges" },
    ],
    sizesSupported: [
      { hi: "मानक आकार: छोटा (4x5\"), मध्यम (6x8\"), बड़ा (8x10\"), अतिरिक्त बड़ा (10x12\")", en: "Standard: Small (4x5\"), Medium (6x8\"), Large (8x10\"), XL (10x12\")" },
      { hi: "कस्टम आकार: ग्राहक की आवश्यकतानुसार मिलीमीटर तक सटीक निर्माण", en: "Custom: Millimeter-precise custom dimensions to fit jewellery boxes or bullion bars" },
    ],
    accessories: [
      { hi: "गोल्डन जरी डोरी एवं घुंघरू/लटकन", en: "Golden Zari Cords & Traditional Latkans" },
      { hi: "हेवी-ड्यूटी नायलॉन व कॉटन वेबिंग हैंडल्स", en: "Heavy-Duty Nylon & Cotton Webbing Handles" },
      { hi: "मेटल जिपर व लॉक होल रिंग", en: "Metal Zippers & Lock Hole Security Rings" },
    ],
    minimumCustomBatch: 100,
    advanceDepositPercent: 50,
  },
  qualityAssurance: {
    steps: [
      { hi: "कच्चे माल का जीएसएम एवं खिंचाव परीक्षण", en: "Raw Material GSM & Tensile Strength Testing" },
      { hi: "सिलाई एवं इंटरलॉक मजबूती की 100% जांच", en: "100% Seam Interlock & Handle Load Inspection" },
      { hi: "प्रिंट आसंजन एवं फॉइल फिनिश चेक", en: "Print Adhesion, Crispness & Foil Rub Check" },
      { hi: "स्वच्छता एवं सुरक्षात्मक बंडल पैकिंग", en: "Dust-Free Inspection & Protective Moisture-Proof Bundle Packing" },
    ],
    certifications: [
      "Agra Sarafa Association Registered Vendor",
      "GST & Statutory MSME Certified Enterprise",
    ],
  },
  targetSegments: [
    {
      title: { hi: "ज्वैलरी शोरूम व रिटेलर्स", en: "Jewellery Showrooms & Retailers" },
      description: {
        hi: "सोने, चांदी और हीरे के आभूषण बेचने वाले स्टोर्स जो अपने नाम के साथ प्रीमियम पोटली और शॉपिंग बैग चाहते हैं।",
        en: "Retail gold and diamond showrooms requiring branded pouches and luxury shopping bags to elevate unboxing.",
      },
      recommendedProducts: ["JST-VLV-RED", "JST-VLV-NVY", "JST-SHW-MATTE"],
    },
    {
      title: { hi: "थोक बुलियन व चांदी व्यापारी", en: "Wholesale Bullion & Silver Traders" },
      description: {
        hi: "आगरा, मथुरा, हाथरस, मेरठ और दिल्ली के व्यापारी जिन्हें भारी चांदी की पायल और सोने की सिल्लियों के सुरक्षित परिवहन के लिए थैले चाहिए।",
        en: "Bullion dealers transporting heavy silver payal, gold bars, and cash between bazaars and mints.",
      },
      recommendedProducts: ["JST-BLN-35KG", "JST-PYL-TRN"],
    },
    {
      title: { hi: "विवाह समारोह एवं इवेंट प्लानर्स", en: "Weddings & Luxury Event Planners" },
      description: {
        hi: "शाही शादियों और कॉर्पोरेट उपहारों के लिए कस्टमाइज्ड जरी पोटली और गिफ्ट किट बैग्स।",
        en: "Planners curating royal wedding return gifts, dry fruit potlis, and silver gift packaging.",
      },
      recommendedProducts: ["JST-VLV-GOLD", "JST-WED-ROYAL"],
    },
  ],
  statutory: {
    gstin: "09XXXXXXXXXXZX",
    pan: "XXXXXXXXXX",
    hsnCodes: ["4202", "6305", "4819"],
    stateCode: "09",
  },
};
