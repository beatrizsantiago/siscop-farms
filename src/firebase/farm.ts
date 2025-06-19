import { FarmRepository } from '@domain/repositories/FarmRepository';
import {
  addDoc, collection, deleteDoc, doc,
  DocumentReference,
  endAt, getDocs, limit, orderBy, query,
  startAt, updateDoc,
  where,
} from 'firebase/firestore';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

class FirebaseFarm implements FarmRepository {
  async add(farm: Farm): Promise<Farm> {
    const productsRefs = farm.available_products.map((product) =>
      doc(firestore, 'products', product)
    );

    const response = await addDoc(collection(firestore, 'farms'), {
      name: farm.name,
      geolocation: farm.geolocation,
      available_products: productsRefs,
    });

    const newFarm = {
      ...farm,
      id: response.id,
    };

    return newFarm;
  }

  async getAll(): Promise<Farm[]> {
    const farmsQuery = query(collection(firestore, 'farms'));
    const snapshot = await getDocs(farmsQuery);

    const farms: Farm[] = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();

      const productRefs = Array.isArray(data.available_products)
        ? data.available_products.filter((ref) => ref && typeof ref === 'object' && 'id' in ref)
        : [];

      const productIds = productRefs.map((ref: DocumentReference) => ref.id);

      return {
        id: docSnapshot.id,
        name: data.name,
        geolocation: data.geolocation,
        available_products: productIds,
      } as Farm; 
    });

    return farms;
  }

  async update(farm: Farm): Promise<Farm> {
    const productsRefs = farm.available_products.map((product) =>
      doc(firestore, 'products', product)
    );

    await updateDoc(doc(firestore, 'farms', farm.id), {
      name: farm.name,
      geolocation: farm.geolocation,
      available_products: productsRefs,
    });

    return farm;
  }

  async isFarmReferenced(collectionName: string, farmId: string): Promise<boolean> {
    const ref = collection(firestore, collectionName);
    const q = query(ref, where('farm_id', '==', doc(firestore, 'farms', farmId)), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async delete(id: string): Promise<void> {
    const collectionsToCheck = ['goals', 'inventory', 'kardex', 'sales'];

    for (const col of collectionsToCheck) {
      const referenced = await this.isFarmReferenced(col, id);
      if (referenced) {
        throw new Error(`REFERENCE_ERROR:${col}`);
      }
    }

    return await deleteDoc(doc(firestore, 'farms', id));
  }

  async searchByName(searchText: string): Promise<Farm[]> {
     const farmsQuery = query(
      collection(firestore, 'farms'),
      orderBy('name'),
      startAt(searchText),
      endAt(searchText + '\uf8ff')
    );

    const snapshot = await getDocs(farmsQuery);

    const farms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Farm));

    return farms;
  }
};

export const firebaseFarm = new FirebaseFarm();
