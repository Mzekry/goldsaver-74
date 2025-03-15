
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

interface AddGoldRecordProps {
  editRecord?: GoldRecord;
  onClose: () => void;
}

export const AddGoldRecord = ({ editRecord, onClose }: AddGoldRecordProps) => {
  const { addRecord, updateRecord } = useGold();
  const [open, setOpen] = useState(!!editRecord);
  
  const isEditing = !!editRecord;
  
  const [type, setType] = useState<GoldType>(editRecord?.type || "Pound");
  const [karat, setKarat] = useState<21 | 24>(editRecord?.karat || (type === "Pound" ? 21 : 24));
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

  // Update karat when type changes
  useEffect(() => {
    if (type === "Pound") {
      setKarat(21);
    } else if (type === "Sabikah") {
      setKarat(24);
    }
  }, [type]);

  // Update form when editRecord changes
  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type);
      setKarat(editRecord.karat);
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

  return (
    <>
      {!isEditing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Gold Record</DialogTitle>
              <DialogDescription>Add details about your gold purchase below.</DialogDescription>
            </DialogHeader>
            <GoldRecordForm
              type={type}
              setType={setType}
              karat={karat}
              setKarat={setKarat}
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
            />
          </DialogContent>
        </Dialog>
      )}
      
      {isEditing && (
        <Dialog open={open} onOpenChange={(value) => {
          setOpen(value);
          if (!value) onClose();
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Gold Record</DialogTitle>
              <DialogDescription>Modify the details of your gold record.</DialogDescription>
            </DialogHeader>
            <GoldRecordForm
              type={type}
              setType={setType}
              karat={karat}
              setKarat={setKarat}
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
  karat: 21 | 24;
  setKarat: (karat: 21 | 24) => void;
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
}

const GoldRecordForm = ({
  type,
  setType,
  karat,
  setKarat,
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
}: GoldRecordFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label>Gold Type</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as GoldType)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pound" id="gold-type-pound" />
                <Label htmlFor="gold-type-pound">Pound (21K)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sabikah" id="gold-type-sabikah" />
                <Label htmlFor="gold-type-sabikah">Sabikah (24K)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Karat</Label>
            <div className="text-sm text-muted-foreground mb-2">
              {type === "Pound" ? "Default: 21K" : "Default: 24K"}
            </div>
            <RadioGroup 
              value={karat.toString()} 
              onValueChange={(value) => setKarat(parseInt(value) as 21 | 24)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="21" id="gold-karat-21" />
                <Label htmlFor="gold-karat-21">21K</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="gold-karat-24" />
                <Label htmlFor="gold-karat-24">24K</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity in grams"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Total Purchase Price (EGP)</Label>
            <Input
              id="purchasePrice"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Enter total price paid"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Where did you buy it from?"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Gold Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. BTC, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productionCost">Production Cost (EGP)</Label>
            <Input
              id="productionCost"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={productionCost}
              onChange={(e) => setProductionCost(e.target.value)}
              placeholder="Manufacturing/production cost"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cashback">Production Cost Cashback (EGP)</Label>
            <Input
              id="cashback"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={cashback}
              onChange={(e) => setCashback(e.target.value)}
              placeholder="Money returned for production"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other details..."
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto">
          {isEditing ? "Update Record" : "Add Record"}
        </Button>
      </div>
    </form>
  );
};
