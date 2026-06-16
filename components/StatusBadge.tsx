export default function StatusBadge({ status }: { status: string }) {
  const style = {
    pending: "bg-yellow-100 text-yellow-700",

    paid: "bg-green-100 text-green-700",

    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
px-3
py-1
rounded-full
text-sm
font-semibold
${style[status as keyof typeof style]}
`}
    >
      {status.toUpperCase()}
    </span>
  );
}
