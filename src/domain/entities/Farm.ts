type Geolocation = {
  _lat: number;
  _long: number;
}

class Farm {
  id: string;
  name: string;
  geolocation: Geolocation;
  available_products: string[];

  constructor(id: string, name: string, geolocation: Geolocation, available_products: string[]) {
    this.id = id;
    this.name = name;
    this.geolocation = geolocation;
    this.available_products = available_products;
  };
};

export default Farm;