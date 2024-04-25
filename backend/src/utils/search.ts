import { ILike } from 'typeorm';
import { SearchDto } from './dto/search.dto';

function createSimpleObject(name, value) {
  var obj = {};
  obj[name] = value;
  return obj;
}

export default function Search(
  query: SearchDto,
  searchFields: {
    relations?: string[];
    field: string;
  }[],
) {
  const searchValue = ILike(`%${query?.search}%`);

  return query.search
    ? searchFields?.map((field) => {
        if (!field?.relations || field?.relations?.length === 0) {
          return { [field?.field]: searchValue };
        } else if (field?.relations && field?.relations?.length > 0) {
          let nestedSearchQuery = { [field.field]: searchValue };

          // Loop through relations and construct nested query
          for (let i = field.relations.length - 1; i >= 0; i--) {
            nestedSearchQuery = createSimpleObject(
              field.relations[i],
              nestedSearchQuery,
            );
          }

          return { ...nestedSearchQuery };
        }
      })
    : [];
}
