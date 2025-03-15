
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe, Share2 } from "lucide-react";
import { useGold } from "@/contexts/GoldContext";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export const Header = () => {
  const { goldPrices, refreshPrices, isLoading, switchLanguage, language } = useGold();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: 'GoldSaver',
          text: 'Track your gold investments with GoldSaver!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      } finally {
        setSharing(false);
      }
    } else {
      // Fallback for browsers that don't support share API
      alert('Copy this link to share: ' + window.location.href);
    }
  };

  return (
    <header className="bg-navy text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between max-w-md">
        <div className="flex items-center w-full justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mr-3">
              <span className="text-navy-dark text-xl font-bold">G</span>
            </div>
            <h1 className="text-2xl font-bold">GoldSaver</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => refreshPrices()}
              disabled={isLoading}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => switchLanguage()}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleShare}
              disabled={sharing}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
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
