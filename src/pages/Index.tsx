
import { useState } from "react";
import { Header } from "@/components/Header";
import { GoldSummary } from "@/components/GoldSummary";
import { GoldRecordList } from "@/components/GoldRecordList";
import { AddGoldRecord } from "@/components/AddGoldRecord";
import { FloatingShareButton } from "@/components/FloatingShareButton";
import { GoldProvider } from "@/contexts/GoldContext";
import { GoldRecord } from "@/types/gold";

const Index = () => {
  const [editingRecord, setEditingRecord] = useState<GoldRecord | undefined>(undefined);

  const handleEditRecord = (record: GoldRecord) => {
    setEditingRecord(record);
  };

  const handleCloseDialog = () => {
    setEditingRecord(undefined);
  };

  return (
    <GoldProvider>
      {({ language, translations }) => (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6 max-w-md">
            <GoldSummary />
            <GoldRecordList onEditRecord={handleEditRecord} />
            <AddGoldRecord 
              editRecord={editingRecord} 
              onClose={handleCloseDialog} 
            />
          </main>
          
          <FloatingShareButton />
          
          <footer className="bg-navy-dark text-white py-4 text-center text-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto">
              <p>&copy; {new Date().getFullYear()} {translations.appName}. {translations.footer}</p>
            </div>
          </footer>
        </div>
      )}
    </GoldProvider>
  );
};

export default Index;
