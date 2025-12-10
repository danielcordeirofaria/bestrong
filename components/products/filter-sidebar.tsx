'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function FilterSidebar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilterChange = useDebouncedCallback((term: string, type: 'category' | 'minPrice' | 'maxPrice') => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(type, term);
        } else {
            params.delete(type);
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full md:w-64 space-y-6 flex-shrink-0">
            <div>
                <h3 className="font-semibold mb-4 text-text-main">Categories</h3>
                <div className="space-y-2">
                    {['clothing', 'equipment', 'nutrition', 'merchandise'].map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={searchParams.get('category') === cat}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="form-radio text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                            />
                            <span className="capitalize text-text-main">{cat}</span>
                        </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            value=""
                            checked={!searchParams.get('category')}
                            onChange={() => handleCategoryChange('')}
                            className="form-radio text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                        />
                        <span className="capitalize text-text-main">All Categories</span>
                    </label>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-4 text-text-main">Price Range</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="minPrice" className="text-sm text-gray-500">Min Price</label>
                        <input
                            id="minPrice"
                            type="number"
                            placeholder="0"
                            defaultValue={searchParams.get('minPrice')?.toString()}
                            onChange={(e) => handleFilterChange(e.target.value, 'minPrice')}
                            className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary bg-transparent text-text-main"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="text-sm text-gray-500">Max Price</label>
                        <input
                            id="maxPrice"
                            type="number"
                            placeholder="1000"
                            defaultValue={searchParams.get('maxPrice')?.toString()}
                            onChange={(e) => handleFilterChange(e.target.value, 'maxPrice')}
                            className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary bg-transparent text-text-main"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
