import { Flower2, Gift, Sparkles, Waves } from "lucide-react";

// Category → icon component map (lucide-react), ported from the approved
// mockup's emoji set.
export const ICONS = {
  Facial: Flower2,
  Body: Waves,
  Advanced: Sparkles,
  Special: Gift,
};

// Service categories in display order. The Services page filter prepends "All".
export const CATEGORIES = ["Facial", "Body", "Advanced", "Special"];
