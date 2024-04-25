import { PaginationDto } from './pagination.dto';

export default function Pagination(query: PaginationDto) {
  return {
    skip: query.pageIndex * query.pageSize,
    take: +query.pageSize,
  };
}
