import React, { createContext, useContext, useState, useEffect } from "react";
import { GoldRecord, GoldPrice } from "@/types/gold";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { getGoldPrices } from "@/lib/goldPriceScraper";

interface GoldContextType {
  records: GoldRecord[];
  goldPrices: GoldPrice;
  isLoading: boolean;
  error: string | null;
  language: 'en' | 'ar';
  addRecord: (record: Omit<GoldRecord, "id" | "createdAt" | "updatedAt">) => void;
  updateRecord: (id: string, record: Partial<GoldRecord>) => void;
  deleteRecord: (id: string) => void;
  refreshPrices: () => Promise<void>;
  switchLanguage: () => void;
  totalPurchaseValue: number;
  currentValue: number;
  isZakatEligible: boolean;
  zakatAmount: number;
  translations: Record<string, any>;
}

const defaultGoldPrices: GoldPrice = {
  k21: 3700, // Default price for 21K gold per gram in EGP
  k24: 4200, // Default price for 24K gold per gram in EGP
  lastUpdated: new Date(),
};

// Translations for all text in the app
const translationsData = {
  en: {
    appName: "Gold Tracker",
    lastUpdated: "Last updated",
    totalPurchaseValue: "Total Purchase Value",
    currentValue: "Current Value",
    zakatCalculation: "Zakat Calculation",
    eligibleForZakat: "Eligible for Zakat",
    notEligibleForZakat: "Not eligible for Zakat yet",
    yourGoldRecords: "Your Gold Records",
    hide: "Hide",
    show: "Show",
    noRecords: "No gold records yet. Add your first record!",
    from: "From",
    purchasePrice: "Purchase Price",
    purchaseDate: "Purchase Date",
    addNewRecord: "Add New Record",
    editRecord: "Edit Record",
    deleteRecord: "Delete Record",
    recordAdded: "Record Added",
    recordAddedDesc: "Added {quantity}g of {karat}K gold",
    recordUpdated: "Record Updated",
    recordUpdatedDesc: "Gold record has been updated successfully",
    recordDeleted: "Record Deleted",
    recordDeletedDesc: "Gold record has been deleted",
    languageChanged: "Language Changed",
    languageChangedToArabic: "تم تغيير اللغة إلى العربية",
    languageChangedToEnglish: "Language changed to English",
    pricesUpdated: "Prices Updated",
    pricesUpdatedDesc: "21K: {k21} EGP, 24K: {k24} EGP",
    usingEstimatedPrices: "Using Estimated Prices",
    usingEstimatedPricesDesc: "Couldn't fetch prices. Using estimates: 21K: {k21} EGP, 24K: {k24} EGP",
    share: "Track your gold investments with Gold Tracker!",
    copyLink: "Copy this link to share",
    footer: "All rights reserved."
  },
  ar: {
    appName: "متتبع الذهب",
    lastUpdated: "آخر تحديث",
    totalPurchaseValue: "إجمالي قيمة الشراء",
    currentValue: "القيمة الحالية",
    zakatCalculation: "حساب الزكاة",
    eligibleForZakat: "مستحق للزكاة",
    notEligibleForZakat: "غير مستحق للزكاة حتى الآن",
    yourGoldRecords: "سجلات الذهب الخاصة بك",
    hide: "إخفاء",
    show: "إظهار",
    noRecords: "لا توجد سجلات ذهب حتى الآن. أضف أول سجل!",
    from: "من",
    purchasePrice: "سعر الشراء",
    purchaseDate: "تاريخ الشراء",
    currentValue: "القيمة الحالية",
    addNewRecord: "إضافة سجل جديد",
    editRecord: "تعديل السجل",
    deleteRecord: "حذف السجل",
    recordAdded: "تم إضافة السجل",
    recordAddedDesc: "تمت إضافة {quantity} جرام من الذهب عيار {karat}",
    recordUpdated: "تم تحديث السجل",
    recordUpdatedDesc: "تم تحديث سجل الذهب بنجاح",
    recordDeleted: "تم حذف السجل",
    recordDeletedDesc: "تم حذف سجل الذهب",
    languageChanged: "تم تغيير اللغة",
    languageChangedToArabic: "تم تغيير اللغة إلى العربية",
    languageChangedToEnglish: "تم تغيير اللغة إلى الإنجليزية",
    pricesUpdated: "تم تحديث الأسعار",
    pricesUpdatedDesc: "عيار ٢١: {k21} جنيه، عيار ٢٤: {k24} جنيه",
    usingEstimatedPrices: "استخدام أسعار تقديرية",
    usingEstimatedPricesDesc: "تعذر جلب الأسعار. استخدام تقديرات: عيار ٢١: {k21} جنيه، عيار ٢٤: {k24} جنيه",
    share: "تتبع استثمارات الذهب الخاصة بك مع متتبع الذهب!",
    copyLink: "انسخ هذا الرابط للمشاركة",
    footer: "جميع الحقوق محفوظة."
  }
};

const GoldContext = createContext<GoldContextType | undefined>(undefined);

