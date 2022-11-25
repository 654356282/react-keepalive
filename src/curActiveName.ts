const curActiveName: Map<string, any> = new Map();

export function getCurActiveName(id: string) {
  return curActiveName.get(id);
}

export function setCurActiveName(id: string, name: any) {
  curActiveName.set(id, name);
}

export function deleteCurActiveName(id: string) {
  curActiveName.delete(id);
}
