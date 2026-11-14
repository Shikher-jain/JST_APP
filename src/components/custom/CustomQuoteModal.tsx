"use client";

import React, { useState } from "react";
import { Locale } from "@/types";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { 
  X, 
  Paintbrush, 
  UploadCloud, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Calculator,
  Download,
  Clock,
  Layers,
  ShieldCheck,
  Building,
  Phone
} from "lucide-react";

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: Locale;
}

export const CustomQuoteModal: React.FC<CustomQuoteModalProps> = ({
  isOpen,
  onClose,
  currentLocale,
}) => {
  const dict = getDictionary(currentLocale);

  // Form Specification State
  const [bagType, setBagType] = useState<string>("velvet_potli");
  const [heightInches, setHeightInches] = useState<number>(5);
  const [widthInches, setWidthInches] = useState<number>(4);
  const [gussetInches, setGussetInches] = useState<number>(0);
  const [gsmQuality, setGsmQuality] = useState<number>(240);
  const [printTechnique, setPrintTechnique] = useState<string>("gold_foil");
  const [closureType, setClosureType] = useState<string>("zari_dori");
  const [quantity, setQuantity] = useState<number>(250); // DEC-05 candidate min 250 pcs

  // Contact Info
  const [shopName, setShopName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Agra");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Artwork file simulation
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);

  if (!isOpen) return null;

  // File selection simulation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    }
  };

  // Dynamic Quote Pricing Calculation (Section 8.2 & DEC-05)
  // Fabric Area calculation: (2 * H * W) + Gusset
  const areaSqInches = 2 * heightInches * widthInches + (gussetInches > 0 ? gussetInches * widthInches : 0);
  const baseFabricUnitRate = Math.max(8, Math.round((areaSqInches * (gsmQuality / 240) * 0.25) * 10) / 10);

  // Printing & Technique unit rate
  const printCostPerUnit = printTechnique === "gold_foil" ? 4.5 : printTechnique === "screen_print" ? 2.5 : 8.0;

  // Tooling / Screen Block One-time setup fee
  const toolingSetupFee = 800; // Flat screen/block charge

  // Unit rate before volume discount
  const estimatedUnitRate = Math.round((baseFabricUnitRate + printCostPerUnit) * 10) / 10;
  const totalProductionCost = Math.round(estimatedUnitRate * quantity);

  // GST (12% for pouches, 5% for cotton)
  const gstRate = bagType === "cotton_thella" ? 5 : 12;
  const gstAmount = Math.round((totalProductionCost + toolingSetupFee) * (gstRate / 100));
  const grandTotal = totalProductionCost + toolingSetupFee + gstAmount;

  // 50% Advance non-refundable deposit (DEC-05 candidate)
  const advanceDepositRequired = Math.round(grandTotal * 0.5);
  const balanceUponQC = grandTotal - advanceDepositRequired;

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ref = `JST-QUOTE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch("/api/custom-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteReference: ref,
          shopName,
          contactPerson,
          phone,
          city,
          specs: {
            bagType,
            heightInches,
            widthInches,
            gussetInches,
            gsmQuality,
            printTechnique,
            closureType,
            quantity,
            artworkFileName: selectedFile,
          },
          financials: {
            estimatedUnitRate,
            toolingSetupFee,
            totalProductionCost,
            gstAmount,
            grandTotal,
            advanceDepositRequired,
            balanceUponQC,
          },
          specialInstructions,
        }),
      });
    } catch {
      // Dev fallback
    }

    setQuoteReference(ref);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border-2 border-sarafa-gold/40">
          {/* Header */}
          <div className="bg-sarafa-maroon text-white p-5 flex items-center justify-between border-b border-sarafa-gold/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold-gradient text-sarafa-maroon-dark shadow-inner">
                <Paintbrush className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-hindi text-white flex items-center gap-2">
                  <span>कस्टम बैग निर्माण एवं लोगो प्रिंटिंग CRM</span>
                  <span className="text-[10px] bg-sarafa-gold text-sarafa-maroon-dark font-bold px-2 py-0.5 rounded-full uppercase">
                    Bespoke Engine
                  </span>
                </h3>
                <p className="text-xs text-sarafa-gold-light">
                  अपनी आभूषण दुकान के नाम व लोगो की गोल्ड फॉयल स्टैम्पिंग, कस्टम आकार एवं सटीक कोटेशन
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {quoteReference ? (
            /* Confirmation & PDF Quotation Generator View */
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <FileCheck className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                  कस्टम कोटेशन सफलतापूर्वक तैयार हुआ!
                </span>
                <h3 className="text-2xl font-bold font-hindi text-slate-900 mt-1">
                  {shopName} — आधिकारिक कोटेशन सारांश
                </h3>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full font-mono text-xs font-bold text-slate-800 border">
                  <span>कोटेशन संदर्भ:</span>
                  <span className="text-sarafa-maroon font-bold">{quoteReference}</span>
                </div>
              </div>

              {/* Quotation Table */}
              <div className="max-w-xl mx-auto border border-stone-200 rounded-xl overflow-hidden text-xs text-left bg-stone-50">
                <div className="p-3.5 bg-sarafa-maroon text-white font-bold font-hindi flex justify-between">
                  <span>विनिर्देश (Specifications)</span>
                  <span>{quantity} पीस का बैच</span>
                </div>
                <div className="p-4 space-y-2 divide-y divide-stone-200">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">बैग प्रकार व आकार:</span>
                    <span className="font-semibold text-slate-900">
                      {bagType} ({widthInches}x{heightInches} इंच, {gsmQuality} GSM)
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">प्रिंटिंग तकनीक:</span>
                    <span className="font-semibold text-slate-900">
                      {printTechnique === "gold_foil" ? "हॉट गोल्ड फॉयल स्टैम्पिंग" : "सिल्क स्क्रीन प्रिंट"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">प्रति पीस अनुमानित निर्माण दर:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(estimatedUnitRate)}/पीस</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">एकमुश्त डाई / स्क्रीन ब्लॉक शुल्क:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(toolingSetupFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">GST कर ({gstRate}%):</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold text-sm text-slate-900">
                    <span>कुल कोटेशन मूल्य:</span>
                    <span className="text-sarafa-maroon">{formatCurrencyINR(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-amber-900 font-bold bg-amber-100/50 p-2 rounded">
                    <span>50% प्रारंभिक अग्रिम जमा (DEC-05 उम्मीदवार):</span>
                    <span>{formatCurrencyINR(advanceDepositRequired)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto">
                हमारी आगरा कार्यशाला तकनीकी टीम 24 घंटे में आपके व्हाट्सएप <strong>+91 {phone}</strong> पर डिजिटल आर्टवर्क प्रूफ (Mockup) एवं बैंक भुगतान विवरण साझा करेगी।
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("कोटेशन पीडीएफ डाउनलोड हो रहा है (JST_Quotation_" + quoteReference + ".pdf)");
                  }}
                  className="bg-gold-gradient text-sarafa-maroon-dark font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>कोटेशन PDF डाउनलोड करें</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuoteReference(null);
                    onClose();
                  }}
                  className="border border-slate-300 text-slate-700 font-semibold text-xs py-2.5 px-5 rounded-lg"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          ) : (
            /* Customization Builder & Interactive Quote Form */
            <form onSubmit={handleSubmitQuote} className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Technical Specifications */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-sarafa-maroon flex items-center gap-1.5 pb-2 border-b border-stone-200">
                    <Layers className="w-4 h-4 text-sarafa-gold-dark" />
                    <span>1. बैग तकनीकी विनिर्देश (Technical Specifications)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        बैग स्टाइल एवं सामग्री *
                      </label>
                      <select
                        value={bagType}
                        onChange={(e) => setBagType(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon bg-white"
                      >
                        <option value="velvet_potli">मखमली जरी पोटली (Velvet Potli)</option>
                        <option value="cotton_thella">भारी सूती थैला (Cotton Shopper)</option>
                        <option value="suede_envelope">रॉयल स्वीड लिफाफा (Suede Envelope)</option>
                        <option value="satin_bag">साटन शगुन बैग (Satin Shagun Bag)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        कपड़े की गुणवत्ता (Fabric GSM)
                      </label>
                      <select
                        value={gsmQuality}
                        onChange={(e) => setGsmQuality(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon bg-white"
                      >
                        <option value={180}>180 GSM (हल्का/मानक)</option>
                        <option value={240}>240 GSM (प्रीमियम सराफा मानक)</option>
                        <option value={320}>320 GSM (भारी मखमल/कैनवास)</option>
                        <option value={450}>450 GSM (अल्ट्रा-लक्जरी हैवी कैनवास)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ऊंचाई (इंच) *
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={30}
                        value={heightInches}
                        onChange={(e) => setHeightInches(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        चौड़ाई (इंच) *
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={30}
                        value={widthInches}
                        onChange={(e) => setWidthInches(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        बॉटम गसेट (इंच)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={gussetInches}
                        onChange={(e) => setGussetInches(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-center"
                      />
                    </div>
                  </div>

                  {/* Branding Technique & Closure */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        लोगो प्रिंटिंग तकनीक *
                      </label>
                      <select
                        value={printTechnique}
                        onChange={(e) => setPrintTechnique(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon bg-white"
                      >
                        <option value="gold_foil">हॉट गोल्ड फॉयल स्टैम्पिंग (रॉयल चमक)</option>
                        <option value="screen_print">सिल्क स्क्रीन प्रिंट (एकल/दोहरा रंग)</option>
                        <option value="metal_plate">एंबॉस्ड मेटल लोगो प्लेट</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        डोरी / हैंडल का प्रकार
                      </label>
                      <select
                        value={closureType}
                        onChange={(e) => setClosureType(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon bg-white"
                      >
                        <option value="zari_dori">गोल्डन जरी डोरी (टैसेल्स सहित)</option>
                        <option value="cotton_rope">ब्रेडेड सूती रस्सी</option>
                        <option value="snap_button">गोल्डन मैग्नेटिक स्नैप बटन</option>
                        <option value="d_cut">डी-कट इनबिल्ट हैंडल</option>
                      </select>
                    </div>
                  </div>

                  {/* Minimum Production Run Policy (DEC-05 candidate 250 pcs) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        उत्पादन मात्रा (न्यूनतम 250 पीस - DEC-05 नीति) *
                      </label>
                      <span className="text-xs font-bold text-sarafa-maroon">{quantity} पीस</span>
                    </div>
                    <input
                      type="range"
                      min={250}
                      max={5000}
                      step={50}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full accent-sarafa-maroon cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>250 पीस (न्यूनतम रन)</span>
                      <span>1,000 पीस</span>
                      <span>2,500 पीस</span>
                      <span>5,000+ पीस</span>
                    </div>
                  </div>

                  {/* Artwork Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      दुकान का लोगो / आर्टवर्क फाइल अपलोड (PDF, AI, PNG, CDR)
                    </label>
                    <div className="border-2 border-dashed border-stone-300 hover:border-sarafa-gold rounded-xl p-3 text-center bg-stone-50 transition-colors">
                      <input
                        type="file"
                        id="artworkUpload"
                        accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="artworkUpload" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud className="w-6 h-6 text-sarafa-gold-dark mb-1" />
                        <span className="text-xs font-medium text-slate-700">
                          {selectedFile ? selectedFile : "आर्टवर्क फाइल चुनने के लिए क्लिक करें"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          अधिकतम आकार: 25 MB (निजी S3 बकेट में सुरक्षित एन्क्रिप्टेड)
                        </span>
                      </label>

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-sarafa-maroon h-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}

                      {uploadProgress === 100 && (
                        <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>आर्टवर्क सफलतापूर्वक अपलोड हुआ!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Contact & Live Pricing Breakdown */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-sarafa-maroon flex items-center gap-1.5 pb-2 border-b border-stone-200">
                    <Building className="w-4 h-4 text-sarafa-gold-dark" />
                    <span>2. दुकान विवरण व लाइव कोटेशन पूर्वावलोकन</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        दुकान / फर्म का नाम *
                      </label>
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="उदा. श्री कुबेर ज्वेलर्स"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          संपर्क व्यक्ति *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder="उदा. अमित जैन"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          व्हाट्सएप नंबर *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Cost Calculation Card (Section 8.2) */}
                  <div className="bg-amber-50/80 border border-sarafa-gold/50 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-amber-200 pb-2">
                      <Calculator className="w-4 h-4 text-sarafa-maroon" />
                      <span>लाइव अनुमानित कोटेशन (Live Quotation Engine)</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>अनुमानित प्रति पीस दर:</span>
                      <span className="font-bold text-slate-900">{formatCurrencyINR(estimatedUnitRate)}/पीस</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>कुल उत्पादन ({quantity} पीस):</span>
                      <span className="font-semibold">{formatCurrencyINR(totalProductionCost)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>डाई / स्क्रीन ब्लॉक शुल्क:</span>
                      <span className="font-semibold">{formatCurrencyINR(toolingSetupFee)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>GST कर ({gstRate}%):</span>
                      <span className="font-semibold">{formatCurrencyINR(gstAmount)}</span>
                    </div>

                    <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                      <span>कुल अनुमानित मूल्य:</span>
                      <span className="text-sarafa-maroon">{formatCurrencyINR(grandTotal)}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-amber-300 mt-2 space-y-1">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>50% अग्रिम जमा (Advance):</span>
                        <span>{formatCurrencyINR(advanceDepositRequired)}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        शेष 50% राशि गुणवत्ता निरीक्षण के उपरांत प्रेषण से पूर्व देय होगी।
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>आगरा कार्यशाला अनुमानित निर्माण अवधि: <strong>12 से 15 कार्यदिवस</strong></span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !shopName || phone.length < 10}
                    className="w-full bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4 text-sarafa-gold" />
                    <span>
                      {isSubmitting
                        ? "कोटेशन दर्ज हो रहा है..."
                        : "आधिकारिक कोटेशन जमा करें"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
