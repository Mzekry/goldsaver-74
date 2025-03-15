
import React, { createContext, useContext, useState, useEffect } from "react";
import { GoldRecord, GoldPrice } from "@/types/gold";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

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
}

const defaultGoldPrices: GoldPrice = {
  k21: 3300, // Default price for 21K gold per gram in EGP
  k24: 3850, // Default price for 24K gold per gram in EGP
  lastUpdated: new Date(),
};

const GoldContext = createContext<GoldContextType | undefined>(undefined);

export const GoldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<GoldRecord[]>([]);
  const [goldPrices, setGoldPrices] = useState<GoldPrice>(defaultGoldPrices);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // Load records from localStorage on initial load
  useEffect(() => {
    const savedRecords = localStorage.getItem("goldRecords");
    const savedPrices = localStorage.getItem("goldPrices");
    const savedLanguage = localStorage.getItem("language");
    
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        // Convert string dates to Date objects
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

  // Save records to localStorage whenever they change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("goldRecords", JSON.stringify(records));
    }
  }, [records]);

  // Save prices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("goldPrices", JSON.stringify(goldPrices));
  }, [goldPrices]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Set up auto-refresh of gold prices (every 30 minutes)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshPrices();
    }, 30 * 60 * 1000);

    // Initial refresh
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
      title: "Record Added",
      description: `Added ${record.quantity}g of ${record.karat}K gold`,
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
      title: "Record Updated",
      description: "Gold record has been updated successfully",
    });
  };

  const deleteRecord = (id: string) => {
    setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    toast({ 
      title: "Record Deleted",
      description: "Gold record has been deleted",
    });
  };

  const switchLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
    toast({ 
      title: "Language Changed",
      description: language === 'en' ? "تم تغيير اللغة إلى العربية" : "Language changed to English",
    });
  };

  // In a real app, this would fetch from an external API
  const refreshPrices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Attempt to fetch real gold prices from gold-era.com
      // This would be better implemented as a server-side API
      
      // For demo purposes, we'll simulate gold prices close to actual Egyptian markets
      // In a real application, you would implement server-side scraping of gold-era.com
      
      const k21Price = 3600 + Math.floor(Math.random() * 200); // Approximate 21K price in Egypt
      const k24Price = Math.round(k21Price * 1.15); // 24K is typically ~15% more than 21K
      
      setTimeout(() => {
        const newPrices: GoldPrice = {
          k21: k21Price,
          k24: k24Price,
          lastUpdated: new Date(),
        };
        
        setGoldPrices(newPrices);
        setIsLoading(false);
        toast({ 
          title: "Prices Updated",
          description: `21K: ${newPrices.k21} EGP, 24K: ${newPrices.k24} EGP`,
        });
      }, 1000);
    } catch (err) {
      console.error("Error fetching gold prices:", err);
      setError("Failed to fetch gold prices");
      setIsLoading(false);
      toast({ 
        title: "Error",
        description: "Failed to update gold prices",
        variant: "destructive"
      });
    }
  };

  // Calculate total purchase value
  const totalPurchaseValue = records.reduce(
    (total, record) => total + record.purchasePrice,
    0
  );

  // Calculate current value based on gold prices
  const currentValue = records.reduce((total, record) => {
    const pricePerGram = record.karat === 21 ? goldPrices.k21 : goldPrices.k24;
    return total + (record.quantity * pricePerGram);
  }, 0);

  // Check if Zakat eligible (if current value is >= 85g of 21K gold)
  const nisabThreshold = 85 * goldPrices.k21;
  const isZakatEligible = currentValue >= nisabThreshold;
  
  // Calculate Zakat amount (2.5% of current value)
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
