"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { compressImage } from "../../lib/compress-image";

import { LoaderIcon, Trash2, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HouseUpdateInput, LoadSchema } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinary-client";
import { houseUpdateSchema } from "@/lib/validation/zod-schemas";
import { toast } from "sonner";

const MAX_IMAGES = 3;

type ExistingImage = {
  id: string;
  url: string;
  publicId: string;
  markedForDelete: boolean;
};

type PendingImage = {
  file: File;
  preview: string;
};

export function UpdateHouseForm({
  houseId,
  initialImages,
  initialValues,
  initialHouseTypes,
  initialRegions,
  initialDivisions,
  initialSubdivisions,
  initialNeighborhoods,
}: {
  houseId: string;
  initialImages: ExistingImage[];
  initialValues: HouseUpdateInput;
  initialHouseTypes: Array<LoadSchema>;
  initialRegions: Array<LoadSchema>;
  initialDivisions: Array<LoadSchema>;
  initialSubdivisions: Array<LoadSchema>;
  initialNeighborhoods: Array<LoadSchema>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [houseTypes, setHouseTypes] =
    useState<Array<LoadSchema>>(initialHouseTypes);
  const [regions, setRegions] = useState<Array<LoadSchema>>(initialRegions);
  const [divisions, setDivisions] =
    useState<Array<LoadSchema>>(initialDivisions);
  const [subdivisions, setSubdivisions] =
    useState<Array<LoadSchema>>(initialSubdivisions);
  const [neighborhoods, setNeighborhoods] =
    useState<Array<LoadSchema>>(initialNeighborhoods);
  const form = useForm<HouseUpdateInput>({
    resolver: zodResolver(houseUpdateSchema) as Resolver<HouseUpdateInput>,
    defaultValues: initialValues,
  });
  const userChangedRegion = useRef(false);
  const userChangedDivision = useRef(false);
  const userChangedSubdivision = useRef(false);

  const [existingImages, setExistingImages] =
    useState<ExistingImage[]>(initialImages);

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const remainingExisting = useMemo(
    () => existingImages.filter((i) => !i.markedForDelete).length,
    [existingImages]
  );

  const availableSlots = MAX_IMAGES - remainingExisting - pendingImages.length;

  // 🔹 2. Watch fields
  const regionId = form.watch("regionId");
  const divisionId = form.watch("divisionId");
  const subdivisionId = form.watch("subdivisionId");

  // 🔹 3. Load divisions
  useEffect(() => {
    if (!regionId) return;

    fetch(`/api/divisions?regionId=${regionId}`)
      .then((res) => res.json())
      .then((data) => {
        setDivisions(data);

        // ❌ Don't clear on initial load
        if (!userChangedRegion.current) return;

        // ✅ Clear only on user interaction
        form.setValue("divisionId", "");
        form.setValue("subdivisionId", "");
        form.setValue("neighborhoodId", "");

        userChangedRegion.current = false;
      });
  }, [regionId, form]);

  // 🔹 4. Load subdivisions
  useEffect(() => {
    if (!divisionId) return;

    fetch(`/api/subdivisions?divisionId=${divisionId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubdivisions(data);

        if (!userChangedDivision.current) return;

        form.setValue("subdivisionId", "");
        form.setValue("neighborhoodId", "");

        userChangedDivision.current = false;
      });
  }, [divisionId, form]);

  // 🔹 5. Load neighborhoods
  useEffect(() => {
    if (!subdivisionId) return;

    fetch(`/api/neighborhoods?subdivisionId=${subdivisionId}`)
      .then((res) => res.json())
      .then((data) => {
        setNeighborhoods(data);

        if (!userChangedSubdivision.current) return;

        form.setValue("neighborhoodId", "");

        userChangedSubdivision.current = false;
      });
  }, [subdivisionId, form]);

  async function addImage(file: File) {
    if (availableSlots <= 0) return;

    const compressed = await compressImage(file);

    setPendingImages((prev) => [
      ...prev,
      {
        file: compressed,
        preview: URL.createObjectURL(compressed),
      },
    ]);
  }

  function toggleDelete(id: string) {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, markedForDelete: !img.markedForDelete } : img
      )
    );
  }

  function removePending(index: number) {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: HouseUpdateInput) {
    try {
      setIsLoading(true);
      /** 1. Upload new images */
      const uploadedImages = [];
      console.log("I am in");
      for (const img of pendingImages) {
        const uploaded = await uploadToCloudinary(img.file);
        uploadedImages.push(uploaded);
      }
      console.log(uploadedImages);
      /** 2. Collect deletions */
      const imagesToDelete = existingImages
        .filter((i) => i.markedForDelete)
        .map((i) => i.publicId);
      console.log(form.formState);
      /** 3. Send metadata only */
      const res = await fetch(`/api/houses/${houseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          imagesToDelete,
          newImages: uploadedImages,
        }),
      });

      const result = await res.json();
      console.log(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setIsLoading(false);
      toast.success(result.message);
      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
      const err = error as Error;
      console.log("Error updating house:", err.message);
      toast.error(err.message || "Failed to update");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>

              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FOR_RENT" id="for_rent" />
                    <Label htmlFor="for_rent">For rent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FOR_SALE" id="for_sale" />
                    <Label htmlFor="for_sale">For sale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SHORT_STAY" id="short_stay" />
                    <Label htmlFor="short_stay">Short stay</Label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="houseTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>House type</FormLabel>

              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select house type..." />
                  </SelectTrigger>

                  <SelectContent>
                    {houseTypes.map((ht) => (
                      <SelectItem key={ht.id} value={ht.id}>
                        {ht.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Modern one room for rent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10,000"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 flex-wrap mt-10">
          {/* Internal Toilet */}
          <FormField
            control={form.control}
            name="hasInternalToilet"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Has internal toilet</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parking */}
          <FormField
            control={form.control}
            name="hasParking"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Has parking</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Well */}
          <FormField
            control={form.control}
            name="hasWell"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Has well</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Has Fence */}
          <FormField
            control={form.control}
            name="hasFence"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Is Fenced</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Has Balcony */}
          <FormField
            control={form.control}
            name="hasBalcony"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Has balcony</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {/* Region */}
          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      userChangedRegion.current = true;
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="max-w-32 sm:max-w-48 md:max-w-56 truncate">
                      <SelectValue placeholder="Select region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Division */}
          <FormField
            control={form.control}
            name="divisionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      userChangedDivision.current = true;
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="max-w-32 sm:max-w-48 md:max-w-56 truncate">
                      <SelectValue placeholder="Select division..." />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subdivision */}
          <FormField
            control={form.control}
            name="subdivisionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdivision</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      userChangedSubdivision.current = true;
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="max-w-32 sm:max-w-48 md:max-w-56 truncate">
                      <SelectValue placeholder="Select subdivision..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subdivisions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Neighborhood */}
          <FormField
            control={form.control}
            name="neighborhoodId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="max-w-32 sm:max-w-48 md:max-w-56 truncate">
                      <SelectValue placeholder="Select neighborhood..." />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map((n) => (
                        <SelectItem key={n.id} value={n.id}>
                          {n.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Location</FormLabel>
              <FormControl>
                <Input placeholder="Carefour Obili" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EXISTING IMAGES */}
        <div className="grid grid-cols-3 gap-3">
          {existingImages.map((img) => (
            <div
              key={img.id}
              className="w-full h-36 rounded-md border border-dashed flex items-center justify-center overflow-hidden bg-muted"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className={`rounded ${
                    img.markedForDelete ? "opacity-40 grayscale" : ""
                  }`}
                />
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    `absolute top-1 right-1 ${
                      img.markedForDelete ? "bg-secondary" : "bg-red-500"
                    }`
                  )}
                  onClick={() => toggleDelete(img.id)}
                >
                  {img.markedForDelete ? (
                    <Undo size={4} />
                  ) : (
                    <Trash2 size={4} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <div className="grid grid-cols-3 gap-3">
          {pendingImages.map((img, i) => (
            <div
              key={i}
              className="w-full h-36 rounded-md border border-dashed flex items-center justify-center overflow-hidden bg-muted"
            >
              <div className="relative w-full h-full">
                <Image src={img.preview} alt="" fill className="rounded" />
                <Button
                  type="button"
                  size="sm"
                  className="absolute top-1 right-1 bg-red-500"
                  onClick={() => removePending(i)}
                >
                  X
                </Button>
              </div>
            </div>
          ))}

          {Array.from({ length: availableSlots }).map((_, i) => (
            <div
              key={i}
              className="w-full h-36 rounded-md border border-dashed flex items-center justify-center overflow-hidden bg-muted"
            >
              <label className="rounded flex items-center justify-center h-30 cursor-pointer flex-col  p-4 text-center">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && addImage(e.target.files[0])
                  }
                />
              </label>
            </div>
          ))}
        </div>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input hidden {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-x-2">
                <LoaderIcon className="size-4 animate-spin" /> Submitting
              </span>
            ) : (
              "Update House"
            )}
          </Button>
          <Button
            variant={"destructive"}
            disabled={form.formState.isSubmitting}
            type="button"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
