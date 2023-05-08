import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";


const productsCollectionRef = collection(db, "products");

const useProducts = () => {
  // Function to fetch all products from Firestore
  const getAllProducts = async () => {
    const snapshot = await getDocs(productsCollectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  // Function to fetch a single product by ID from Firestore
  const getProductById = async id => {
    const doc = await getDoc(productsCollectionRef.doc(id));
    if (doc.exists()) {
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  };

  // Function to add a new product to Firestore
  const addProduct = async (product, images) => {
    const { name, category, description, price } = product;
    const newProductRef = productsCollectionRef.doc();
    const imageUrls = await uploadProductImages(images, newProductRef.id);
    await newProductRef.set({
      name,
      category,
      description,
      price,
      imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newProductRef.id;
  };

  const updateProduct = async (id, updates, newImages) => {
    const { name, category, description, price, imageUrls } = updates;
    if (newImages && newImages.length > 0) {
      // Upload new images and get their URLs
      const newImageUrls = await uploadProductImages(newImages, id);
      // Delete old images from Firebase Storage
      await Promise.all(imageUrls.map(url => deleteImage(url)));
      // Update product with new image URLs
      await productsCollectionRef.doc(id).update({
        name,
        category,
        description,
        price,
        imageUrls: newImageUrls,
        updatedAt: new Date(),
      });
    } else {
      // Update product without changing images
      await productsCollectionRef.doc(id).update({
        name,
        category,
        description,
        price,
        updatedAt: new Date(),
      });
    }
  };

  const uploadProductImages = async (images, productId) => {
    const imageUrls = [];
    const storage = getStorage();
    const productImagesRef = ref(storage, `products/${productId}/images`);
    for (const image of images) {
      const imageName = `${Date.now()}_${image.name}`;
      const imageRef = ref(productImagesRef, imageName);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }
    return imageUrls;
  };

  const deleteProductImages = async (imageUrls, productId) => {
    await Promise.all(imageUrls.map(url => deleteImage(url)));
    const storage = getStorage();
    const productImagesRef = ref(storage, `products/${productId}/images`);
    await deleteObject(productImagesRef);
  };

  const deleteImage = async (imageUrl) => {
    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  };


  // Function to delete a product from Firestore
  const deleteProduct = async id => {
    await deleteDoc(productsCollectionRef.doc(id));
  };

  return {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProductImages,
  };
};

export default useProducts;


