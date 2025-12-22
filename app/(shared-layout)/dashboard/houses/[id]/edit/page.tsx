"use client";

import { get } from "http";
import UpdateHouseForm from "../../../_components/forms/update-house-form";
import { getHouseById } from "@/app/(shared-layout)/houses/actions";
import { Button } from "@/components/ui/button";

const AddHousePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const house = await getHouseById(id);

  return (
    <div className="max-w-3xl mx-auto px-2 pt-8 pb-12 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">Update House</h1>
      <UpdateHouseForm house={house} />
    </div>
  );
};

export default AddHousePage;
