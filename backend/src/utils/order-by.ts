import { OrderByDto } from './dto/order-by.dto';

interface OrderByField {
  key: string;
  fields: string[];
  relations?: string[];
}

type OrderByEntry = {
  [key: string]: 'ASC' | 'DESC';
};

const buildNestedObject = (fields: string[], value: any) => {
  const result = {};
  let current = result;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    current[field] = i === fields.length - 1 ? value : {};
    current = current[field];
  }

  return result;
};

export default function OrderBy(
  query: OrderByDto,
  orderByFields: OrderByField[],
) {
  const field = orderByFields?.find(
    (field) => field.key === query.orderByColumn,
  );
  let orderBy: OrderByEntry = {};

  field?.fields?.map((subField) => {
    // If relations are provided, use them to build nested object
    if (field.relations && field.relations.length > 0) {
      const nestedFields = [...field.relations, subField];
      orderBy = {
        ...orderBy,
        ...buildNestedObject(nestedFields, query.orderDirection),
      };
    } else {
      orderBy = { ...orderBy, [subField]: query.orderDirection };
    }
  }) || [{ id: 'ASC' }];

  return field ? orderBy : ({ id: 'ASC' } as OrderByEntry);
}
