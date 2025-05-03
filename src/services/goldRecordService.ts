
import { supabase } from '@/integrations/supabase/client';
import { GoldRecord } from '@/types/gold';
import { v4 as uuidv4 } from 'uuid';

// Get all gold records for the current user
export async function getUserGoldRecords(): Promise<GoldRecord[]> {
  const { data, error } = await supabase
    .from('gold_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gold records:', error);
    throw new Error(error.message);
  }

  // Transform database records to app GoldRecord type
  return (data || []).map((record): GoldRecord => ({
    id: record.id,
    type: record.type as any,
    karat: record.karat,
    quantity: record.quantity,
    purchasePrice: record.purchase_price,
    purchaseDate: record.purchase_date ? new Date(record.purchase_date) : undefined,
    shopName: record.shop_name || undefined,
    company: record.company || undefined,
    productionCost: record.production_cost || undefined,
    cashback: record.cashback || undefined,
    notes: record.notes || undefined,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }));
}

// Add a new gold record
export async function addGoldRecord(record: Omit<GoldRecord, "id" | "createdAt" | "updatedAt">): Promise<GoldRecord> {
  const newId = uuidv4();
  
  const { data, error } = await supabase
    .from('gold_records')
    .insert({
      id: newId,
      type: record.type,
      karat: record.karat,
      quantity: record.quantity,
      purchase_price: record.purchasePrice,
      purchase_date: record.purchaseDate?.toISOString(),
      shop_name: record.shopName,
      company: record.company,
      production_cost: record.productionCost,
      cashback: record.cashback,
      notes: record.notes,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding gold record:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    type: data.type as any,
    karat: data.karat,
    quantity: data.quantity,
    purchasePrice: data.purchase_price,
    purchaseDate: data.purchase_date ? new Date(data.purchase_date) : undefined,
    shopName: data.shop_name || undefined,
    company: data.company || undefined,
    productionCost: data.production_cost || undefined,
    cashback: data.cashback || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Update an existing gold record
export async function updateGoldRecord(id: string, record: Partial<GoldRecord>): Promise<GoldRecord> {
  const updates: any = {};
  
  if (record.type) updates.type = record.type;
  if (record.karat) updates.karat = record.karat;
  if (record.quantity !== undefined) updates.quantity = record.quantity;
  if (record.purchasePrice !== undefined) updates.purchase_price = record.purchasePrice;
  if (record.purchaseDate) updates.purchase_date = record.purchaseDate.toISOString();
  if (record.shopName !== undefined) updates.shop_name = record.shopName;
  if (record.company !== undefined) updates.company = record.company;
  if (record.productionCost !== undefined) updates.production_cost = record.productionCost;
  if (record.cashback !== undefined) updates.cashback = record.cashback;
  if (record.notes !== undefined) updates.notes = record.notes;
  
  const { data, error } = await supabase
    .from('gold_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating gold record:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    type: data.type as any,
    karat: data.karat,
    quantity: data.quantity,
    purchasePrice: data.purchase_price,
    purchaseDate: data.purchase_date ? new Date(data.purchase_date) : undefined,
    shopName: data.shop_name || undefined,
    company: data.company || undefined,
    productionCost: data.production_cost || undefined,
    cashback: data.cashback || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Delete a gold record
export async function deleteGoldRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('gold_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gold record:', error);
    throw new Error(error.message);
  }
}
