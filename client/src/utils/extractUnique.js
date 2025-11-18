export const extractUniqueBy = (items, getKey, getValue) => {
  if (!items) return [];
  const map = new Map(items
    .filter(item => getKey(item))
    .map(item => [getKey(item), getValue(item)])
  );
  return [...map.values()];
};

