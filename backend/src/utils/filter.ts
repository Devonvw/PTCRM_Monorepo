import Search from './search';

interface IFilterProps {
  condition: boolean;
  filter: object;
}

export default function Filters(
  search?: ReturnType<typeof Search>,
  filters?: IFilterProps[],
) {
  let filtersOut = {};

  filters.forEach((filter) => {
    if (filter.condition) filtersOut = { ...filtersOut, ...filter.filter };
  });

  if (search?.length > 0) {
    return search.map((s) => ({ ...s, ...filtersOut }));
  }

  return [filtersOut];
}
