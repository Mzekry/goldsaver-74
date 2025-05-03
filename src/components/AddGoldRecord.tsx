
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useGold } from "@/contexts/GoldContext";
import { GoldRecord, GoldType } from "@/types/gold";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AddGoldRecordProps {
  editRecord?: GoldRecord;
  onClose: () => void;
}

export const AddGoldRecord = ({ editRecord, onClose }: AddGoldRecordProps) => {
  const { addRecord, updateRecord, translations, language } = useGold();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(!!editRecord);
  
  const isEditing = !!editRecord;
  
  const [type, setType] = useState<GoldType>(editRecord?.type || "Sabikah");
  const [quantity, setQuantity] = useState<string>(editRecord?.quantity.toString() || "");
  const [purchasePrice, setPurchasePrice] = useState<string>(editRecord?.purchasePrice.toString() || "");
  const [purchaseDate, setPurchaseDate] = useState<string>(
    editRecord?.purchaseDate 
      ? editRecord.purchaseDate.toISOString().split('T')[0]
      : ""
  );
  const [shopName, setShopName] = useState<string>(editRecord?.shopName || "");
  const [company, setCompany] = useState<string>(editRecord?.company || "");
  const [productionCost, setProductionCost] = useState<string>(
    editRecord?.productionCost?.toString() || ""
  );
  const [cashback, setCashback] = useState<string>(editRecord?.cashback?.toString() || "");
  const [notes, setNotes] = useState<string>(editRecord?.notes || "");

  // Update form when editRecord changes
  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type);
      setQuantity(editRecord.quantity.toString());
      setPurchasePrice(editRecord.purchasePrice.toString());
      setPurchaseDate(editRecord.purchaseDate 
        ? editRecord.purchaseDate.toISOString().split('T')[0]
        : "");
      setShopName(editRecord.shopName || "");
      setCompany(editRecord.company || "");
      setProductionCost(editRecord.productionCost?.toString() || "");
      setCashback(editRecord.cashback?.toString() || "");
      setNotes(editRecord.notes || "");
      setOpen(true);
    }
  }, [editRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set karat based on type - and explicitly cast to accepted type
    const karat = type === "Pound" ? 21 as const : 24 as const;
    
    const recordData = {
      type,
      karat,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      shopName: shopName || undefined,
      company: company || undefined,
      productionCost: productionCost ? parseFloat(productionCost) : undefined,
      cashback: cashback ? parseFloat(cashback) : undefined,
      notes: notes || undefined,
    };
    
    if (isEditing && editRecord) {
      updateRecord(editRecord.id, recordData);
    } else {
      addRecord(recordData);
    }
    
    setOpen(false);
    onClose();
  };

  const handleButtonClick = () => {
    if (!user) {
      // Redirect to auth page if user is not authenticated
      toast({
        title: language === 'ar' ? "تسجيل الدخول مطلوب" : "Authentication Required",
        description: language === 'ar' ? "يرجى تسجيل الدخول لإضافة سجل ذهب جديد" : "Please sign in to add a new gold record",
      });
      navigate('/auth');
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      {!isEditing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-center mt-6 mb-10">
              <Button 
                className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white shadow-lg py-6 px-8"
                onClick={handleButtonClick}
              >
                <Plus className="h-5 w-5" />
                <span>{language === 'ar' ? 'إضافة سجل جديد' : 'Add New Record'}</span>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{translations.addNewRecord}</DialogTitle>
              <DialogDescription>{language === 'ar' ? 'أضف تفاصيل شراء الذهب أدناه.' : 'Add details about your gold purchase below.'}</DialogDescription>
            </DialogHeader>
            <GoldRecordForm
              type={type}
              setType={setType}
              quantity={quantity}
              setQuantity={setQuantity}
              purchasePrice={purchasePrice}
              setPurchasePrice={setPurchasePrice}
              purchaseDate={purchaseDate}
              setPurchaseDate={setPurchaseDate}
              shopName={shopName}
              setShopName={setShopName}
              company={company}
              setCompany={setCompany}
              productionCost={productionCost}
              setProductionCost={setProductionCost}
              cashback={cashback}
              setCashback={setCashback}
              notes={notes}
              setNotes={setNotes}
              handleSubmit={handleSubmit}
              isEditing={isEditing}
              translations={translations}
              language={language}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {isEditing && (
        <Dialog open={open} onOpenChange={(value) => {
          setOpen(value);
          if (!value) onClose();
        }}>
          <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{translations.editRecord}</DialogTitle>
              <DialogDescription>{language === 'ar' ? 'عدِّل تفاصيل سجل الذهب الخاص بك.' : 'Modify the details of your gold record.'}</DialogDescription>
            </DialogHeader>
            <GoldRecordForm
              type={type}
              setType={setType}
              quantity={quantity}
              setQuantity={setQuantity}
              purchasePrice={purchasePrice}
              setPurchasePrice={setPurchasePrice}
              purchaseDate={purchaseDate}
              setPurchaseDate={setPurchaseDate}
              shopName={shopName}
              setShopName={setShopName}
              company={company}
              setCompany={setCompany}
              productionCost={productionCost}
              setProductionCost={setProductionCost}
              cashback={cashback}
              setCashback={setCashback}
              notes={notes}
              setNotes={setNotes}
              handleSubmit={handleSubmit}
              isEditing={isEditing}
              translations={translations}
              language={language}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

interface GoldRecordFormProps {
  type: GoldType;
  setType: (type: GoldType) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  purchasePrice: string;
  setPurchasePrice: (price: string) => void;
  purchaseDate: string;
  setPurchaseDate: (date: string) => void;
  shopName: string;
  setShopName: (name: string) => void;
  company: string;
  setCompany: (company: string) => void;
  productionCost: string;
  setProductionCost: (cost: string) => void;
  cashback: string;
  setCashback: (cashback: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  translations: Record<string, any>;
  language: 'en' | 'ar';
}

const GoldRecordForm = ({
  type,
  setType,
  quantity,
  setQuantity,
  purchasePrice,
  setPurchasePrice,
  purchaseDate,
  setPurchaseDate,
  shopName,
  setShopName,
  company,
  setCompany,
  productionCost,
  setProductionCost,
  cashback,
  setCashback,
  notes,
  setNotes,
  handleSubmit,
  isEditing,
  translations,
  language
}: GoldRecordFormProps) => {
  const isRTL = language === 'ar';
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Tabs defaultValue="basic">
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">{isRTL ? 'معلومات أساسية' : 'Basic Info'}</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">{isRTL ? 'متقدم' : 'Advanced'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label>{isRTL ? 'نوع الذهب' : 'Gold Type'}</Label>
            <div className="text-sm text-muted-foreground mb-2">
              {isRTL ? 'سبيكة (عيار 24) أو جنيه (عيار 21)' : 'Sabikah (24K) or Pound (21K)'}
            </div>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as GoldType)}
              className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
            >
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <RadioGroupItem value="Sabikah" id="gold-type-sabikah" />
                <Label htmlFor="gold-type-sabikah">{isRTL ? 'سبيكة (عيار 24)' : 'Sabikah (24K)'}</Label>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <RadioGroupItem value="Pound" id="gold-type-pound" />
                <Label htmlFor="gold-type-pound">{isRTL ? 'جنيه (عيار 21)' : 'Pound (21K)'}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">{isRTL ? 'الكمية (جرام)' : 'Quantity (grams)'}</Label>
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={isRTL ? 'أدخل الكمية بالجرام' : 'Enter quantity in grams'}
              required
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">{isRTL ? 'إجمالي سعر الشراء (جنيه)' : 'Total Purchase Price (EGP)'}</Label>
            <Input
              id="purchasePrice"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder={isRTL ? 'أدخل السعر الإجمالي المدفوع' : 'Enter total price paid'}
              required
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">{isRTL ? 'تاريخ الشراء' : 'Purchase Date'}</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">{isRTL ? 'اسم المتجر' : 'Shop Name'}</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={isRTL ? 'من أين اشتريت الذهب؟' : 'Where did you buy it from?'}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">{isRTL ? 'شركة الذهب' : 'Gold Company'}</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={isRTL ? 'مثال: بي تي سي، إلخ.' : 'e.g. BTC, etc.'}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productionCost">{isRTL ? 'تكلفة التصنيع (جنيه)' : 'Production Cost (EGP)'}</Label>
            <Input
              id="productionCost"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={productionCost}
              onChange={(e) => setProductionCost(e.target.value)}
              placeholder={isRTL ? 'تكلفة التصنيع/الإنتاج' : 'Manufacturing/production cost'}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cashback">{isRTL ? 'استرداد نقدي لتكلفة التصنيع (جنيه)' : 'Production Cost Cashback (EGP)'}</Label>
            <Input
              id="cashback"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={cashback}
              onChange={(e) => setCashback(e.target.value)}
              placeholder={isRTL ? 'المبلغ المسترد مقابل التصنيع' : 'Money returned for production'}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRTL ? 'أي تفاصيل أخرى...' : 'Any other details...'}
              rows={3}
              className={isRTL ? 'text-right' : ''}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
        <Button type="submit" className="w-full sm:w-auto">
          {isEditing ? (isRTL ? translations.editRecord : 'Update Record') : (isRTL ? translations.addNewRecord : 'Add Record')}
        </Button>
      </div>
    </form>
  );
};
