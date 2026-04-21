export interface MedicineAnalysis {
    medicine_name: string | null;
    composition: {
      ingredient: string;
      mg: string;
    }[] | null;
  
    uses: string[] | null;
  
    safety: {
      level: "safe_otc" | "caution" | "doctor_required";
      reason: string;
    } | null;
  
    warnings: {
      bp: string | null;
      pregnancy: string | null;
      overdose: string | null;
    };
  
    dosage: {
      typical_range: string | null;
      max_per_day: string | null;
    };
  
    expiry_date: string | null;
  
    alternatives: string[] | null;
  
    confidence: number;
  
    disclaimer: string;
  }