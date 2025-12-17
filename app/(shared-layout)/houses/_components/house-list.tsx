import { getHouses } from "../actions";

export default async function HouseList() {
  const houses = await getHouses();
  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <h1>House List</h1>
      <div>
        {houses.map((house) => (
          <p>{house.title}</p>
        ))}
      </div>
    </section>
  );
}
