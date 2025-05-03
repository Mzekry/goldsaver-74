
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGold } from "@/contexts/GoldContext";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const GoldSummary = () => {
  const { totalPurchaseValue, currentValue, isZakatEligible, zakatAmount, translations, language } = useGold();
  
  // Calculate profit/loss
  const difference = currentValue - totalPurchaseValue;
  const percentChange = totalPurchaseValue > 0 
    ? ((difference / totalPurchaseValue) * 100)
    : 0;
  
  const isProfit = difference >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="card-highlight">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{translations.totalPurchaseValue}</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalPurchaseValue)}</p>
        </CardContent>
      </Card>
      
      <Card className="card-highlight">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{translations.currentValue}</h3>
          <p className="text-2xl font-bold">{formatCurrency(currentValue)}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
              {isProfit ? '+' : ''}{formatCurrency(difference)} ({percentChange.toFixed(2)}%)
            </span>
          </div>
          <Progress
            value={totalPurchaseValue > 0 ? (currentValue / totalPurchaseValue) * 100 : 0}
            className="h-1 mt-2"
          />
        </CardContent>
      </Card>
      
      <Card className="card-highlight">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{translations.zakatCalculation}</h3>
          {isZakatEligible ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{translations.eligibleForZakat}</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(zakatAmount)}</p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-amber-600">
                {translations.notEligibleForZakat}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
