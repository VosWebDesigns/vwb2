export const truncate = (value = '', max = 140) => {
  if (!value || value.length <= max) return value || '';
  return `${value.slice(0, max).trim()}…`;
};

export const formatYear = value => {
  if (!value) return 'Live';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Live' : date.getFullYear();
};

export const initials = value => (value || 'VWD')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0]?.toUpperCase())
  .join('');
