import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

type OrderStatus = "pending" | "paid" | "failed";

interface Props {
  id: string;
  product: string;
  total: number;
  status: OrderStatus;
}

export default function OrderCard({ id, product, total, status }: Props) {
  return (
    <div
      className="
bg-white
rounded-2xl
border
shadow-sm
p-5
hover:shadow-md
transition
"
    >
      <div
        className="
flex
justify-between
items-start
"
      >
        <div
          className="
flex
gap-4
"
        >
          <div
            className="
bg-indigo-100
text-indigo-600
p-3
rounded-xl
"
          >
            <Package size={22} />
          </div>

          <div>
            <p
              className="
text-xs
text-gray-400
"
            >
              Order ID
            </p>

            <h3
              className="
font-bold
"
            >
              {id}
            </h3>

            <p
              className="
mt-2
text-gray-600
"
            >
              {product}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div
        className="
border-t
mt-5
pt-4
flex
justify-between
items-center
"
      >
        <div>
          <p
            className="
text-xs
text-gray-400
"
          >
            Total
          </p>

          <p
            className="
font-bold
text-lg
"
          >
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>

        <Link
          href={`/orders/${id}`}
          className="
flex
items-center
gap-1
bg-black
text-white
px-4
py-2
rounded-xl
text-sm
"
        >
          Detail
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
