export const getPaginationCount = ({
  total,
  perPage,
  page,
}: {
  total: number;
  perPage: number;
  page: number;
}) => {
  const count = Math.ceil(total / perPage);
  const offsetStart = (page - 1) * perPage + 1;
  const offsetEnd = Math.min(page * perPage, total);

  return {
    count,
    offsetStart,
    offsetEnd,
  };
};
