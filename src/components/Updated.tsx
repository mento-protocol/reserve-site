interface Props {
  date?: string | number;
  humanDate?: string;
}

export function Updated({ date, humanDate }: Props) {
  return (
    <small className="mb-[36px] block">
      <strong>Updated </strong>

      {date
        ? new Date(date).toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : humanDate}
    </small>
  );
}
