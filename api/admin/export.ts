import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../_sentry.js';
import { getBearerToken, getSupabaseConfig, getUserFromToken, isAdminUser, supabaseHeaders } from './mfa-utils.js';

const EXPORT_TABLES = ['projects', 'testimonials', 'site_settings', 'leads', 'newsletter_subscribers'] as const;
type ExportTable = typeof EXPORT_TABLES[number];

const OPTIONAL_TABLES = new Set<ExportTable>(['newsletter_subscribers']);

const isExportTable = (table: string): table is ExportTable => EXPORT_TABLES.includes(table as ExportTable);

const today = () => new Date().toISOString().slice(0, 10);

const getRows = async (supabaseUrl: string, serviceRoleKey: string, table: ExportTable) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
    headers: supabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${table} export failed: ${response.status} ${body}`);
  }

  return response.json();
};

const getRowsForBackup = async (supabaseUrl: string, serviceRoleKey: string, table: ExportTable) => {
  try {
    return await getRows(supabaseUrl, serviceRoleKey, table);
  } catch (error) {
    if (OPTIONAL_TABLES.has(table)) {
      console.warn('ADMIN_EXPORT_OPTIONAL_TABLE_SKIPPED', { table, error: error instanceof Error ? error.message : error });
      return [];
    }
    throw error;
  }
};

const csvEscape = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const raw = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
};

const toCsv = (rows: Record<string, unknown>[]) => {
  const headers = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach(key => set.add(key));
    return set;
  }, new Set<string>()));

  if (headers.length === 0) return '';
  return [
    headers.map(csvEscape).join(','),
    ...rows.map(row => headers.map(header => csvEscape(row[header])).join(',')),
  ].join('\n');
};

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token = getBearerToken(req);
    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    const user = await getUserFromToken(supabaseUrl, serviceRoleKey, token);

    if (!user?.id || !(await isAdminUser(supabaseUrl, serviceRoleKey, user.id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const format = String(req.query.format || 'json').toLowerCase();

    if (format === 'csv') {
      const table = String(req.query.table || 'leads');
      if (!isExportTable(table)) return res.status(400).json({ error: 'Invalid table' });
      const rows = await getRows(supabaseUrl, serviceRoleKey, table);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="vwb2-${table}-${today()}.csv"`);
      return res.status(200).send(toCsv(rows));
    }

    const entries = await Promise.all(EXPORT_TABLES.map(async table => [table, await getRowsForBackup(supabaseUrl, serviceRoleKey, table)]));
    const payload = {
      exported_at: new Date().toISOString(),
      site: 'Vos Web Designs',
      data: Object.fromEntries(entries),
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="vwb2-backup-${today()}.json"`);
    return res.status(200).send(JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error('ADMIN_EXPORT_ERROR', error);
    void captureException(error, { req, tags: { route: '/admin/export' } });
    return res.status(500).json({ error: 'Export failed' });
  }
}

export default wrapHandler(handler, { route: '/admin/export.ts' });
