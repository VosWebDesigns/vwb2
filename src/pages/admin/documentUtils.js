export const cleanDocumentNote = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^https?:\/\/[^\s]+\/admin\/documents/i.test(line))
    .filter((line) => !/^https?:\/\/www\.voswebdesigns\.nl\/admin\/documents/i.test(line))
    .filter((line) => !/^https?:\/\/voswebdesigns\.nl\/admin\/documents/i.test(line));
  return lines.join('\n');
};

export const isPrintableNote = (value) => cleanDocumentNote(value).length > 0;
