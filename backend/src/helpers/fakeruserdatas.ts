import { faker } from '@faker-js/faker';

export const generateFakeAddress = () => {
  return {
    addressline1: faker.location.streetAddress(),
    addressline2: faker.location.secondaryAddress(),
    addresscity: faker.location.city(),
    addresstate: faker.location.state(),
    addresspostcode: faker.location.zipCode(),
  };
};
