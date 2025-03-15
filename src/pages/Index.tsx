
import { useState } from "react";
import { Header } from "@/components/Header";
import { GoldSummary } from "@/components/GoldSummary";
import { GoldRecordList } from "@/components/GoldRecordList";
import { AddGoldRecord } from "@/components/AddGoldRecord";
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
        
        <footer className="bg-navy-dark text-white py-4 text-center text-sm">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} GoldSaver. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </GoldProvider>
  );
};

export default Index;
