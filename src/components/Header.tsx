
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useGold } from "@/contexts/GoldContext";
import { formatCurrency } from "@/lib/utils";

export const Header = () => {
  const { goldPrices, switchLanguage, language } = useGold();

  return (
    <header className="bg-navy text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between max-w-md">
        <div className="flex items-center w-full justify-between mb-4">
          {/* Left side - empty to balance the layout */}
          <div className="w-10 invisible"> </div>
          
          {/* Center - App title */}
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mr-3">
              <span className="text-navy-dark text-xl font-bold">G</span>
            </div>
            <h1 className="text-2xl font-bold">Gold Tracker</h1>
          </div>
          
          {/* Right side - Language switcher */}
          <div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => switchLanguage()}
              className="bg-gold text-navy hover:bg-gold/80 border-gold"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
          </div>
        </div>
        
        <div className="w-full bg-navy-light rounded-lg p-3 text-center sm:text-left">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-300">21K</div>
              <div className="text-lg font-bold">{formatCurrency(goldPrices.k21)}/g</div>
            </div>
            <div>
              <div className="text-xs text-gray-300">24K</div>
              <div className="text-lg font-bold">{formatCurrency(goldPrices.k24)}/g</div>
            </div>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Last updated: {goldPrices.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};