export const GoldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<GoldRecord[]>([]);
  const [goldPrices, setGoldPrices] = useState<GoldPrice>(defaultGoldPrices);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // Use translations based on the current language
  const translations = translationsData[language];

  useEffect(() => {
    const savedRecords = localStorage.getItem("goldRecords");
    const savedPrices = localStorage.getItem("goldPrices");
    const savedLanguage = localStorage.getItem("language");
    
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        const recordsWithDates = parsedRecords.map((record: any) => ({
          ...record,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt),
          purchaseDate: record.purchaseDate ? new Date(record.purchaseDate) : undefined,
        }));
        setRecords(recordsWithDates);
      } catch (err) {
        console.error("Error parsing saved records:", err);
        setError("Failed to load saved records");
      }
    }
    
    if (savedPrices) {
      try {
        const parsedPrices = JSON.parse(savedPrices);
        setGoldPrices({
          ...parsedPrices,
          lastUpdated: new Date(parsedPrices.lastUpdated),
        });
      } catch (err) {
        console.error("Error parsing saved prices:", err);
      }
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage as 'en' | 'ar');
    }
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("goldRecords", JSON.stringify(records));
    }
  }, [records]);

  useEffect(() => {
    localStorage.setItem("goldPrices", JSON.stringify(goldPrices));
  }, [goldPrices]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshPrices();
    }, 30 * 60 * 1000);

    refreshPrices();

    return () => clearInterval(refreshInterval);
  }, []);

  const addRecord = (record: Omit<GoldRecord, "id" | "createdAt" | "updatedAt">) => {
    const newRecord: GoldRecord = {
      ...record,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setRecords((prevRecords) => [...prevRecords, newRecord]);
    toast({ 
      title: translations.recordAdded,
      description: translations.recordAddedDesc.replace("{quantity}", record.quantity.toString()).replace("{karat}", record.karat.toString()),
    });
  };

  const updateRecord = (id: string, updatedFields: Partial<GoldRecord>) => {
    setRecords((prevRecords) => 
      prevRecords.map((record) => 
        record.id === id 
          ? { ...record, ...updatedFields, updatedAt: new Date() } 
          : record
      )
    );
    toast({ 
      title: translations.recordUpdated,
      description: translations.recordUpdatedDesc,
    });
  };

  const deleteRecord = (id: string) => {
    setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    toast({ 
      title: translations.recordDeleted,
      description: translations.recordDeletedDesc,
    });
  };

  const switchLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
    toast({ 
      title: translationsData[language === 'en' ? 'ar' : 'en'].languageChanged,
      description: language === 'en' ? 
        translationsData.ar.languageChangedToArabic : 
        translationsData.en.languageChangedToEnglish,
    });
  };

  const refreshPrices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use our new gold price scraper
      const newPrices = await getGoldPrices();
      setGoldPrices(newPrices);
      
      toast({ 
        title: translations[language === 'en' ? "pricesUpdated" : "pricesUpdated"],
        description: translations.pricesUpdatedDesc.replace("{k21}", newPrices.k21.toString()).replace("{k24}", newPrices.k24.toString()),
      });
    } catch (err) {
      console.error("Error fetching gold prices:", err);
      setError("Failed to fetch gold prices");
      
      // Fallback to simulated prices if scraping fails
      const getGoldPriceInRange = (min: number, max: number) => {
        return Math.floor(min + Math.random() * (max - min));
      };
      
      const k21Price = getGoldPriceInRange(3650, 3750);
      const k24Price = getGoldPriceInRange(4150, 4250);
      
      const newPrices: GoldPrice = {
        k21: k21Price,
        k24: k24Price,
        lastUpdated: new Date(),
      };
      
      setGoldPrices(newPrices);
      
      toast({ 
        title: translations[language === 'en' ? "usingEstimatedPrices" : "usingEstimatedPrices"],
        description: translations.usingEstimatedPricesDesc.replace("{k21}", newPrices.k21.toString()).replace("{k24}", newPrices.k24.toString()),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPurchaseValue = records.reduce(
    (total, record) => total + record.purchasePrice,
    0
  );

  const currentValue = records.reduce((total, record) => {
    const pricePerGram = record.karat === 21 ? goldPrices.k21 : goldPrices.k24;
    return total + (record.quantity * pricePerGram);
  }, 0);

  const nisabThreshold = 85 * goldPrices.k21;
  const isZakatEligible = currentValue >= nisabThreshold;
  
  const zakatAmount = currentValue * 0.025;

  return (
    <GoldContext.Provider
      value={{
        records,
        goldPrices,
        isLoading,
        error,
        language,
        addRecord,
        updateRecord,
        deleteRecord,
        refreshPrices,
        switchLanguage,
        totalPurchaseValue,
        currentValue,
        isZakatEligible,
        zakatAmount,
        translations,
      }}
    >
      {children}
    </GoldContext.Provider>
  );
};

export const useGold = (): GoldContextType => {
  const context = useContext(GoldContext);
  if (context === undefined) {
    throw new Error("useGold must be used within a GoldProvider");
  }
  return context;
};
