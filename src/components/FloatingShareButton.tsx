
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export const FloatingShareButton = () => {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: 'Gold Tracker',
          text: 'Track your gold investments with Gold Tracker!',
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
    <Button
      onClick={handleShare}
      disabled={sharing}
      className="fixed left-4 bottom-4 rounded-full w-12 h-12 p-0 shadow-lg bg-gold hover:bg-gold/90 text-navy-dark flex items-center justify-center"
    >
      <Share2 size={24} />
    </Button>
  );
};
