
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
  const { records, deleteRecord, goldPrices } = useGold();
  const [isOpen, setIsOpen] = useState(true);
  
  if (records.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No gold records yet. Add your first record!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Your Gold Records</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span>Show</span>
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
                        {record.quantity}g of {record.karat}K {record.type}
                      </h3>
                      {record.purchaseDate && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(record.purchaseDate)}
                        </p>
                      )}
                      {record.shopName && (
                        <p className="text-sm text-muted-foreground">
                          From: {record.shopName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditRecord(record)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRecord(record.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 mt-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Price</p>
                      <p className="font-medium">{formatCurrency(record.purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
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
