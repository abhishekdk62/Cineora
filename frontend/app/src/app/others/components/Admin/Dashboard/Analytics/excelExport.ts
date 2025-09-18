import * as XLSX from 'xlsx';

export interface TabPayload {
  name: string;                 // worksheet name
  rows: Record<string, any>[];  // flat objects → rows
}

export function exportTabsToExcel(tabs: TabPayload[], fileName = 'analytics.xlsx') {
  const wb = XLSX.utils.book_new();
  tabs.forEach(tab => {
    const ws = XLSX.utils.json_to_sheet(tab.rows);
    XLSX.utils.book_append_sheet(wb, ws, tab.name);
  });
  XLSX.writeFile(wb, fileName);             
}
