import { getHouses } from "../actions";

export default async function HouseList() {
  const houses = await getHouses();
  console.log(houses);
  return (
    <section className="min-h-screen flex justify-center items-center">
      <h1>House List</h1>
    </section>
  );
}
