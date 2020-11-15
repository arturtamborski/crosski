export function getData(key: string): string {
  try {
    return JSON.parse(localStorage.getItem(key) || '');
  } catch (err) {
    console.error(`Error getting item ${key} from localStorage`, err);
  }
  return '';
}

export function setData(key: string, item: any): void {
  try {
    return localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error(`Error storing item ${key} to localStorage`, err);
  }
};
