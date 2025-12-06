import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Package,
  FileText,
  DollarSign,
  Boxes,
  Image as ImageIcon,
} from 'lucide-react';

function ProductForm({ initialData = {}, isLoading = false, serverErrors = {} }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    ...initialData,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="mt-8">
      <fieldset disabled={isLoading} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="sr-only">Product Name</label>
          <div className="relative">
            <Package className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="name" name="name" type="text" placeholder="Product Name" required value={product.name} onChange={handleChange} className="input-field" />
          </div>
          {serverErrors?.name && (
            <p className="mt-1 text-sm text-red-500">{serverErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="sr-only">Description</label>
          <div className="relative">
            <FileText className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <textarea id="description" name="description" placeholder="Description" rows="4" value={product.description} onChange={handleChange} className="input-field pt-2" />
          </div>
          {serverErrors?.description && (
            <p className="mt-1 text-sm text-red-500">{serverErrors.description[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="price" className="sr-only">Price</label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="price"
                name="price"
                type="number"
                placeholder="Price"
                required
                min="0.01"
                step="0.01"
                value={product.price}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            {serverErrors?.price && (
              <p className="mt-1 text-sm text-red-500">{serverErrors.price[0]}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="quantity" className="sr-only">Quantity in Stock</label>
            <div className="relative">
              <Boxes className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Quantity in Stock"
                required
                min="1"
                step="1"
                value={product.quantity}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            {serverErrors?.quantity && (
              <p className="mt-1 text-sm text-red-500">{serverErrors.quantity[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="image" className="sr-only">Main Product Image</label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="input-field file:hidden text-transparent"
            />
            <span className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 text-gray-500">
              {imageFile ? imageFile.name : 'Main Product Image'}
            </span>
          </div>
          {serverErrors?.image && (
            <p className="mt-1 text-sm text-red-500">{serverErrors.image[0]}</p>
          )}
        </div>

        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary/70" aria-disabled={isLoading} disabled={isLoading}>
          {isLoading ? 'Saving Product...' : 'Save Product'}
        </button>
      </fieldset>
    </div>
  );
}

ProductForm.propTypes = {
  initialData: PropTypes.object,
  isLoading: PropTypes.bool,
  serverErrors: PropTypes.object,
};

export default ProductForm;
