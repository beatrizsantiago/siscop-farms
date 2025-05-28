import { ProductRepository } from '@domain/repositories/ProductRepository';
import { collection, getDocs, query } from 'firebase/firestore';
import Product from '@domain/entities/Product';

import { firestore } from './config';

class FirebaseProduct implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const producsQuery = query(collection(firestore, 'products'));
    const snapshot = await getDocs(producsQuery);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));

    return products;
  }
};

export const firebaseProduct = new FirebaseProduct();
