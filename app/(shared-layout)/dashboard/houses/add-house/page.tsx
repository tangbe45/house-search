import { AddPropertyForm } from "../../_components/forms/add-property-form";

const AddHousePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-2 pt-8 pb-12 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">Add Property</h1>
      <AddPropertyForm />
    </div>
  );
};

export default AddHousePage;
