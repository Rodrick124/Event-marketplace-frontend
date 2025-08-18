export interface ExtractedResponse<T> {
  data: T;
  pagination?: any;
}

export function extractData<T = any>(raw: any): ExtractedResponse<T> {
  const pagination = raw?.pagination || raw?.meta?.pagination || raw?.meta;

  const candidates = [
    raw?.data,
    raw?.result,
    raw?.results,
    raw?.items,
    raw?.payload,
    raw?.value,
    raw
  ];

  let payload: any = undefined;
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      payload = candidate;
      break;
    }
  }

  return { data: payload as T, pagination };
}


