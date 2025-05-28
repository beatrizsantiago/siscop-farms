import { FarmRepository } from '@domain/repositories/FarmRepository';
import {
  addDoc, collection, deleteDoc, doc,
  endAt, getDocs, orderBy, query,
  startAt, updateDoc,
} from 'firebase/firestore';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

class FirebaseFarm implements FarmRepository {
  async add(farm: Farm): Promise<Farm> {
    const response = await addDoc(collection(firestore, 'farms'), {
      name: farm.name,
      geolocation: farm.geolocation,
      available_products: farm.available_products,
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

    const farms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Farm));

    return farms;
  }

  async update(farm: Farm): Promise<Farm> {
    await updateDoc(doc(firestore, 'farms', farm.id), {
      name: farm.name,
      geolocation: farm.geolocation,
      available_products: farm.available_products,
    });

    return farm;
  }

  async delete(id: string): Promise<void> {
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
