import { AddHouseForm } from "../../_components/forms/add-house-form";

const AddHousePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-2 pt-8 pb-12 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">Add Property</h1>
      <AddHouseForm />
    </div>
  );
};

export default AddHousePage;
