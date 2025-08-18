export type LocationLike =
  | string
  | {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      line1?: string;
      line2?: string;
    };

export function formatLocation(location: LocationLike | undefined | null): string {
  if (!location) return '';
  if (typeof location === 'string') return location;
  const parts = [location.address || location.line1, location.city, location.state, location.country]
    .filter(Boolean)
    .map((s) => String(s));
  return parts.join(', ');
}


