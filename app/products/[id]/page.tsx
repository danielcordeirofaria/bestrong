import ProductCard from "@/components/ProductCard";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product || product.message) {
    return <p className="p-6 text-red-500">Product not found</p>;
  }

  return (
    <div className="p-6">
      <ProductCard
        id={product.id}
        title={product.title}
        price={product.price}
        image={product.image}
      />
    </div>
  );
}
