
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe, Share2 } from "lucide-react";
import { useGold } from "@/contexts/GoldContext";
import { formatCurrency } from "@/lib/utils";

export const Header = () => {
  const { goldPrices, refreshPrices, isLoading } = useGold();

  return (
    <header className="bg-navy text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mr-3">
            <span className="text-navy-dark text-xl font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold">GoldSaver</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="text-sm text-right">
            <div className="flex items-center gap-2">
              <span>21K: {formatCurrency(goldPrices.k21)}/g</span>
              <span>24K: {formatCurrency(goldPrices.k24)}/g</span>
            </div>
            <div className="text-xs text-gray-300">
              Last updated: {goldPrices.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => refreshPrices()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="icon" variant="outline">
              <Globe className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
