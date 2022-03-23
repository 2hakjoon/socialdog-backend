import {
  CursorPaginationArgs,
  CursorPaginationInputDto,
} from '../dtos/cursor-pagination';
import * as dayjs from 'dayjs';

export const createCursor = ({
  take,
  cursor,
}: CursorPaginationInputDto): CursorPaginationArgs => {
  const id = cursor?.id || '00000000-0000-0000-0000-000000000000';
  const createdAt = cursor?.createdAt
    ? dayjs(parseInt(cursor.createdAt)).format('YYYY-MM-DD HH:mm:ss.SSS')
    : dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

  return {
    take: take,
    cursor: {
      id,
      createdAt,
    },
  };
};
