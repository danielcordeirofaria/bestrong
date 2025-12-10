import { fetchSellerProfile } from '@/app/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const profile = await fetchSellerProfile(params.id);

    if (!profile) {
        return {
            title: 'Seller Not Found',
        };
    }

    return {
        title: profile.seller.name,
        description: profile.seller.bio || `Check out ${profile.seller.name}'s profile on Handcrafted Haven`,
    };
}

export default async function SellerProfilePage({ params }: { params: { id: string } }) {
    const profile = await fetchSellerProfile(params.id);

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
                <p>The seller you are looking for does not exist.</p>
                <Link href="/" className="text-primary hover:underline mt-4 inline-block">Return Home</Link>
            </div>
        );
    }

    const { seller, products } = profile;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-ui-border p-6 mb-8 text-center md:text-left md:flex md:items-center md:gap-8">
                <div className="relative h-24 w-24 mx-auto md:mx-0 rounded-full overflow-hidden bg-gray-200 border-2 border-primary">
                    {seller.profile_image ? (
                        <Image
                            src={seller.profile_image}
                            alt={seller.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-500">
                            {seller.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">{seller.name}</h1>
                    {seller.bio ? (
                        <p className="text-gray-600 max-w-2xl">{seller.bio}</p>
                    ) : (
                        <p className="text-gray-400 italic">This seller hasn't written a bio yet.</p>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-text-main">Collection</h2>
            {products.length === 0 ? (
                <p className="text-gray-500">No products available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group block">
                            <div className="flex flex-col overflow-hidden rounded-lg border border-ui-border bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-lg h-full">
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={product.image_url || 'https://placehold.co/400x400/F8F5F2/3E3E3E?text=Image'}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-text-main group-hover:text-primary line-clamp-1">{product.name}</h3>
                                        {product.category && (
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xl font-bold text-text-main">${Number(product.price).toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
