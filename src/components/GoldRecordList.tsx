
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGold } from "@/contexts/GoldContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import { GoldRecord } from "@/types/gold";

interface GoldRecordListProps {
  onEditRecord: (record: GoldRecord) => void;
}

export const GoldRecordList = ({ onEditRecord }: GoldRecordListProps) => {
  const { records, deleteRecord, goldPrices, translations, language } = useGold();
  const [isOpen, setIsOpen] = useState(true);
  
  if (records.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <p className="text-muted-foreground">{translations.noRecords}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{translations.yourGoldRecords}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{translations.hide}</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span>{translations.show}</span>
            </>
          )}
        </Button>
      </div>
      
      {isOpen && (
        <div className="space-y-4">
          {records.map((record) => {
            const pricePerGram = record.karat === 21 ? goldPrices.k21 : goldPrices.k24;
            const currentValue = record.quantity * pricePerGram;
            const difference = currentValue - record.purchasePrice;
            const percentChange = ((difference / record.purchasePrice) * 100).toFixed(2);
            const isProfit = difference >= 0;
            
            return (
              <Card key={record.id} className="overflow-hidden border-l-4" style={{
                borderLeftColor: isProfit ? '#10B981' : '#EF4444'
              }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {record.quantity}g {language === 'ar' ? 'من الذهب عيار' : 'of'} {record.karat}K {language === 'en' ? record.type : 
                          record.type === 'Jewelry' ? 'مجوهرات' : 
                          record.type === 'Coin' ? 'عملات' : 
                          record.type === 'Bar' ? 'سبائك' : record.type}
                      </h3>
                      {record.purchaseDate && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(record.purchaseDate, language)}
                        </p>
                      )}
                      {record.shopName && (
                        <p className="text-sm text-muted-foreground">
                          {translations.from}: {record.shopName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditRecord(record)}
                        className="h-8 w-8"
                        title={translations.editRecord}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRecord(record.id)}
                        className="h-8 w-8 text-destructive"
                        title={translations.deleteRecord}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 mt-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.purchasePrice}</p>
                      <p className="font-medium">{formatCurrency(record.purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.currentValue}</p>
                      <p className="font-medium">{formatCurrency(currentValue)}</p>
                      <p className={`text-xs ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}{formatCurrency(difference)} ({percentChange}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
