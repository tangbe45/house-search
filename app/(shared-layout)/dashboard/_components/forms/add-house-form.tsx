"use client";

import { Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { HouseCreateInput, HouseUpdateInput, LoadSchema } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { houseCreateSchema } from "@/lib/validation/zod-schemas";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AddHouseForm() {
  const router = useRouter();

  // lists loaded on mount or dynamically
  const [houseTypes, setHouseTypes] = useState<Array<LoadSchema>>([]);
  const [regions, setRegions] = useState<Array<LoadSchema>>([]);
  const [divisions, setDivisions] = useState<Array<LoadSchema>>([]);
  const [subdivisions, setSubdivisions] = useState<Array<LoadSchema>>([]);
  const [neighborhoods, setNeighborhoods] = useState<Array<LoadSchema>>([]);

  const form = useForm<HouseCreateInput>({
    resolver: zodResolver(houseCreateSchema) as Resolver<HouseCreateInput>,
    defaultValues: {
      purpose: "FOR_RENT",
      houseTypeId: "",
      title: "",
      description: "",
      location: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      hasInternalToilet: false,
      hasParking: false,
      hasWell: false,
      hasFence: false,
      hasBalcony: false,
      regionId: "",
      divisionId: "",
      subdivisionId: "",
      neighborhoodId: "",
    },
  });

  // image previews per input
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);

  async function handleImageChange(index: number, file: File | null) {
    if (!file) return;

    // compress on frontend (industry standard)
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });

    const newFiles = [...files];
    const newPreviews = [...previews];

    newFiles[index] = compressed;
    newPreviews[index] = URL.createObjectURL(compressed);

    setFiles(newFiles);
    setPreviews(newPreviews);
    console.log(previews);
    console.log(files);
  }

  function removeImageAt(index: number) {
    const newFiles = [...files];
    const newPreviews = [...previews];

    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!);
    }

    newFiles[index] = null;
    newPreviews[index] = null;

    setFiles(newFiles);
    setPreviews(newPreviews);
  }

  // watch parent selections for dynamic load
  const watchedRegion = form.watch("regionId");
  const watchedDivision = form.watch("divisionId");
  const watchedSubdivision = form.watch("subdivisionId");

  useEffect(() => {
    // load house types and regions on mount
    async function loadInitial() {
      const [htRes, rRes] = await Promise.all([
        fetch("/api/house-types").then((r) => r.json()),
        fetch("/api/regions").then((r) => r.json()),
      ]);
      setHouseTypes(htRes || []);
      setRegions(rRes || []);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    // load divisions when region changes
    if (!watchedRegion) {
      setDivisions([]);
      form.setValue("divisionId", "");
      return;
    }
    let mounted = true;
    fetch(`/api/divisions?regionId=${encodeURIComponent(watchedRegion)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setDivisions(data || []);
        form.setValue("divisionId", "");
        setSubdivisions([]);
        setNeighborhoods([]);
        form.setValue("subdivisionId", "");
        form.setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedRegion, form.setValue]);

  useEffect(() => {
    // load subdivisions when division changes
    if (!watchedDivision) {
      setSubdivisions([]);
      form.setValue("subdivisionId", "");
      return;
    }
    let mounted = true;
    fetch(`/api/subdivisions?divisionId=${encodeURIComponent(watchedDivision)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setSubdivisions(data || []);
        form.setValue("subdivisionId", "");
        setNeighborhoods([]);
        form.setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedDivision, form.setValue]);

  useEffect(() => {
    // load neighborhoods when subdivision changes
    if (!watchedSubdivision) {
      setNeighborhoods([]);
      form.setValue("neighborhoodId", "");
      return;
    }
    let mounted = true;
    fetch(
      `/api/neighborhoods?subdivisionId=${encodeURIComponent(
        watchedSubdivision
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setNeighborhoods(data || []);
        form.setValue("neighborhoodId", "");
      });
    return () => {
      mounted = false;
    };
  }, [watchedSubdivision, form.setValue]);

  async function onSubmit(values: HouseCreateInput) {
    try {
      const selectedImages = files.filter(Boolean) as File[];

      const uploaded = await Promise.all(
        selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "habi_move");

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          return res.json();
        })
      );

      const imageUrls = uploaded.map((img) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));

      // 2. send clean payload to backend
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: imageUrls,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setFiles([null, null, null]);
      setPreviews([null, null, null]);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to submit");
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
                <RadioGroup defaultValue="FOR_RENT" className="flex gap-4 mt-2">
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

        <div className="flex gap-6 flex-wrap">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Region */}
          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                    onValueChange={field.onChange}
                    disabled={divisions.length === 0}
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
                    onValueChange={field.onChange}
                    disabled={subdivisions.length === 0}
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={neighborhoods.length === 0}
                  >
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
        {/* Image selection grid */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Images (up to 3)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="w-full h-36 rounded-md border border-dashed flex items-center justify-center overflow-hidden bg-muted">
                  {previews[i] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews[i] || ""}
                        alt={`preview-${i}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow cursor-pointer"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <span className="text-sm text-muted-foreground">
                        Click to choose
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(i, e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-x-4">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting
              ? `${(
                  <LoaderIcon
                    role="status"
                    aria-label="Loading"
                    className={cn("size-4 animate-spin")}
                  />
                )} Submitting...`
              : "Submit"}
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
