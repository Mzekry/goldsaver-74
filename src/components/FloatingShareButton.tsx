
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useGold } from "@/contexts/GoldContext";

export const FloatingShareButton = () => {
  const [sharing, setSharing] = useState(false);
  const { translations, language } = useGold();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: translations.appName,
          text: translations.share,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      } finally {
        setSharing(false);
      }
    } else {
      // Fallback for browsers that don't support share API
      alert(`${translations.copyLink}: ${window.location.href}`);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={sharing}
      className="fixed left-4 bottom-4 rounded-full w-12 h-12 p-0 shadow-lg bg-gold hover:bg-gold/90 text-navy-dark flex items-center justify-center"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Share2 size={24} />
    </Button>
  );
};
